from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
from openai import OpenAI

# .env 파일 로드
load_dotenv()

# 데이터베이스 정보 가져오기
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 3306)  # 기본 포트는 3306
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
OPEN_AI_API_MODEL = os.getenv("OPEN_AI_API_MODEL")

client = OpenAI(api_key=OPEN_AI_API_KEY)

investment_possibility_router = APIRouter()

class InvestmentRequest(BaseModel):
    business_type: str
    start_year: int
    end_year: int

def get_investment_totals(business_type: str, start_year: int, end_year: int):
    try:
        # MySQL 데이터베이스 연결
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # 년도별 전체 투자금과 특정 분야 투자금 쿼리
            query = """
            SELECT YEAR(investment_date) AS year,
                   SUM(investment_amount) AS total_investment,
                   SUM(CASE WHEN business_type = %s THEN investment_amount ELSE 0 END) AS specific_investment
            FROM jiwoo.tbl_status_investment_company
            WHERE YEAR(investment_date) BETWEEN %s AND %s
            GROUP BY YEAR(investment_date)
            ORDER BY YEAR(investment_date);
            """
            cursor.execute(query, (business_type, start_year, end_year))
            results = cursor.fetchall()

            return results

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database query failed")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@investment_possibility_router.post("/get-investment-data/")
async def get_investment_data(request: InvestmentRequest):
    try:
        results = get_investment_totals(request.business_type, request.start_year, request.end_year)

        # 결과를 저장할 리스트
        investment_data = []

        # 결과 출력 및 리스트 저장
        for result in results:
            year, total_investment, specific_investment = result
            if total_investment > 0:
                percentage = (specific_investment / total_investment) * 100
            else:
                percentage = 0

            # 결과를 리스트에 저장
            investment_data.append({
                'year': year,
                'total_investment': total_investment,
                'specific_investment': specific_investment,
                'percentage': percentage
            })

        # OpenAI API 요청을 위한 메시지 생성
        prompt_message = f"다음은 {request.business_type} 분야에 대한 투자 데이터입니다:\n\n"
        for data in investment_data:
            prompt_message += (
                f"{data['year']}년 전체 투자금: {data['total_investment']}원, "
                f"{request.business_type} 분야 투자금: {data['specific_investment']}원, "
                f"{request.business_type} 분야 투자금 비율: {data['percentage']:.2f}%\n"
            )
        prompt_message += "\n이 데이터를 바탕으로, 이 분야가 최근 투자를 잘 받고 있는지, 앞으로 투자를 잘 받을 수 있을지 평가해 주세요."
        prompt_message += "\n답변은 다음과 같이 이루어진다."
        prompt_message += "\n긍정 여부: true or false"
        prompt_message += "\n사유: 그렇게 판단한 이유"

        # OpenAI API 요청

        response = client.chat.completions.create(model=OPEN_AI_API_MODEL,
        messages=[
            {"role": "system", "content": "너는 창업가나 소규모 사장님들을 위한 컨설턴트야."},
            {"role": "user", "content": prompt_message}
        ])

        # OpenAI API 응답 출력
        answer = response.choices[0].message.content

        return {
            # "investment_data": investment_data,
            "evaluation": answer
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")