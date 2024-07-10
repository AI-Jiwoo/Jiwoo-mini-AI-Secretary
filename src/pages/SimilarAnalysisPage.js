import React, { useState } from 'react';
import {Box, Button, Center, Flex, Text, VStack} from '@chakra-ui/react';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker';
import CompanyResultItem from '../component/common/CompanyResult';
import logo from "../logo/helper.png";

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const SimilarServicePage = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [isSearched, setIsSearched] = useState(false); // 검색 상태를 관리하는 state

    const companies = [
        { name: "디에이건축엔지니어링", representative: "어재규", foundingDate: "204년 1990원 999일" },
        { name: "샘플 기업 2", representative: "홍길동", foundingDate: "2020년 1월 1일" },
        { name: "샘플 기업 3", representative: "김철수", foundingDate: "2015년 5월 15일" },
        { name: "샘플 기업 4", representative: "이영희", foundingDate: "2018년 8월 8일" },
    ];

    return (
        <PageLayout>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(e) => setStartDate(e.target.value)}
                onEndDateChange={(e) => setEndDate(e.target.value)}
            />

            {/* 검색 상태 토글 버튼 */}
            <Button onClick={() => setIsSearched(!isSearched)} mb={4}>
                {isSearched ? "검색 전 상태로 변경" : "검색 후 상태로 변경"}
            </Button>

            <Flex gap={6}>
                <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                    <Text fontSize="xl" fontWeight="bold" mb="4">기업 검색 결과</Text>
                    {!isSearched ? (
                        <Center flexDirection="column">
                            <img src={logo} className="landing-logo2" alt="JIWOO logo"/>
                            <Text textAlign="center" color="gray.500">
                                안녕하세요? 지우입니다
                                <br/>
                                아직 단어가 검색되지 않았어요!
                                <br/>
                                상담 검색창에서 검색을 해보세요!
                            </Text>
                        </Center>
                    ) : (
                        <VStack spacing="4" align="stretch">
                            {companies.map((company, index) => (
                                <CompanyResultItem key={index} company={company} />
                            ))}
                        </VStack>
                    )}
                </Box>

                <VStack width="60%" spacing="6" align="stretch">
                    {['장점', '약점', '개선점'].map((item, index) => (
                        <Box key={index} p={6} bg="white" borderRadius="lg" boxShadow="md">
                            <Text fontSize="xl" fontWeight="bold" mb="2">
                                {isSearched ? companies[0].name : "[기업이름]"}의 {item}
                            </Text>
                            <Text color="gray.500">
                                {isSearched ? `${companies[0].name}의 ${item}에 대한 내용입니다.` : "기업이 선택되지 않았어요"}
                            </Text>
                        </Box>
                    ))}
                </VStack>
            </Flex>
        </PageLayout>
    );
};

export default SimilarServicePage;