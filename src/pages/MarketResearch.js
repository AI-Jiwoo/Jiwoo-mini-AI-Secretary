import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Flex, Box, Text, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Input, Button } from '@chakra-ui/react';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker';
import NewsContent from '../component/common/NewsContent';
import ResultTable from '../component/common/ResultTable';

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MarketResearch = () => {
    const location = useLocation();
    const businessInfo = location.state || {};

    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [keyword, setKeyword] = useState(businessInfo.business || '');
    const [newsArticles, setNewsArticles] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const positiveData = [
        { policy: "동물 어쩌구 법", result: "긍정", count: 506 },
        { policy: "식품 법", result: "긍정", count: 500 },
        { policy: "아동 법", result: "긍정", count: 230 },
        { policy: "그 밖의 안전4법", result: "긍정", count: 120 },
    ];

    const negativeData = [
        { policy: "환경 규제법", result: "부정", count: 300 },
        { policy: "세금 인상법", result: "부정", count: 250 },
    ];

    const etcData = [
        { policy: "기타 정책 1", result: "기타", count: 150 },
        { policy: "기타 정책 2", result: "기타", count: 100 },
    ];

    useEffect(() => {
        if (businessInfo.business) {
            setKeyword(businessInfo.business);
            fetchNews();
        }
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/news`, {
                params: {
                    keyword: keyword,
                    start_date: startDate,
                    end_date: endDate
                }
            });
            setNewsArticles(response.data);
            generateReactions(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateReactions = async (articles) => {
        const reactionsPromises = articles.map(article =>
            axios.post('http://127.0.0.1:8000/reaction', {
                article_summary: article.text.substring(0, 200)
            })
        );

        try {
            const reactionsResponses = await Promise.all(reactionsPromises);
            setReactions(reactionsResponses.map(response => response.data.reaction));
        } catch (error) {
            console.error('Error generating reactions:', error);
        }
    };

    const formatDate = (date) => {
        if (!date) return '정보 없음';
        if (typeof date === 'string') return date;
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <PageLayout>
            <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>사업 정보</Text>
                <Text>회사명: {businessInfo.companyName}</Text>
                <Text>국적: {businessInfo.nationality}</Text>
                <Text>업종: {businessInfo.business}</Text>
                <Text>설립연도: {formatDate(businessInfo.establishmentYear)}</Text>
                <Text>기업 규모: {businessInfo.companySize}</Text>
                <Text>주소: {businessInfo.address}</Text>
                <Text>주요 제품/서비스: {businessInfo.products}</Text>
            </Box>

            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(e) => setStartDate(e.target.value)}
                onEndDateChange={(e) => setEndDate(e.target.value)}
            />
            <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색 키워드 입력"
                mb={4}
            />
            <Button onClick={fetchNews} isLoading={isLoading} mb={4}>분석 시작</Button>

            <Flex gap={6}>
                <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[미디어 데이터] 뉴스 및 미디어 데이터 분석 결과</Text>
                    <VStack align="stretch" spacing={4}>
                        {newsArticles.map((article, index) => (
                            <NewsContent
                                key={index}
                                title={article.title}
                                content={article.text.substring(0, 200) + '...'}
                                reaction={reactions[index]}
                                url={article.url}
                            />
                        ))}
                    </VStack>
                </Box>

                <Box width="60%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Tabs>
                        <TabList mb={4}>
                            <Tab>긍정</Tab>
                            <Tab>부정</Tab>
                            <Tab>etc</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p={0}>
                                <ResultTable data={positiveData} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <ResultTable data={negativeData} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <ResultTable data={etcData} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>

            <Box bg="white" borderRadius="lg" p={6} mt={6} boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" mb={4}>[분석 결과 요약]</Text>
                <VStack align="stretch" spacing={4}>
                    <Box>
                        <Text fontWeight="bold" mb={2}>전체 분석 결과</Text>
                        <Text>총 {newsArticles.length}건의 뉴스 기사를 분석한 결과, 긍정적인 평가가 56%, 부정적인 평가가 32%, 중립적인 평가가 12%로 나타났습니다.</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" mb={2}>주요 긍정적 요인</Text>
                        <Text>1. 동물 보호법 개정으로 인한 동물 복지 향상</Text>
                        <Text>2. 식품안전법 강화로 소비자 신뢰도 상승</Text>
                        <Text>3. 아동 보호 정책 확대로 사회 안전망 강화</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" mb={2}>주요 부정적 요인</Text>
                        <Text>1. 환경 규제법 강화로 인한 기업 부담 증가</Text>
                        <Text>2. 세금 인상에 대한 시민들의 불만</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold" mb={2}>향후 제언</Text>
                        <Text>1. 긍정적 평가를 받은 정책들의 지속적인 모니터링 및 개선</Text>
                        <Text>2. 부정적 평가를 받은 정책에 대한 보완책 마련</Text>
                        <Text>3. 중립적 평가를 받은 정책들에 대한 추가 홍보 및 설명 필요</Text>
                    </Box>
                </VStack>
            </Box>
        </PageLayout>
    );
};

export default MarketResearch;