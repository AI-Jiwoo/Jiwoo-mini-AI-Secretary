import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';

const SimilarServicePage = () => {
  return (
    <Box bg="gray.200" p="4">
      <Flex justify="space-between">
        {/* 기업 검색 결과 영역 */}
        <Box flex="1" p="4" bg="white" borderRadius="md" boxShadow="md" mr="2">
          <Box mb="4" textAlign="center">
            <Image src="/path/to/logo.png" borderRadius="full" boxSize="100px" mb="4" />
            <Text fontSize="lg" fontWeight="bold">기업명 : 디에이건축엔지니어링</Text>
            <Text>대표자 : 어재규</Text>
            <Text>설립일 : 204년 1990원 999월</Text>
          </Box>
          <Box height="100px" mb="4" border="1px solid #ddd" borderRadius="md"></Box>
          <Box height="100px" mb="4" border="1px solid #ddd" borderRadius="md"></Box>
          <Box height="100px" mb="4" border="1px solid #ddd" borderRadius="md"></Box>
          <Box height="100px" mb="4" border="1px solid #ddd" borderRadius="md"></Box>
        </Box>
        
        {/* 기업 정보 영역 */}
        <Flex flex="1" direction="column" ml="2">
          <Box p="4" bg="white" borderRadius="md" boxShadow="md" mb="4">
            <Text fontSize="xl" fontWeight="bold">[기업이름]의 장점</Text>
            <Text color="gray.500">기업이 선택되지 않았어요</Text>
          </Box>
          <Box p="4" bg="white" borderRadius="md" boxShadow="md" mb="4">
            <Text fontSize="xl" fontWeight="bold">[기업이름]의 약점</Text>
            <Text color="gray.500">기업이 선택되지 않았어요</Text>
          </Box>
          <Box p="4" bg="white" borderRadius="md" boxShadow="md" mb="4">
            <Text fontSize="xl" fontWeight="bold">[기업이름]의 개선점</Text>
            <Text color="gray.500">기업이 선택되지 않았어요</Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SimilarServicePage;
