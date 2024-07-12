import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

const CompanyDetailCard = ({ title, content, isSearched, companyName }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md" cursor="pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <Text fontSize="xl" fontWeight="bold" mb="2">
                {isSearched ? companyName : "[기업이름]"}의 {title}
            </Text>
            {isSearched ? (
                <>
                    <Text color="gray.700">
                        {isExpanded ? content : `${content.slice(0, 50)}...`}
                    </Text>
                    <Text color="blue.500" mt={2}>
                        {isExpanded ? "접기" : "더 보기"}
                    </Text>
                </>
            ) : (
                <Text color="gray.500">기업이 선택되지 않았어요</Text>
            )}
        </Box>
    );
};

export default CompanyDetailCard;