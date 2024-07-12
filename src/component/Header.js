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
        console.log("Search triggered", selectedOption, searchTerm); // 디버깅용 로그
        if (selectedOption && searchTerm) {
            const businessInfo = {
                business: searchTerm,
                // 다른 필드들은 기본값으로 유지
                companyName: '',
                nationality: '',
                companySize: '',
                establishmentYear: '',
                products: '',
                marketPosition: ''
            };

            // SimilarService 옵션이 선택되었을 때만 해당 페이지로 이동
            if (selectedOption === "SimilarService") {
                navigate(`/${selectedOption}`, {
                    state: { businessInfo },
                    search: `?query=${encodeURIComponent(searchTerm)}`
                });
            } else {
                // 다른 옵션들에 대한 처리
                console.log(`Searching ${selectedOption} with term: ${searchTerm}`);
                navigate(`/${selectedOption}`, {
                    state: { businessInfo },
                    search: `?query=${encodeURIComponent(searchTerm)}`
                });
            }
        } else {
            console.log("Please select an option and enter a search term");
            // 사용자에게 옵션 선택과 검색어 입력을 요청하는 알림을 표시할 수 있습니다.
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
                        onChange={(e) => {
                            setSelectedOption(e.target.value);
                            console.log("Selected option:", e.target.value); // 디버깅용 로그
                        }}
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