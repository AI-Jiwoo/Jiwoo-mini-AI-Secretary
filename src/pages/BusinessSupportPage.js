import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Flex,
    Text,
    VStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker';
import PolicyTable from '../component/common/PolicyTable';
import Overlay from '../component/common/Overlay';

ChartJS.register(ArcElement, Tooltip, Legend);

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const BusinessSupportPage = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingPolicy, setIsLoadingPolicy] = useState(true);
    const [isLoadingPublic, setIsLoadingPublic] = useState(false);
    const [policyData, setPolicyData] = useState([]);
    const [publicData, setPublicData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        if (query) {
            setSearchQuery(query);
            fetchPolicyData(query);
        }
    }, [location]);

    const fetchPolicyData = async (query) => {
        setIsLoadingPolicy(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/business', {
                params: {
                    query: query
                }
            });
            console.log('Received data:', response.data);
            setPolicyData(response.data);
        } catch (error) {
            console.error('정책 데이터 불러오기 실패:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        } finally {
            setIsLoadingPolicy(false);
        }
    };

    const handleTabChange = (index) => {
        setActiveTab(index);
        if (index === 1 && !publicData.length) {
            setIsLoadingPublic(true);
            fetchPublicData(searchQuery);
        }
    };

    const fetchPublicData = (query) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setPublicData([
                    { policy: "공공 데이터 1", result: "긍정", count: 300 },
                    { policy: "공공 데이터 2", result: "부정", count: 150 },
                    { policy: "공공 데이터 3", result: "기타", count: 80 },
                ]);
                setIsLoadingPublic(false);
                resolve();
            }, 2500);
        }).catch((error) => {
            console.error('공공 데이터 불러오기 실패:', error);
            setIsLoadingPublic(false);
        });
    };

    const pieChartData = {
        labels: ['긍정', '부정', '기타'],
        datasets: [
            {
                data: [83.6, 11.4, 5],
                backgroundColor: ['#3182CE', '#E53E3E', '#ECC94B'],
            },
        ],
    };

    return (
        <PageLayout>
            <VStack spacing={6} align="stretch">
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(e) => setStartDate(e.target.value)}
                    onEndDateChange={(e) => setEndDate(e.target.value)}
                />

                {searchQuery && (
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">검색어: "{searchQuery}"</Text>
                    </Box>
                )}

                <Flex gap={6}>
                    <Box width="50%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                        <Tabs index={activeTab} onChange={handleTabChange}>
                            <TabList>
                                <Tab>정책 데이터</Tab>
                                <Tab>공공 데이터</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {isLoadingPolicy ? (
                                        <Overlay />
                                    ) : (
                                        <>
                                            <Text fontSize="xl" fontWeight="bold" mb={4}>[정책 데이터] 공공 데이터 및 K-Startup 분석 결과</Text>
                                            {policyData.map((article, index) => (
                                                <Box key={index} mb={4}>
                                                    <Text fontWeight="bold">{article.title}</Text>
                                                    <Text>{article.text.substring(0, 200)}...</Text>
                                                    <Text as="a" color="blue.500" href={article.url} target="_blank" rel="noopener noreferrer">
                                                        원문 보기
                                                    </Text>
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                </TabPanel>
                                <TabPanel>
                                    {isLoadingPublic && <Overlay />}
                                    <Text fontSize="xl" fontWeight="bold" mb={4}>[공공 데이터] 공공 데이터 및 K-Startup 분석 결과</Text>
                                    <Text fontWeight="bold" mb={2}>정책명: 르르르</Text>
                                    <Text fontSize="sm" color="gray.500">미디어데이터 24년07월10일 갱신</Text>
                                    <Text mt={2}>정책 내용 어쩌구 머쩌구 설명...</Text>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>

                    <Box width="50%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>[긍부정 비율]</Text>
                        <Box height="300px">
                            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </Box>
                    </Box>
                </Flex>

                <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Tabs>
                        <TabList mb={4}>
                            <Tab>긍정</Tab>
                            <Tab>부정</Tab>
                            <Tab>etc</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel p={0}>
                                <PolicyTable data={policyData.filter(item => item.result === '긍정')} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <PolicyTable data={policyData.filter(item => item.result === '부정')} />
                            </TabPanel>
                            <TabPanel p={0}>
                                <PolicyTable data={policyData.filter(item => item.result !== '긍정' && item.result !== '부정')} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>

                <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[분석 결과 요약]</Text>
                    <Text>
                        여기에 분석 결과 요약 내용이 들어갑니다. 예를 들어, 전체적인 정책 동향,
                        주요 긍정/부정 요인, 향후 전망 등을 포함할 수 있습니다.
                    </Text>
                </Box>
            </VStack>
        </PageLayout>
    );
};

export default BusinessSupportPage;