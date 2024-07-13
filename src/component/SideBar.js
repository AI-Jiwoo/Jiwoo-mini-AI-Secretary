import React from 'react';
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    VStack, Button
} from '@chakra-ui/react';

const Sidebar = ({ isOpen, onClose, options, onPageChange, searchTerm }) => {
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
                                    console.log("Button clicked:", option.value, searchTerm);
                                    onPageChange(option.value, searchTerm);
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