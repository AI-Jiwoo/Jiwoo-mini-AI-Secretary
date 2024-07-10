import React, { useState } from 'react';
import { Box, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker';
import PolicyTable from '../component/common/PolicyTable';

ChartJS.register(ArcElement, Tooltip, Legend);

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MarketResearchPage = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());

    const policyData = [
        { policy: "동물 어쩌구 법", result: "긍정", count: 506 },
        { policy: "식품 법", result: "긍정", count: 500 },
        { policy: "아동 법", result: "긍정", count: 230 },
        { policy: "그 밖의 안전4법", result: "긍정", count: 120 },
    ];

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
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(e) => setStartDate(e.target.value)}
                onEndDateChange={(e) => setEndDate(e.target.value)}
            />

            <Flex gap={6}>
                {/* 왼쪽: 정책 데이터 */}
                <Box width="50%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[정책 데이터] 공공 데이터 및 K-Startup 분석 결과</Text>
                    <Text fontWeight="bold" mb={2}>정책명 어쩌구</Text>
                    <Text fontSize="sm" color="gray.500">미디어데이터 24년07월10일 갱신</Text>
                    <Text mt={2}>정책 내용 어쩌구 머쩌구 설명...</Text>
                </Box>

                {/* 오른쪽: 긍부정 비율 */}
                <Box width="50%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[긍부정 비율]</Text>
                    <Box height="300px">
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                </Box>
            </Flex>

            {/* 정책 테이블 */}
            <Box bg="white" borderRadius="lg" p={6} mt={6} boxShadow="md">
                <Tabs>
                    <TabList mb={4}>
                        <Tab>긍정</Tab>
                        <Tab>부정</Tab>
                        <Tab>etc</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0}>
                            <PolicyTable data={policyData} />
                        </TabPanel>
                        <TabPanel p={0}>
                            {/* Add negative policy data here */}
                        </TabPanel>
                        <TabPanel p={0}>
                            {/* Add other policy data here */}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            {/* 분석 결과 요약 */}
            <Box bg="white" borderRadius="lg" p={6} mt={6} boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" mb={4}>[분석 결과 요약]</Text>
                {/* Add summary content here */}
            </Box>
        </PageLayout>
    );
};

export default MarketResearchPage;