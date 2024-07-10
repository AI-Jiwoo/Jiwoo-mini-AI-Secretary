import React, { useState } from 'react';
import { Box, Flex, Text, Input, Container, VStack, HStack } from '@chakra-ui/react';

// 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 반환하는 함수
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const CompanyResultItem = ({ company }) => (
    <Box
        p="4"
        bg="white"
        borderRadius="md"
        transition="all 0.2s"
        _hover={{ bg: "blue.50", boxShadow: "md" }}
        cursor="pointer"
    >
        <Text fontWeight="bold">기업명: {company.name}</Text>
        <Text>대표자: {company.representative}</Text>
        <Text>설립일: {company.foundingDate}</Text>
    </Box>
);

const SimilarServicePage = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const companies = [
        { name: "디에이건축엔지니어링", representative: "어재규", foundingDate: "204년 1990원 999일" },
        { name: "샘플 기업 2", representative: "홍길동", foundingDate: "2020년 1월 1일" },
        { name: "샘플 기업 3", representative: "김철수", foundingDate: "2015년 5월 15일" },
        { name: "샘플 기업 4", representative: "이영희", foundingDate: "2018년 8월 8일" },
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
                        bg="white"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate}
                        bg="white"
                    />
                </HStack>

                <Flex gap={6}>
                    <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md">
                        <Text fontSize="xl" fontWeight="bold" mb="4">기업 검색 결과</Text>
                        <VStack spacing="4" align="stretch">
                            {companies.map((company, index) => (
                                <CompanyResultItem key={index} company={company} />
                            ))}
                        </VStack>
                    </Box>

                    <VStack width="60%" spacing="6" align="stretch">
                        {['장점', '약점', '개선점'].map((item, index) => (
                            <Box key={index} p={6} bg="white" borderRadius="lg" boxShadow="md">
                                <Text fontSize="xl" fontWeight="bold" mb="2">[기업이름]의 {item}</Text>
                                <Text color="gray.500">기업이 선택되지 않았어요</Text>
                            </Box>
                        ))}
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default SimilarServicePage;