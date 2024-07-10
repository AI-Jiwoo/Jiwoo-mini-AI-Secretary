import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import { Button } from '@chakra-ui/react';
import logo from '../logo/jiwooLanding.png';
import '../LandingPage.css'; // CSS 파일 import

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStartedClick = () => {
        navigate('/SimilarService');
    };

    return (
        <div className="landing-container">
            <img src={logo} className="landing-logo" alt="JIWOO logo" />
            <ReactTypingEffect
                text={['지혜로운 도우미 JIWOO를 경험해보세요!']}
                speed={100}
                eraseDelay={Infinity}
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