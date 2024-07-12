import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Flex, Image, Select, Text, InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react';
import { Search2Icon, LockIcon, EditIcon } from '@chakra-ui/icons';
import logo from '../logo/JiwooLogo.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const options = [
        { value: "", label: "선택" },
        { value: "SimilarService", label: "유사서비스" },
        { value: "BusinessSupport", label: "정책" },
        { value: "MarketResearch", label: "시장조사" }
    ];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0].value);


    // 로고 클릭 시 홈 페이지로 이동하는 함수
    const handleLogoClick = () => {
        navigate('/');
    };

    // 검색 버튼 클릭 시 검색 결과 페이지로 이동하는 함수
    const handleSearch = () => {
        if (selectedOption && searchTerm) {
            const businessInfo = {
                business: searchTerm,
                // 다른 필드들은 기본값 또는 빈 값으로 설정
                companyName: '',
                nationality: '',
                companySize: '',
                establishmentYear: '',
                products: '',
                marketPosition: ''
            };
            navigate(`/${selectedOption}`, {
                state: { businessInfo },
                search: `?query=${encodeURIComponent(searchTerm)}`
            });
        }
    };

    // 엔터 키를 눌렀을 때 검색 결과 페이지로 이동하는 함수
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Flex
            as="header"
            bg="blue.800"
            color="white"
            p="2"
            alignItems="center"
            justifyContent="space-between"
        >
            {/* 로고와 검색창 - 왼쪽에 배치 */}
            <Flex align="center">
                <Flex
                    onClick={handleLogoClick}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    alignItems="center"
                    mr="30px"
                >
                    <Image src={logo} alt="JIWOO Logo" boxSize="30px" mr="2" />
                    <Text fontSize="xl" fontWeight="bold">JIWOO</Text>
                </Flex>

                <Flex
                    bg="white"
                    borderRadius="md"
                    overflow="hidden"
                    maxWidth="450px"
                    width="100%"
                    onClick={(e) => e.stopPropagation()}
                >
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
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <InputGroup size="md" flex={1}>
                        <Input
                            placeholder="검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            color="black"
                            border="none"
                            _focus={{ boxShadow: 'none' }}
                        />
                        <InputRightElement>
                            <Search2Icon
                                color="gray.500"
                                cursor="pointer"
                                onClick={handleSearch}
                                _hover={{ color: "blue.500" }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            </Flex>

            {/* 버튼 그룹 - 오른쪽에 배치 */}
            <Flex align="center">
                <Button colorScheme="teal" size="sm" mr="4">
                    플랜추가
                </Button>
                <Flex
                    mr="4"
                    align="center"
                    cursor="pointer"
                    _hover={{ color: 'teal.200' }}
                >
                    <LockIcon mr="1" />
                    <Text>로그인</Text>
                </Flex>
                <Flex
                    align="center"
                    cursor="pointer"
                    _hover={{ color: 'teal.200' }}
                >
                    <EditIcon mr="1" />
                    <Text>회원가입</Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;
