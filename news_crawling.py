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

def extract_company_names(titles):
    try:
        prompt_message = "다음 제목들에서 회사명을 추출해줘:\n\n" + "\n".join(titles) + "\n\n회사명들을 쉼표로 구분하여 반환해줘."
        response = client.chat.completions.create(
            model=OPEN_AI_API_MODEL,
            messages=[{"role": "user", "content": prompt_message}],
            max_tokens=100
        )
        company_names = response.choices[0].message.content.strip().split(',')
        return [name.strip() for name in company_names]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract company names: {str(e)}")

def analyze_companies(articles):
    try:
        titles = [article['title'] for article in articles]
        company_names = extract_company_names(titles)
        company_analysis = []
        for company_name in company_names:
            analysis = {
                'company': company_name,
                'advantages': f"{company_name}의 주요 강점 분석",
                'disadvantages': f"{company_name}의 주요 약점 분석"
            }
            company_analysis.append(analysis)
        return company_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze companies: {str(e)}")

def generate_improvement_suggestions(company_analysis):
    try:
        suggestions = []
        for company in company_analysis:
            prompt_message = (
                f"다음은 {company['company']} 기업의 분석 내용이다:\n\n"
                f"강점:\n{company['advantages']}\n\n"
                f"약점:\n{company['disadvantages']}\n\n"
                "이 기업의 개선 방향을 제안해줘."
            )
            response = client.chat.completions.create(
                model=OPEN_AI_API_MODEL,
                messages=[
                    {"role": "system", "content": "너는 창업가나 소규모 사장님들을 위한 컨설턴트야."},
                    {"role": "user", "content": prompt_message}
                ],
                max_tokens=150
            )
            suggestion = response.choices[0].message.content.strip()
            suggestions.append({
                'company': company['company'],
                'suggestions': suggestion
            })
        return suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate improvement suggestions: {str(e)}")

@news_crawling_router.post("/analyze")
async def analyze_keyword(request: KeywordRequest):
    try:
        scraped_articles = scrape_news(request.keyword)
        company_analysis = analyze_companies(scraped_articles)
        improvement_suggestions = generate_improvement_suggestions(company_analysis)
        return improvement_suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))