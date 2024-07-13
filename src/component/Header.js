import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Image, Select, Text, Input, Button } from '@chakra-ui/react';
import { LockIcon, EditIcon } from '@chakra-ui/icons';
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

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());

    useEffect(() => {
        // 컴포넌트가 마운트되거나 업데이트될 때마다 endDate를 현재 날짜로 설정
        setEndDate(getCurrentDate());
    }, []);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleSearch = () => {
        if (selectedOption && searchTerm) {
            const businessInfo = {
                business: searchTerm,
                companyName: '',
                nationality: '',
                companySize: '',
                establishmentYear: '',
                products: '',
                marketPosition: ''
            };

            navigate(`/${selectedOption}`, {
                state: { businessInfo, startDate, endDate },
                search: `?query=${encodeURIComponent(searchTerm)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
            });
        } else {
            console.log("Please select an option and enter a search term");
        }
    };

    return (
        <Flex bg="blue.800" color="white" p="4" alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
                <Flex
                    onClick={handleLogoClick}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    alignItems="center"
                    mr="6"
                >
                    <Image src={logo} alt="JIWOO Logo" boxSize="30px" mr="2" />
                    <Text fontSize="xl" fontWeight="bold">JIWOO</Text>
                </Flex>

                <Flex alignItems="center">
                    <Flex alignItems="center" mr="4">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            bg="white"
                            color="black"
                            width="150px"
                        />
                        <Text mx="2" fontWeight="bold">~</Text>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            bg="white"
                            color="black"
                            width="150px"
                        />
                    </Flex>
                    <Select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        bg="white"
                        color="black"
                        width="120px"
                        mr="2"
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <Input
                        placeholder="검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        color="black"
                        width="300px"
                        mr="2"
                    />
                    <Button colorScheme="blue" onClick={handleSearch}>
                        검색
                    </Button>
                </Flex>
            </Flex>

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
