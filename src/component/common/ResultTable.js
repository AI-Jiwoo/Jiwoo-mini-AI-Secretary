import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';

const ResultTable = ({ data }) => (
    <Table variant="simple">
        <Thead>
            <Tr>
                <Th>정책명</Th>
                <Th>결과</Th>
                <Th isNumeric>건수</Th>
            </Tr>
        </Thead>
        <Tbody>
            {data.map((item, index) => (
                <Tr key={index}>
                    <Td>{item.policy}</Td>
                    <Td>
                        <Badge colorScheme={item.result === '긍정' ? 'green' : item.result === '부정' ? 'red' : 'gray'}>
                            {item.result}
                        </Badge>
                    </Td>
                    <Td isNumeric>{item.count}건</Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
);

export default ResultTable;