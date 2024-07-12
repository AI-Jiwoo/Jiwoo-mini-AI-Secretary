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
    Spinner
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
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        if (query !== searchQuery) { // searchQuery와 비교하여 변경된 경우에만 호출
            setSearchQuery(query);
            fetchPolicyData(query);
        }
    }, [location, searchQuery]);


    const fetchPolicyData = async (query) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/kstartup_research/business', { // 실제 서버 URL로 수정
                params: { query }
            });
            console.log('Received data:', response.data);
            setPolicyData(response.data);
        } catch (error) {
            console.error('정책 데이터 불러오기 실패:', error);
            setError('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
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
                        <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
                            <Text fontSize="xl" fontWeight="bold" mb={4}>정책 데이터 분석 결과</Text>
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
