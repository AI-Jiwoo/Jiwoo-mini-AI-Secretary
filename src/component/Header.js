// Header.jsx

import React, { useState } from 'react';
import { Box, Button, Flex, Image, Input, InputGroup, InputRightElement, Select, Text } from '@chakra-ui/react';
import { Search2Icon, LockIcon,EditIcon } from '@chakra-ui/icons';
import SearchBar from './SearchBar'; // SearchBar 컴포넌트 불러오기
import logo from '../logo/JiwooLogo.png'; // 로고 이미지 불러오기

const Header = () => {
  const options = ["유사서비스", "정책", "시장조사"];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Flex as="header" bg="blue.800" color="white" p="4" justifyContent="space-between" alignItems="center">
      {/* 로고와 텍스트 영역 */}
      <Flex align="center" ml="4"> {/* 로고와 텍스트를 왼쪽으로 띄우기 위해 ml 속성 추가 */}
        <Image src={logo} alt="JIWOO Logo" boxSize="40px" mr="2" />
        <Text fontSize="xl" fontWeight="bold">JIWOO</Text>
      </Flex>
      
      {/* 검색 바와 드롭다운 영역 */}
      <Flex align="center" ml="10"> {/* 검색 바와 드롭다운을 왼쪽으로 이동시키기 위해 ml 속성 추가 */}
        {/* 드롭다운 */}
        <Box h="100%">
          <Select value={selectedOption} onChange={handleSelectChange} bg="white" color="black"  width="200px">
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </Select>
        </Box>

        {/* 검색 바 */}
        <InputGroup ml="4">
          <Input placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} bg="white" color="black" />
          <InputRightElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* 버튼 그룹 */}
      <Flex className="headerbutton" align="center">
        <Button colorScheme="teal" mr="4">플랜추가</Button>
        <Flex mr="4" align="center" cursor="pointer" _hover={{ color: 'teal.500' }}>
          <LockIcon mr="1" />
          <Text>로그인</Text>
        </Flex>
        <Flex align="center" cursor="pointer" _hover={{ color: 'teal.500' }}>
          <EditIcon mr="1" />
          <Text>회원가입</Text>
        </Flex>
      </Flex>
    </Flex>
    
  );
};

export default Header;
