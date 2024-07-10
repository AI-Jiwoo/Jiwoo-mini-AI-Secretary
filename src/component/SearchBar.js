// SearchBar.jsx

import React, { useState } from 'react';
import { Select, Input } from '@chakra-ui/react';

const SearchBar = () => {
  const options = ["옵션 1", "옵션 2", "옵션 3"];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Select>
      <Input
        placeholder="검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredOptions.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </Select>
  );
};

export default SearchBar;
