from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from market_research import market_research_router
from investment_possibility import investment_possibility_router
from news_crawling import news_crawling_router

app = FastAPI()

# CORS 설정
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 필요한 메서드만 포함
    allow_headers=["*"],  # 필요한 헤더만 포함
)

# 라우터 포함
app.include_router(market_research_router, prefix="/market_research", tags=["Market Research"])
app.include_router(investment_possibility_router, prefix="/investment_possibility", tags=["Investment Possibility"])
app.include_router(news_crawling_router, prefix="/news_crawling", tags=["News Crawling"])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
