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

def get_investment_totals(business_type):
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

            # 2023년도 투자금 총액 쿼리
            total_query = """
            SELECT SUM(investment_amount)
            FROM jiwoo.tbl_status_investment_company
            WHERE YEAR(investment_date) = 2023;
            """
            cursor.execute(total_query)
            total_investment = cursor.fetchone()[0]

            # 특정 business_type의 2023년도 투자금 쿼리
            specific_query = """
            SELECT SUM(investment_amount)
            FROM jiwoo.tbl_status_investment_company
            WHERE YEAR(investment_date) = 2023 AND business_type = %s;
            """
            cursor.execute(specific_query, (business_type,))
            specific_investment = cursor.fetchone()[0]

            return total_investment, specific_investment

    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# 예시 사용
business_type = "IT"
total, specific = get_investment_totals(business_type)
print(f"2023년 전체 투자금: {total}")
print(f"{business_type}의 2023년 투자금: {specific}")
