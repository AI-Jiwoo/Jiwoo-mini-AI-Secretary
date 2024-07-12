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

    useEffect(() => {
        if (businessInfo.business) {
            setKeyword(businessInfo.business);
            fetchNews();
        }
    }, [businessInfo]);

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
            const articles = response.data;
            setNewsArticles(articles);
            await fetchReactions(articles);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReactions = async (articles) => {
        const reactionsPromises = articles.map(article => {
            const requestBody = {
                article_summary: article.text.substring(0, 200),
                subject_name: businessInfo.companyName,
                business_field: businessInfo.business,
                nationality: businessInfo.nationality,
                company_size: businessInfo.companySize,
                established_year: businessInfo.establishmentYear,
                main_products_services: businessInfo.products,
                market_position: businessInfo.marketPosition
            };

            console.log('Request Body:', requestBody);  // 콘솔에 requestBody 출력

            return axios.post('http://127.0.0.1:8000/reaction', requestBody)
                .then(response => response.data)
                .catch(error => {
                    console.error('Error generating reaction:', error);
                    return { reaction: 'unknown', summary: 'analysis failed' };
                });
        });

        try {
            const reactionsData = await Promise.all(reactionsPromises);
            setReactions(reactionsData);
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
                {/* 왼쪽: 미디어 데이터 */}
                <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[미디어 데이터] 뉴스 및 미디어 데이터 분석 결과</Text>
                    <VStack align="stretch" spacing={4}>
                        {newsArticles.map((article, index) => (
                            <NewsContent
                                key={index}
                                title={article.title}
                                content={article.text.substring(0, 200) + '...'}
                                reaction={reactions[index]?.reaction}
                                summary={reactions[index]?.summary}
                                url={article.url}
                            />
                        ))}
                    </VStack>
                </Box>

                {/* 오른쪽: 분석 결과 */}
                <Box width="60%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Tabs>
                        <TabList mb={4}>
                            <Tab>긍정</Tab>
                            <Tab>부정</Tab>
                            <Tab>기타</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p={0}>
                                <ResultTable data={reactions.filter(r => r.reaction === '긍정적')} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <ResultTable data={reactions.filter(r => r.reaction === '부정적')} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <ResultTable data={reactions.filter(r => !['긍정적', '부정적'].includes(r.reaction))} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>

            {/* 분석 결과 요약 */}
            <Box bg="white" borderRadius="lg" p={6} mt={6} boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" mb={4}>[분석 결과 요약]</Text>
                <VStack align="stretch" spacing={4}>
                    <Box>
                        <Text fontWeight="bold" mb={2}>전체 분석 결과</Text>
                        <Text>총 {reactions.length}건의 뉴스 기사를 분석한 결과, 긍정적인 평가가 {reactions.filter(r => r.reaction === '긍정적').length}%, 부정적인 평가가 {reactions.filter(r => r.reaction === '부정적').length}%, 중립적인 평가가 {reactions.filter(r => !['긍정적', '부정적'].includes(r.reaction)).length}%로 나타났습니다.</Text>
                    </Box>
                </VStack>
            </Box>
        </PageLayout>
    );
};

export default MarketResearch;
