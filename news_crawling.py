import feedparser
from newspaper import Article
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from urllib.parse import quote

# .env 파일에서 환경 변수 불러오기
load_dotenv()

# 환경 변수 검증
required_env_vars = ["OPEN_AI_API_KEY", "OPEN_AI_API_MODEL"]
for var in required_env_vars:
    if not os.getenv(var):
        raise EnvironmentError(f"{var} is not set in the environment variables")

OPEN_AI_API_KEY = os.getenv("OPEN_AI_API_KEY")
OPEN_AI_API_MODEL = os.getenv("OPEN_AI_API_MODEL")

# OpenAI 클라이언트 생성
client = OpenAI(api_key=OPEN_AI_API_KEY)

# FastAPI 라우터 생성
news_crawling_router = APIRouter()

# 요청 모델 정의
class KeywordRequest(BaseModel):
    keyword: str

def scrape_news(keyword: str):
    try:
        encoded_keyword = quote(keyword)
        rss_url = f'https://news.google.com/rss/search?q={encoded_keyword}&hl=ko&gl=KR&ceid=KR:ko'
        feed = feedparser.parse(rss_url)
        articles = []
        for entry in feed.entries[:5]:
            article_url = entry.link
            article = Article(article_url)
            article.download()
            article.parse()
            articles.append({
                'title': article.title,
                'url': article_url,
                'text': article.text,
                'published': entry.published
            })
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape news: {str(e)}")

def analyze_companies_and_generate_suggestions(articles):
    try:
        articles_text = "\n".join([f"{i+1}. {article['title']}" for i, article in enumerate(articles)])
        prompt_message = (
            f"다음은 최근 뉴스 기사 제목 목록입니다:\n\n"
            f"{articles_text}\n\n"
            "각 기사 제목에서 회사명을 추출하고, 각 회사의 주요 강점과 약점을 분석하여 개선 방향을 제안해줘. "
            "결과를 다음과 같은 형식으로 반환해줘:\n"
            "회사명: <회사명>\n"
            "강점: <강점>\n"
            "약점: <약점>\n"
            "개선 방향: <개선 방향>\n"
        )

        response = client.chat.completions.create(
            model=OPEN_AI_API_MODEL,
            messages=[
                {"role": "system", "content": "너는 창업가나 소규모 사장님들을 위한 컨설턴트야."},
                {"role": "user", "content": prompt_message}
            ],
            max_tokens=1500  # Adjusted token limit to ensure complete response
        )

        suggestions = response.choices[0].message.content.strip()
        result = []

        # 파싱할 때 줄 바꿈을 기준으로 데이터를 분리
        suggestion_blocks = suggestions.split("\n\n")
        for block in suggestion_blocks:
            company_info = {}
            lines = block.split("\n")
            for line in lines:
                if line.startswith("회사명:"):
                    company_info['company'] = line.replace("회사명:", "").strip()
                elif line.startswith("강점:"):
                    company_info['advantages'] = line.replace("강점:", "").strip()
                elif line.startswith("약점:"):
                    company_info['disadvantages'] = line.replace("약점:", "").strip()
                elif line.startswith("개선 방향:"):
                    company_info['suggestions'] = line.replace("개선 방향:", "").strip()
            if company_info:  # 빈 블록은 무시
                result.append(company_info)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze companies and generate suggestions: {str(e)}")
    
@news_crawling_router.post("/analyze")
async def analyze_keyword(request: KeywordRequest):
    try:
        scraped_articles = scrape_news(request.keyword)
        improvement_suggestions = analyze_companies_and_generate_suggestions(scraped_articles)
        return improvement_suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))