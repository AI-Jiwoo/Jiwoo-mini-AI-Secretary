// components/common/DateRangePicker.js
import React from 'react';
import { HStack, Input } from '@chakra-ui/react';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
    <HStack spacing="4" mb="6">
        <Input
            type="date"
            value={startDate}
            onChange={onStartDateChange}
            max={endDate}
            bg="white"
        />
        <Input
            type="date"
            value={endDate}
            onChange={onEndDateChange}
            min={startDate}
            bg="white"
        />
    </HStack>
);

export default DateRangePicker;

