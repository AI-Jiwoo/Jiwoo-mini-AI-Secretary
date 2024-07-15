import React from 'react';
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    VStack, Button
} from '@chakra-ui/react';

const Sidebar = ({ isOpen, onClose, options, onPageChange, searchTerm, businessInfo }) => {
    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>메뉴</DrawerHeader>
                <DrawerBody>
                    <VStack align="stretch" spacing={4}>
                        {options.map((option) => (
                            <Button
                                key={option.value}
                                onClick={() => {
                                    console.log(`Sidebar button clicked: ${option.value}, searchTerm: ${searchTerm}, businessInfo: ${JSON.stringify(businessInfo)}`);
                                    onPageChange(option.value, businessInfo?.business || searchTerm);
                                }}
                                variant="ghost"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default Sidebar;