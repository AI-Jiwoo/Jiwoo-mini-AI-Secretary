import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const CompanyResult = ({ company }) => (
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

export default CompanyResult;