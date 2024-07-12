import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';

const ResultTable = ({ data }) => (
    <Table variant="simple">
        <Thead>
            <Tr>
                <Th>기사명</Th>
                <Th>결과</Th>
            </Tr>
        </Thead>
        <Tbody>
            {data.map((item, index) => (
                <Tr key={index}>
                    <Td>{item.title}</Td>
                    <Td>
                        <Badge colorScheme={item.reaction.includes('긍정적') ? 'green' : item.reaction.includes('부정적') ? 'red' : 'gray'}>
                            {item.reaction.includes('긍정적') ? '긍정' : item.reaction.includes('부정적') ? '부정' : '기타'}
                        </Badge>
                    </Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
);

export default ResultTable;
