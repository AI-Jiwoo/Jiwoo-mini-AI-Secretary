// Header.jsx

import React, { useState } from 'react';
import { Button, Flex, Image, Input, InputGroup, InputRightElement, Select, Text } from '@chakra-ui/react';
import { Search2Icon, LockIcon, EditIcon } from '@chakra-ui/icons';
import logo from '../logo/JiwooLogo.png';

const Header = () => {
    const options = ["선택", "유사서비스", "정책", "시장조사"];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0]);

    return (
        <Flex as="header" bg="blue.800" color="white" p="2" alignItems="center" justifyContent="space-between">
            {/* 로고와 검색창 - 왼쪽에 배치 */}
            <Flex align="center">
                <Image src={logo} alt="JIWOO Logo" boxSize="30px" mr="2" />
                <Text fontSize="xl" fontWeight="bold" mr="4">JIWOO</Text>

                <Flex bg="white" borderRadius="md" overflow="hidden" maxWidth="450px" width="100%">
                    <Select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        color="black"
                        border="none"
                        borderRadius="md"
                        width="120px"
                        mr="2"
                        _focus={{ boxShadow: 'none' }}
                    >
                        {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </Select>
                    <InputGroup size="md" flex={1}>
                        <Input
                            placeholder="검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            color="black"
                            border="none"
                            _focus={{ boxShadow: 'none' }}
                        />
                        <InputRightElement>
                            <Search2Icon color="gray.500" />
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            </Flex>

            {/* 버튼 그룹 - 오른쪽에 배치 */}
            <Flex align="center">
                <Button colorScheme="teal" size="sm" mr="4">
                    플랜추가
                </Button>
                <Flex mr="4" align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                    <LockIcon mr="1" />
                    <Text>로그인</Text>
                </Flex>
                <Flex align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                    <EditIcon mr="1" />
                    <Text>회원가입</Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;