import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import { Button, ChakraProvider } from '@chakra-ui/react';
import logo from '../logo/jiwooLanding.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        navigate('/SimilarService');
    };

    return (
        <ChakraProvider>
            <div style={styles.container}>
                <img src={logo} style={styles.logo} alt="JIWOO logo" />
                <ReactTypingEffect
                    text={['지혜로운 도우미 JIWOO를 경험해보세요!']}
                    speed={100}
                    eraseDelay={Infinity}
                    style={styles.typingEffect}
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
        </ChakraProvider>
    );
};

const styles = {
    container: {
        backgroundColor: '#162238',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center'
    },
    logo: {
        width: "50vw", /* 화면 너비의 50% */
        height: "auto",
    },
    typingEffect: {
        fontSize: '3vw',
        marginTop: '2vh'
    }
};

export default LandingPage;
