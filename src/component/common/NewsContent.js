import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

const NewsContent = ({ title, content, reaction, url }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text fontWeight="bold">{title}</Text>
            <Text mt={2}>{content}</Text>
            <Text mt={2} fontStyle="italic">{reaction}</Text>
            <Link href={url} isExternal color="blue.500" mt={2}>
                원문 보기
            </Link>
        </Box>
    );
};

export default NewsContent;