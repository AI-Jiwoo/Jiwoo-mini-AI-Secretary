import React from 'react';
import { Box, Text } from '@chakra-ui/react';

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

export default NewsContent;