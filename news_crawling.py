import feedparser
from newspaper import Article
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
from urllib.parse import quote

# .env 파일에서 환경 변수 불러오기
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv("OPEN_AI_API_KEY")

# FastAPI 앱 생성
app = FastAPI()

# 요청 모델 정의
class KeywordRequest(BaseModel):
    keyword: str

def scrape_news(keyword):
    # URL 인코딩 처리
    encoded_keyword = quote(keyword)
    # RSS 피드 URL 설정
    rss_url = f'https://news.google.com/rss/search?q={encoded_keyword}&hl=ko&gl=KR&ceid=KR:ko'
    
    # RSS 피드 파싱
    feed = feedparser.parse(rss_url)
    
    articles = []
    
    # 각 기사 URL 추출 및 내용 스크랩
    for entry in feed.entries[:5]:  # 처음 5개의 기사만 처리
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

def extract_company_name(title):
    prompt_message = (
        f"다음 제목에서 회사명을 추출해줘:\n\n"
        f"제목: {title}\n\n"
        "회사명을 반환해줘."
    )

    # OpenAI API 요청
    client = openai.OpenAI(
            api_key=os.getenv("OPEN_AI_API_KEY")
    )

    response = client.chat.completions.create(
        model=os.getenv("OPENAI_API_MODEL"),
        messages=[
                {"role": "user", "content": prompt_message}
        ],
        max_tokens=50
    )

    company_name = response.choices[0].message
    return company_name

def analyze_companies(articles):
    company_analysis = []
    for article in articles:
        # 기사의 텍스트에서 기업명 추출 (간단한 예시로 여기에선 기사 제목을 기업명으로 사용)
        company_name = extract_company_name(article['title'])

        analysis = {
            'company': company_name,
            'advantages': f"{company_name}의 주요 강점 분석",
            'disadvantages': f"{company_name}의 주요 약점 분석"
        }
        company_analysis.append(analysis)
    return company_analysis

def generate_improvement_suggestions(company_analysis):
    suggestions = []
    for company in company_analysis:
        prompt_message = (
            f"다음은 {company['company']} 기업의 분석 내용이다:\n\n"
            f"강점:\n{company['advantages']}\n\n"
            f"약점:\n{company['disadvantages']}\n\n"
            "이 기업의 개선 방향을 제안해줘."
        )

        # OpenAI API 요청
        client = openai.OpenAI(
            api_key=os.getenv("OPEN_AI_API_KEY")
        )

        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_API_MODEL"),
            messages=[
                {"role": "system", "content": "너는 창업가나 소규모 사장님들을 위한 컨설턴트야."},
                {"role": "user", "content": prompt_message}
            ]
        )

        suggestions.append({
            'company': company['company'],
            'suggestions': completion.choices[0].message
        })
    return suggestions

@app.post("/analyze")
async def analyze_keyword(request: KeywordRequest):
    try:
        # 뉴스 스크랩 실행
        scraped_articles = scrape_news(request.keyword)
        
        # 관련 기업 분석
        company_analysis = analyze_companies(scraped_articles)
        
        # 개선 방향 제안 생성
        improvement_suggestions = generate_improvement_suggestions(company_analysis)
        
        # 결과 반환
        return improvement_suggestions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
