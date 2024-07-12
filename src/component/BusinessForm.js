import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';
import Overlay from '../component/common/Overlay';

import {
    Box,
    Checkbox,
    Flex,
    Input,
    Select,
    Button,
    VStack,
    Container,
    Text,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Spinner
} from '@chakra-ui/react';

const steps = [
    { title: 'First', description: 'Contact Info' },
    { title: 'Second', description: 'Detail Info' },
];

const BusinessInfoForm = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        nationality: '',
        business: '',
        establishmentYear: null,
        companySize: '',
        address: '',
        products: ''
    });

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

    const handlePrivacyPolicyChange = (e) => {
        setIsPrivacyPolicyChecked(e.target.checked);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        setIsLoading(true);
        setTimeout(() => {
            const formattedData = {
                ...formData,
                establishmentYear: formData.establishmentYear
                    ? formData.establishmentYear.toISOString().split('T')[0]
                    : null,
                business: formData.business // 명시적으로 business 필드를 포함
            };
            navigate('/MarketResearch', { state: formattedData });
        }, 2000);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">회사명(Company name)</Text>
                            <Input
                                placeholder="회사명을 입력하세요"
                                bg="white"
                                color="black"
                                value={formData.companyName}
                                onChange={(e) => handleFormChange('companyName', e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">국적(Nationality)</Text>
                            <Select
                                placeholder="국적을 선택하세요"
                                bg="white"
                                color="black"
                                value={formData.nationality}
                                onChange={(e) => handleFormChange('nationality', e.target.value)}
                            >
                                <option>대한민국</option>
                                <option>미국</option>
                                <option>일본</option>
                                <option>중국</option>
                            </Select>
                        </Box>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">업종(Business) *</Text>
                            <Input
                                placeholder="업종을 입력하세요 (예: IT, 의료, 교육)"
                                bg="white"
                                color="black"
                                value={formData.business}
                                onChange={(e) => handleFormChange('business', e.target.value)}
                                isRequired={true}
                            />
                        </Box>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">설립연도(Year of establishment)</Text>
                            <DatePicker
                                selected={formData.establishmentYear}
                                onChange={(date) => handleFormChange('establishmentYear', date)}
                                dateFormat="yyyy/MM/dd"
                                color="black"
                                locale={ko}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={50}
                                placeholderText="설립일자를 선택하세요"
                                customInput={<Input />}
                            />
                        </Box>
                    </>
                );
            case 1:
                return (
                    <>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">기업 규모(Company Size)</Text>
                            <Input
                                placeholder="기업 규모를 입력하세요"
                                bg="white"
                                color="black"
                                value={formData.companySize}
                                onChange={(e) => handleFormChange('companySize', e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">주소(Address)</Text>
                            <Input
                                placeholder="주소를 입력하세요"
                                bg="white"
                                color="black"
                                value={formData.address}
                                onChange={(e) => handleFormChange('address', e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text mb={2} color="black" textAlign="left" fontWeight="bold">주요 제품/서비스(Main Products/Services)</Text>
                            <Input
                                placeholder="주요 제품/서비스를 입력하세요"
                                bg="white"
                                color="black"
                                value={formData.products}
                                onChange={(e) => handleFormChange('products', e.target.value)}
                            />
                        </Box>
                        {activeStep === steps.length - 1 && (
                            <Box>
                                <Checkbox
                                    isChecked={isPrivacyPolicyChecked}
                                    onChange={handlePrivacyPolicyChange}
                                    colorScheme="blue"
                                    color="black"
                                >
                                    개인정보 수집에 동의합니다.
                                </Checkbox>
                            </Box>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Flex bg="aliceblue" minHeight="100vh" alignItems="center" justifyContent="center">
            <Container maxW="container.md" py={10}>
                <VStack spacing={6} align="stretch">
                    <Text fontSize={["3xl", "4xl", "5xl", "6xl"]} fontWeight="bold" mb={10} color="gray.800" textAlign="center">
                        사업정보를 입력하세요!
                        <Text fontSize={["lg", "xl", "2xl", "3xl"]} color="gray.600" textAlign="center" maxWidth="800px" mb={10}>
                            지우가 맞춤 도움을 드리겠습니다
                        </Text>
                    </Text>
                    <Box width="100%" bg="white" borderRadius="2xl" boxShadow="md" p={6}>
                        <Stepper index={activeStep === steps.length - 1 && isLoading ? steps.length - 1 : activeStep} colorScheme="blue" mb={6}>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box flexShrink='0'>
                                        <StepTitle color="black">{step.title}</StepTitle>
                                        <StepDescription color="black">{step.description}</StepDescription>
                                    </Box>

                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>

                        <VStack spacing={4} align="stretch">
                            {renderStepContent(activeStep)}

                            <Flex justifyContent="flex-end">
                                {activeStep > 0 && (
                                    <Button colorScheme="blue" size="sm" mr={2} onClick={prevStep}>이전</Button>
                                )}
                                <Button
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={activeStep === steps.length - 1 ? handleComplete : nextStep}
                                    isDisabled={activeStep === steps.length - 1 && !isPrivacyPolicyChecked}
                                >
                                    {activeStep === steps.length - 1 ? '완료' : '다음'}
                                </Button>
                            </Flex>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
            {isLoading && <Overlay />}

        </Flex>
    );
};

export default BusinessInfoForm;