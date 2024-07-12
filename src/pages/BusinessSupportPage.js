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
    TabPanel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Link,
    Spinner,
    Button,
    Input
} from '@chakra-ui/react';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker'; // 예시에서는 외부 DateRangePicker 사용 가정

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
    const [isLoading, setIsLoading] = useState(false);
    const [policyData, setPolicyData] = useState([]);
    const [error, setError] = useState(null);
    const [investmentData, setInvestmentData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        if (query !== searchQuery) {
            setSearchQuery(query);
            fetchPolicyData(query);
        }
    }, [location, searchQuery]);

    const fetchPolicyData = async (query) => {
        setIsLoading(true);
        setError(null);
        try {
            const policyResponse = await axios.get('http://localhost:8000/kstartup_research/business', {
                params: { query }
            });
            console.log('Received policy data:', policyResponse.data);
            setPolicyData(policyResponse.data);

            // 투자자금 데이터 요청
            const businessType = query === 'IT' ? 'IT' : '유통/서비스';
            const startYear = startDate.split('-')[0];
            const endYear = endDate.split('-')[0];
            const investmentResponse = await fetchInvestmentData(businessType, startYear, endYear);
            console.log('Received investment data:', investmentResponse);
            setInvestmentData(investmentResponse);
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
            setError('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInvestmentData = async (businessType, startYear, endYear) => {
        try {
            const response = await axios.post('http://localhost:8000/investment_possibility/get-investment-data', {
                business_type: businessType,
                start_year: parseInt(startYear),
                end_year: parseInt(endYear)
            });
            return response.data;
        } catch (error) {
            console.error('투자자금 데이터 불러오기 실패:', error);
            return null;
        }
    };
    const handleSearch = () => {
        if (searchQuery) {
            fetchPolicyData(searchQuery);
        } else {
            setError('검색어를 입력해주세요.');
        }
    };

    return (
        <PageLayout>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={(e) => setStartDate(e.target.value)}
                        onEndDateChange={(e) => setEndDate(e.target.value)}
                    />
                    <Button colorScheme="blue" onClick={handleSearch}>
                        검색
                    </Button>
                </Flex>

                {searchQuery && (
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">검색어: "{searchQuery}"</Text>
                    </Box>
                )}

                {isLoading ? (
                    <Flex justify="center" align="center" height="200px">
                        <Spinner size="xl" />
                    </Flex>
                ) : error ? (
                    <Box bg="red.100" color="red.500" p={4} borderRadius="md">
                        <Text>{error}</Text>
                    </Box>
                ) : policyData.length > 0 ? (
                    <>
                        <Tabs>
                            <TabList>
                                <Tab>정책 데이터 분석 결과</Tab>
                                <Tab>투자자금 결과</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>순위</Th>
                                                    <Th>제목</Th>
                                                    <Th>유사도</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {policyData.map((policy, index) => (
                                                    <Tr key={index}>
                                                        <Td>{index + 1}</Td>
                                                        <Td>
                                                            <Link href={policy.url} isExternal color="blue.500">
                                                                {policy.title}
                                                            </Link>
                                                        </Td>
                                                        <Td>{policy.similarity.toFixed(2)}%</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </TabPanel>
                                <TabPanel>
                                    {investmentData ? (
                                        <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                                            <Text fontSize="xl" fontWeight="bold" mb={4}>투자자금 결과</Text>
                                            <Text>{investmentData.evaluation}</Text>
                                        </Box>
                                    ) : (
                                        <Box bg="gray.100" p={4} borderRadius="md">
                                            <Text>투자자금 데이터를 불러오는 중입니다...</Text>
                                        </Box>
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                            <Text fontSize="xl" fontWeight="bold" mb={4}>정책 상세 정보</Text>
                            <Tabs>
                                <TabList>
                                    {policyData.map((policy, index) => (
                                        <Tab key={index}>{index + 1}위</Tab>
                                    ))}
                                </TabList>
                                <TabPanels>
                                    {policyData.map((policy, index) => (
                                        <TabPanel key={index}>
                                            <Text fontWeight="bold">{policy.title}</Text>
                                            <Text mt={2}>{policy.content}</Text>
                                            <Text mt={2} fontWeight="bold">예상 이익:</Text>
                                            <Text>{policy.gpt_response}</Text>
                                        </TabPanel>
                                    ))}
                                </TabPanels>
                            </Tabs>
                        </Box>


                    </>
                ) : (
                    <Box bg="gray.100" p={4} borderRadius="md">
                        <Text>검색 결과가 없습니다.</Text>
                    </Box>
                )}
            </VStack>
        </PageLayout>
    );
};

export default BusinessSupportPage;
