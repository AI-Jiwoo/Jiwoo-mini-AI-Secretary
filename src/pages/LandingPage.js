import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import { Button, ChakraProvider, Flex, Box, Text, Image } from '@chakra-ui/react';
import logo from '../logo/jiwooLanding.png';
import logo2 from '../logo/JiwooLogo.png'
import backgroundVideo from '../video/1118545_4k_Form_1280x720.mp4';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import '../LandingPage.css';
import {EditIcon, LockIcon} from "@chakra-ui/icons";
import BusinessInfoForm from "../component/BusinessForm";
import {motion, useAnimation} from 'framer-motion'

const FallingLogo = ({ x, y }) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            y: window.innerHeight,
            transition: {
                duration: 3 + Math.random() * 2, // 3~5초 사이의 랜덤한 시간
                ease: 'linear'
            }
        });
    }, [controls]);

    return (
        <motion.img
            src={logo2}
            alt="Falling JIWOO logo"
            style={{
                position: 'fixed',
                left: x,
                top: y,
                width: '50px',
                height: 'auto',
                zIndex: 1000
            }}
            initial={{ y: y }}
            animate={controls}
        />
    );
};
const AnimatedSection = ({ children, delay = 0, backgroundColor = 'transparent' }) => {
    const ref = useRef(null);
    const entry = useIntersectionObserver(ref, {
        threshold: 0.5,
        rootMargin: '0px'
    });
    const isVisible = !!entry?.isIntersecting;

    return (
        <Box
            ref={ref}
            className={`animated-section ${isVisible ? 'visible' : ''}`}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            backgroundColor={isVisible ? backgroundColor : 'transparent'}
            transition="opacity 0.6s ease-out, transform 0.6s ease-out, background-color 0.6s ease-out"
            width="100%"
            minHeight="100vh"
        >
            {children}
        </Box>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [fallingLogos, setFallingLogos] = useState([]);

    const handleGetStartedClick = () => {
        navigate('/SimilarService');
    };

    const handleLogoClick = () => {
        const newLogos = Array.from({ length: 10 }, () => ({
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: -100 - Math.random() * 500, // 로고들이 서로 다른 높이에서 시작하도록 합니다
        }));
        setFallingLogos(prevLogos => [...prevLogos, ...newLogos]);
    };

    useEffect(() => {
        console.log('fallingLogos updated:', fallingLogos);
    }, [fallingLogos]);

    return (
        <ChakraProvider>
            <Box position="relative" className="landing-container">
                <Flex
                    className="user"
                    position="absolute"
                    top="4"
                    right="4"
                    zIndex="2"
                >
                    <Flex mr="4" align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                        <LockIcon mr="1" />
                        <Text color="white">로그인</Text>
                    </Flex>
                    <Flex align="center" cursor="pointer" _hover={{ color: 'teal.200' }}>
                        <EditIcon mr="1" />
                        <Text color="white">회원가입</Text>
                    </Flex>
                </Flex>

                <AnimatedSection backgroundColor="rgba(22, 34, 56, 0.5)">
                    <Box position="relative" width="100%" height="100vh">
                        <Box
                            as="video"
                            autoPlay
                            loop
                            muted
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            zIndex="0"
                        >
                            <source src={backgroundVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </Box>
                        <Flex direction="column" align="center" justify="center" height="100%" position="relative" zIndex="1">
                            <Image src={logo}
                                   alt="JIWOO logo"
                                   className="landing-logo"
                                   width="90vw"
                                   maxWidth="900px"
                                    onClick={() => {
                                        console.log('Logo clicked');
                                        handleLogoClick();
                                    }}
                                    style={{cursor:'pointer'}}/>
                            <Box mt="-20px">
                            <ReactTypingEffect
                                text={['지혜로운 도우미 JIWOO를 경험해보세요!']}
                                speed={100}
                                eraseDelay={1000000}
                                className="landing-typing-effect"
                            />
                            </Box>
                            <Button
                                colorScheme="teal"
                                size="lg"
                                mt={4}
                                onClick={handleGetStartedClick}
                            >
                                로그인 바로가기
                            </Button>
                        </Flex>
                    </Box>
                </AnimatedSection>

                <AnimatedSection delay={200} backgroundColor="#FFFFFF">
                    <Flex direction="column" align="center" justify="center" minHeight="100vh" p={8}>
                        <Text fontSize={["3xl", "4xl", "5xl", "6xl"]} fontWeight="bold" mb={10} color="gray.800" textAlign="center">
                            창업을 원한다면 <br/>
                            관련 키워드를 검색해보세요!
                        </Text>
                        {/*<Text fontSize={["xl", "2xl", "3xl", "4xl"]} mb={6} color="gray.700" textAlign="center">*/}
                        {/*    관련 키워드를 검색해보세요!*/}
                        {/*</Text>*/}
                        <Text fontSize={["lg", "xl", "2xl", "3xl"]} color="gray.600" textAlign="center" maxWidth="800px" mb={10}>
                            3가지 데이터 분석을 통해 <br/>
                            원하는 분야의 창업에 대한 정보를 모으세요
                        </Text>
                        <Flex mt={10} flexWrap="wrap" justify="center">
                            <Button leftIcon={<span style={{fontSize: "1.5em"}}>🛒</span>} mr={4} mb={4} size="lg" fontSize="xl" py={6} px={8}>시장분석</Button>
                            <Button leftIcon={<span style={{fontSize: "1.5em"}}>📊</span>} mr={4} mb={4} size="lg" fontSize="xl" py={6} px={8}>정책 및 지원</Button>
                            <Button leftIcon={<span style={{fontSize: "1.5em"}}>📈</span>} mb={4} size="lg" fontSize="xl" py={6} px={8}>사업분석</Button>
                        </Flex>
                    </Flex>
                </AnimatedSection>
                <AnimatedSection delay={200} backgroundColor="#63B3ED">
                    <BusinessInfoForm />
                </AnimatedSection>
                {fallingLogos.map(logo => (
                    <FallingLogo key={logo.id} x={logo.x} y={logo.y} />
                ))}
            </Box>
        </ChakraProvider>
    );
};

export default LandingPage;