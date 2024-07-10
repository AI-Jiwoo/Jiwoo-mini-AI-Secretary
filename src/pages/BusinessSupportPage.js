import React, { useState } from 'react';
import { Box, Container, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, Tabs, TabList, TabPanels, Tab, TabPanel, VStack, HStack, Badge, Input } from '@chakra-ui/react';

// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 반환하는 함수
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const NewsContent = ({ title, content }) => (
    <Box
        bg="gray.50"
        p={4}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{ bg: "blue.50", boxShadow: "md" }}
    >
        <Text fontWeight="bold" mb={2}>{title}</Text>
        <Text>{content}</Text>
    </Box>
);

const ResultTable = ({ data }) => (
    <Table variant="simple">
        <Thead>
            <Tr>
                <Th>정책명</Th>
                <Th>결과</Th>
                <Th isNumeric>건수</Th>
            </Tr>
        </Thead>
        <Tbody>
            {data.map((item, index) => (
                <Tr key={index}>
                    <Td>{item.policy}</Td>
                    <Td>
                        <Badge colorScheme={item.result === '긍정' ? 'green' : item.result === '부정' ? 'red' : 'gray'}>
                            {item.result}
                        </Badge>
                    </Td>
                    <Td isNumeric>{item.count}건</Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
);

const BusinessSupportPage = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

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

    return (
        <Box bg="gray.100" minHeight="100vh">
            <Container maxW="container.xl" py={6}>
                <HStack spacing="4" mb="6">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        max={endDate}
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate}
                    />
                </HStack>

                <Flex gap={6}>
                    {/* 왼쪽: 미디어 데이터 */}
                    <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                        <Text fontSize="xl" fontWeight="bold" mb={4}>[미디어 데이터] 뉴스 및 미디어 데이터 분석 결과</Text>
                        <VStack align="stretch" spacing={4}>
                            <HStack>
                                <Badge colorScheme="blue" p={2} borderRadius="full">뉴스 분고</Badge>
                                <Text fontWeight="bold">이디야스</Text>
                                <Text fontSize="sm" color="gray.500">24년7월9일 발행, 15분 전</Text>
                            </HStack>
                            <NewsContent
                                title="뉴스 제목"
                                content="뉴스 내용 어쩌구 저쩌구..."
                            />
                        </VStack>
                    </Box>

                    {/* 오른쪽: 분석 결과 */}
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

                {/* 분석 결과 요약 */}
                <Box bg="white" borderRadius="lg" p={6} mt={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb={4}>[분석 결과 요약]</Text>
                    <VStack align="stretch" spacing={4}>
                        <Box>
                            <Text fontWeight="bold" mb={2}>전체 분석 결과</Text>
                            <Text>총 1,356건의 뉴스 기사를 분석한 결과, 긍정적인 평가가 56%, 부정적인 평가가 32%, 중립적인 평가가 12%로 나타났습니다.</Text>
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
            </Container>
        </Box>
    );
};

export default BusinessSupportPage;