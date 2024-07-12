import os
import sys
import pytest
from unittest.mock import patch
from io import StringIO

# 현재 작업 디렉토리를 기준으로 상대 경로로 market_research 모듈을 import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from market_research import scrape_news, generate_summary, generate_reaction

@pytest.fixture
def subject_info():
    return {
        'subject_name': "지우",
        'business_field': "IT",
        'nationality': "한국",
        'company_size': "스타트업",
        'established_year': "2024",
        'main_products_services': "AI비서",
        'market_position': "신생기업"
    }

def test_scrape_news():
    # 테스트할 입력 데이터
    keyword = "AI"
    start_date = "2023-01-01"
    end_date = "2023-01-31"
    
    # 기대하는 기사 수
    expected_num_articles = 5
    
    # 기사 스크랩 함수 호출
    articles = scrape_news(keyword, start_date, end_date)
    
    # 결과 검증
    assert len(articles) == expected_num_articles, "기대한 수의 기사가 수집되지 않았습니다."
    
    for article in articles:
        assert 'title' in article, "기사 제목이 존재하지 않습니다."
        assert 'text' in article, "기사 내용이 존재하지 않습니다."
        assert 'url' in article, "기사 URL이 존재하지 않습니다."
        assert isinstance(article['title'], str), "기사 제목이 문자열 형식이 아닙니다."
        assert isinstance(article['text'], str), "기사 내용이 문자열 형식이 아닙니다."
        assert isinstance(article['url'], str), "기사 URL이 문자열 형식이 아닙니다."

def test_generate_summary():
    # 테스트할 입력 데이터
    article_text = "이 기사는 테스트를 위한 더미 기사 내용입니다."
    
    # 요약 생성 함수 호출
    summary = generate_summary(article_text)
    
    # 출력 결과 확인
    assert isinstance(summary, str), "요약된 결과가 문자열 형식이 아닙니다."
    assert len(summary) > 0, "요약된 내용이 비어있습니다."

def test_generate_reaction(subject_info):
    # 테스트할 입력 데이터
    article_summary = "이 기사는 테스트를 위한 더미 기사 요약입니다."
    
    # 반응 생성 함수 호출
    reaction = generate_reaction(article_summary, subject_info)
    
    # 출력 결과 확인
    assert isinstance(reaction, str), "반응 결과가 문자열 형식이 아닙니다."
    assert len(reaction) > 0, "반응 내용이 비어있습니다."
