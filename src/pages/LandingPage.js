import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import {Button, Flex, Text} from '@chakra-ui/react';
import logo from '../logo/jiwooLanding.png';
import '../LandingPage.css';
import {EditIcon, LockIcon} from "@chakra-ui/icons"; // CSS 파일 import

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        navigate('/SimilarService');
    };

    return (
        <div className="landing-container">
            <Flex className="landing-user">
                <Flex mr="4" align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                    <LockIcon mr="1" />
                    <Text>로그인</Text>
                </Flex>
                <Flex align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                    <EditIcon mr="1" />
                    <Text>회원가입</Text>
                </Flex>
            </Flex>
            <img src={logo} className="landing-logo" alt="JIWOO logo" />
            <ReactTypingEffect
                text={['지혜로운 도우미 JIWOO를 경험해보세요!']}
                speed={100}
                className="landing-typing-effect"
            />
            <Button
                colorScheme="teal"
                size="xs"
                mt={4}
                padding="0.5vh 1vw"
                fontSize="1.5vw"
                width="200px"
                height="50px"
                onClick={handleGetStartedClick}
            >
                Get Started
            </Button>
        </div>
    );
};

export default LandingPage;