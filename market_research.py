import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from newspaper import Article
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from datetime import datetime
import feedparser

# .env 파일 로드
load_dotenv()

app = FastAPI()

class NewsRequest(BaseModel):
    keyword: str
    start_date: str
    end_date: str

class ReactionRequest(BaseModel):
    article_summary: str

def scrape_news(keyword: str, start_date: str, end_date: str):
    # 시작 날짜와 끝 날짜로부터 기간을 계산하여 날짜 형식으로 변환
    start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
    end_datetime = datetime.strptime(end_date, '%Y-%m-%d')

    # RSS 피드 URL 설정
    rss_url = f'https://news.google.com/rss/search?q={keyword}&hl=ko&gl=KR&ceid=KR:ko' \
              f'&startdate={start_datetime.strftime("%Y-%m-%d")}&enddate={end_datetime.strftime("%Y-%m-%d")}'

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
            'text': article.text,
            'url': article_url
        })

    return articles

def generate_summary(article_text: str):
    prompt = f"다음 기사의 핵심내용을 요약해 주세요:\n\n{article_text}"

    # OpenAI GPT 모델 초기화
    gpt_model = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"), model="gpt-3.5-turbo")

    # GPT 모델을 사용하여 요약 생성
    response = gpt_model.invoke(prompt, max_tokens=200, stop=None)

    # 요약의 content 부분 추출
    summary = response.content.strip()

    return summary

def generate_reaction(article_summary: str, subject_info: dict):
    prompt = f"이제부터 당신은 {subject_info['subject_name']}라는 기업의 CEO입니다. " \
             f"{subject_info['subject_name']}는 {subject_info['nationality']}의 {subject_info['business_field']} 분야에 속하는 " \
             f"{subject_info['company_size']} 사업체로, {subject_info['established_year']}년에 설립되었으며, " \
             f"주요 제품/서비스로는 {subject_info['main_products_services']}를 제공하고 있습니다. " \
             f"{subject_info['subject_name']}는 {subject_info['market_position']}입니다. " \
             f"다음 기사에 대한 요약을 부여받은 역할의 관점으로 읽고, 각각의 기사가 사업을 진행하는 것에 있어서 해당분야 전문가로서 유리한지 불리한지 판단을 하고 유리하면 긍정적, 불리하면 부정적으로 표현 해주세요. " \
             f"그리고 그에 대한 이유와 개선할 내용을 함께 출력해 주세요.\n\n" \
             f"기사 요약: {article_summary}\n\n" \
             f"예시)\n\n" \
             f"반응: 부정적\n\n" \
             f"이유: CES 2024의 트렌드는 지속 가능성과 AI 발전을 강조합니다. 이는 {subject_info['subject_name']}의 AI 비서 서비스가 최신 기술 트렌드를 반영하고, 지속 가능한 접근을 통해 시장에서의 경쟁력을 강화하는 데 도움이 됩니다. 혁신적인 기술 채택으로 브랜드 이미지를 제고할 수 있습니다.\n\n" \
             f"개선: CES 2024에서 강조된 지속 가능성과 AI 발전은 {subject_info['subject_name']}의 AI 비서 서비스와 밀접한 관련이 있습니다. {subject_info['subject_name']}는 이러한 최신 기술 트렌드를 빠르게 흡수하고 자사의 제품에 적용함으로써 시장에서의 경쟁력을 높일 수 있습니다. 예를 들어, 더욱 정교한 자연어 처리 기술 개발이나 환경 친화적인 AI 알고리즘 구현을 통해 지속 가능한 기술 솔루션을 제공할 수 있습니다.\n\n"

    # OpenAI GPT 모델 초기화
    gpt_model = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"), model="gpt-3.5-turbo")

    # GPT 모델을 사용하여 반응 생성
    response = gpt_model.invoke(prompt, max_tokens=700, stop=None)

    # 반응의 content 부분 추출
    reaction = response.content.strip()

    return reaction

@app.get('/api/news')
async def get_news(keyword: str, start_date: str, end_date: str):
    news_articles = scrape_news(keyword, start_date, end_date)

    if not news_articles:
        raise HTTPException(status_code=404, detail=f"'{keyword}'에 대한 {start_date}부터 {end_date}까지의 뉴스를 찾을 수 없습니다.")

    return news_articles

@app.post('/api/reaction')
async def generate_reaction_endpoint(reaction_request: ReactionRequest):
    article_summary = reaction_request.article_summary
    subject_info = {
        'subject_name': input("사업체의 이름을 입력하세요: "),
        'business_field': input("사업 분야를 입력하세요 (예: IT, 의료, 교육): "),
        'nationality': input("국적을 입력하세요: "),
        'company_size': input("기업 규모를 입력하세요 (예: 대기업, 중소기업, 스타트업): "),
        'established_year': input("설립 연도를 입력하세요: "),
        'main_products_services': input("주요 제품/서비스를 입력하세요: "),
        'market_position': input("시장 위치를 입력하세요 (예: 선도 기업, 신생 기업): ")
    }
    reaction = generate_reaction(article_summary, subject_info)

    return {'reaction': reaction}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
