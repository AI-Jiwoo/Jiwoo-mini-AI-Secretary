// components/common/PageLayout.js
import React from 'react';
import { Box, Container } from '@chakra-ui/react';

const PageLayout = ({ children }) => (
    <Box bg="gray.100" minHeight="100vh">
        <Container maxW="container.xl" py={6}>
            {children}
        </Container>
    </Box>
);

export default PageLayout;