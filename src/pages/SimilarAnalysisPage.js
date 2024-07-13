import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {Box, Flex, Text, VStack, Spinner, Button} from '@chakra-ui/react';
import PageLayout from '../component/common/PageLayout';
import CompanyDetailCard from "../component/CompanyDetailCard";
import Overlay from "../component/common/Overlay";


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
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        const businessInfo = location.state?.businessInfo;

        if (query || (businessInfo && businessInfo.business)) {
            performSearch(query || businessInfo.business);
        }
    }, [location]);

    const performSearch = async (keyword) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/news_crawling/analyze', { keyword });
            setSearchResults(response.data);
            if (response.data.length > 0) {
                setSelectedCompany(response.data[0]);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('검색 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
    };

    return (
        <PageLayout>
            {isLoading && <Overlay />}
            {error && <Text color="red.500">{error}</Text>}

            <Flex gap={6}>
                <Box width="40%" bg="white" borderRadius="lg" p={6} boxShadow="md" maxHeight="500px" overflowY="auto">
                    <Text fontSize="xl" fontWeight="bold" mb="4">기업 검색 결과</Text>
                    {searchResults.length > 0 ? (
                        <VStack spacing="4" align="stretch">
                            {searchResults.map((company, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleCompanyClick(company)}
                                    variant="outline"
                                    justifyContent="flex-start"
                                    isActive={selectedCompany && selectedCompany.company === company.company}
                                >
                                    {company.company}
                                </Button>
                            ))}
                        </VStack>
                    ) : (
                        <Text>검색 결과가 없습니다.</Text>
                    )}
                </Box>

                <VStack width="60%" spacing="6" align="stretch">
                    {selectedCompany && (
                        <>
                            <CompanyDetailCard
                                title="장점"
                                content={selectedCompany.advantages || selectedCompany.suggestions}
                                isSearched={true}
                                companyName={selectedCompany.company}
                            />
                            <CompanyDetailCard
                                title="약점"
                                content={selectedCompany.disadvantages || "정보가 없습니다."}
                                isSearched={true}
                                companyName={selectedCompany.company}
                            />
                            <CompanyDetailCard
                                title="개선점"
                                content={selectedCompany.suggestions || "정보가 없습니다."}
                                isSearched={true}
                                companyName={selectedCompany.company}
                            />
                        </>
                    )}
                </VStack>
            </Flex>
        </PageLayout>
    );
};

export default SimilarServicePage;