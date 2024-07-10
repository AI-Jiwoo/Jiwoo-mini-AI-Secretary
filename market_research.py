import feedparser
from newspaper import Article
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

def scrape_news(keyword):
    # RSS 피드 URL 설정
    rss_url = f'https://news.google.com/rss/search?q={keyword}&hl=ko&gl=KR&ceid=KR:ko'
    
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
            'text': article.text,
            'url': article_url
        })
    
    return articles

def analyze_sentiment_korean(text):
    # Hugging Face의 사전 학습된 감정 분석 모델 불러오기
    model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    # 텍스트를 토크나이즈
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    # 모델을 통해 감정 분석 수행
    with torch.no_grad():
        outputs = model(**inputs)
    
    # 출력 로짓을 소프트맥스로 변환하여 확률로 계산
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
    sentiment_score = torch.argmax(probabilities, dim=1).item()

    # 감정 점수 변환 (0: 부정, 2: 중립, 4: 긍정)
    if sentiment_score <= 1:
        return '부정'
    elif sentiment_score == 2:
        return '중립'
    else:
        return '긍정'

def explain_sentiment(text, sentiment):
    if sentiment == '중립':
        return "이 기사는 중립적인 감정을 유발하는 내용입니다."
    else:
        # 감정을 유발한 텍스트의 일부 추출
        explanation = f"기사에서 주체에게 {sentiment} 감정을 느끼게 한 부분은 '{text[:100]}' 등의 내용 때문입니다."
        return explanation

if __name__ == '__main__':
    # 사용자로부터 주체 정보 입력 받기
    subject_name = input("사업체의 이름을 입력하세요: ")
    business_field = input("사업 분야를 입력하세요 (예: IT, 의료, 교육): ")
    nationality = input("국적을 입력하세요: ")
    company_size = input("기업 규모를 입력하세요 (예: 대기업, 중소기업, 스타트업): ")
    established_year = input("설립 연도를 입력하세요: ")
    main_products_services = input("주요 제품/서비스를 입력하세요: ")
    market_position = input("시장 위치를 입력하세요 (예: 선도 기업, 신생 기업): ")
    
    # 주체 정보 분석
    print(f"\n분석 대상 주체 정보:")
    print(f"사업체 이름: {subject_name}")
    print(f"사업 분야: {business_field}")
    print(f"국적: {nationality}")
    print(f"기업 규모: {company_size}")
    print(f"설립 연도: {established_year}")
    print(f"주요 제품/서비스: {main_products_services}")
    print(f"시장 위치: {market_position}\n")

    # 키워드 입력 받기
    user_keyword = input("키워드를 입력하세요: ")
    news_articles = scrape_news(user_keyword)
    
    if not news_articles:
        print(f"'{user_keyword}'에 대한 뉴스를 찾을 수 없습니다.")
    else:
        for idx, article in enumerate(news_articles, 1):
            text = article['text']
            url = article['url']
            
            # 감정 분석
            sentiment = analyze_sentiment_korean(text)
            
            # 감정 설명
            explanation = explain_sentiment(text, sentiment)
            
            # 기사 출력
            print(f"기사 {idx}:")
            print(f"감정 분석 결과: {sentiment}")
            print(f"감정 설명: {explanation}")
            print(f"기사 URL: {url}")
            print()
