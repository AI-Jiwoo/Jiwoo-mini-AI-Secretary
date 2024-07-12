import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Image, Select, Text, InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react';
import { Search2Icon, LockIcon, EditIcon } from '@chakra-ui/icons';
import logo from '../logo/JiwooLogo.png';

const Header = () => {
    const navigate = useNavigate();
    const options = [
        { value: "", label: "선택" },
        { value: "SimilarService", label: "유사서비스" },
        { value: "BusinessSupport", label: "정책" },
        { value: "MarketResearch", label: "시장조사" }
    ];

    // 선택된 옵션과 검색어 상태
    const [selectedOption, setSelectedOption] = React.useState(options[0].value);
    const [searchTerm, setSearchTerm] = React.useState('');

    // 로고 클릭 시 홈 페이지로 이동하는 함수
    const handleLogoClick = () => {
        navigate('/');
    };

    // 검색 버튼 클릭 시 검색 결과 페이지로 이동하는 함수
    const handleSearch = () => {
        if (selectedOption && searchTerm) {
            navigate(`/${selectedOption}?query=${encodeURIComponent(searchTerm)}`);
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
