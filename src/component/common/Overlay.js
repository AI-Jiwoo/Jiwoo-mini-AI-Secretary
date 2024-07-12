import React from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

const Overlay = () => {
    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            justifyContent="center"
            alignItems="center"
            zIndex="9999"
        >
            <Spinner size="xl" color="blue.500" />
        </Flex>
    );
};

export default Overlay;