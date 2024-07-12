import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, Center, Flex, Text, VStack } from '@chakra-ui/react';
import PageLayout from '../component/common/PageLayout';
import DateRangePicker from '../component/common/DateRangePicker';
import CompanyResultItem from '../component/common/CompanyResult';
import logo from "../logo/helper.png";
import InfiniteScroll from '../component/InfiniteScroll';
import CompanyDetailCard from "../component/CompanyDetailCard";

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
    const [isSearched, setIsSearched] = useState(false);
    const [displayedCompanies, setDisplayedCompanies] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const companies = [
        { name: "디에이건축엔지니어링", representative: "어재규", foundingDate: "1990년 1월 1일" },
        { name: "샘플 기업 2", representative: "홍길동", foundingDate: "2020년 1월 1일" },
        { name: "샘플 기업 3", representative: "김철수", foundingDate: "2015년 5월 15일" },
        { name: "샘플 기업 4", representative: "이영희", foundingDate: "2018년 8월 8일" },
        { name: "샘플 기업 5", representative: "박민수", foundingDate: "2005년 3월 20일" },
        { name: "샘플 기업 6", representative: "정승훈", foundingDate: "2012년 7월 7일" },
        { name: "샘플 기업 7", representative: "강지원", foundingDate: "2019년 11월 30일" },
        { name: "샘플 기업 8", representative: "임서연", foundingDate: "2008년 9월 15일" },
        { name: "샘플 기업 9", representative: "오민지", foundingDate: "2017년 4월 1일" },
        { name: "샘플 기업 10", representative: "서준호", foundingDate: "2014년 6월 22일" },
        { name: "샘플 기업 11", representative: "유미란", foundingDate: "2010년 2월 14일" },
        { name: "샘플 기업 12", representative: "최동훈", foundingDate: "2016년 10월 5일" },
        { name: "샘플 기업 13", representative: "한소희", foundingDate: "2013년 12월 25일" },
        { name: "샘플 기업 14", representative: "배성우", foundingDate: "2011년 8월 18일" },
        { name: "샘플 기업 15", representative: "노지은", foundingDate: "2007년 5월 3일" },
    ];

    const companyDetails = {
        장점: "이 기업의 주요 장점은 혁신적인 기술력과 우수한 인재풀입니다. 지속적인 R&D 투자로 업계를 선도하고 있으며, 고객 중심의 서비스 제공으로 높은 고객 만족도를 유지하고 있습니다.",
        약점: "주요 약점으로는 글로벌 시장에서의 인지도 부족과 일부 제품군에서의 경쟁력 저하가 있습니다. 또한, 내부 의사소통 구조의 개선이 필요하며, 신규 시장 진출 속도가 경쟁사 대비 다소 늦은 편입니다.",
        개선점: "향후 개선이 필요한 부분으로는 마케팅 전략의 다각화, 고객 서비스 품질 향상, 그리고 신규 시장 진출을 위한 전략 수립 등이 있습니다. 또한, 직원 교육 프로그램 강화와 조직 문화 개선을 통해 내부 역량을 강화할 필요가 있습니다."
    };

    const loadMoreCompanies = useCallback(() => {
        const currentLength = displayedCompanies.length;
        const more = companies.slice(currentLength, currentLength + 5);
        setDisplayedCompanies(prev => [...prev, ...more]);
        if (currentLength + more.length >= companies.length) {
            setHasMore(false);
        }
    }, [displayedCompanies, companies]);

    useEffect(() => {
        if (isSearched && displayedCompanies.length === 0) {
            loadMoreCompanies();
        }
    }, [isSearched, displayedCompanies.length, loadMoreCompanies]);

    return (


        <PageLayout>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(e) => setStartDate(e.target.value)}
                onEndDateChange={(e) => setEndDate(e.target.value)}
            />

            <Button
                onClick={() => {
                    setIsSearched(!isSearched);
                    setDisplayedCompanies([]);
                    setHasMore(true);
                }}
                mb={4}
            >
                {isSearched ? "검색 전 상태로 변경" : "검색 후 상태로 변경"}
            </Button>

            <Flex gap={6}>
                <Box
                    width="40%"
                    bg="white"
                    borderRadius="lg"
                    p={6}
                    boxShadow="md"
                    maxHeight="500px"
                    overflowY="auto"
                >
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
                        <InfiniteScroll loadMore={loadMoreCompanies} hasMore={hasMore}>
                            <VStack spacing="4" align="stretch">
                                {displayedCompanies.map((company, index) => (
                                    <CompanyResultItem key={index} company={company} />
                                ))}
                            </VStack>
                        </InfiniteScroll>
                    )}
                </Box>

                <VStack width="60%" spacing="6" align="stretch">
                    {['장점', '약점', '개선점'].map((item, index) => (
                        <CompanyDetailCard
                            key={index}
                            title={item}
                            content={companyDetails[item]}
                            isSearched={isSearched}
                            companyName="디에이건축엔지니어링"
                        />
                    ))}
                </VStack>
            </Flex>
        </PageLayout>
    );
};

export default SimilarServicePage;