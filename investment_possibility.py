import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# 데이터베이스 정보 가져오기
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 3306)  # 기본 포트는 3306
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

def get_investment_totals(business_type, start_year, end_year):
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
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# 예시 사용
business_type = "IT"
start_year = 2019
end_year = 2023
results = get_investment_totals(business_type, start_year, end_year)

# 결과를 저장할 리스트
investment_data = []

# 결과 출력
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

# 저장된 결과 출력
for data in investment_data:
    print(f"{data['year']}년 전체 투자금: {data['total_investment']}")
    print(f"{data['year']}년 {business_type}의 투자금: {data['specific_investment']}")
    print(f"{data['year']}년 {business_type}의 투자금 비율: {data['percentage']:.2f}%")
    print()  # 줄바꿈
