import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import SimilarServicePage from './pages/SimilarAnalysisPage';
import Header from '../src/component/Header';
import BusinessSupportPage from "./pages/BusinessSupportPage";
import LandingPage from "./pages/LandingPage";
import MarketResearch from "./pages/MarketResearch";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="SimilarService" element={<SimilarServicePage />} />
            <Route path="BusinessSupport" element={<BusinessSupportPage/>}/>
            <Route path="MarketResearch" element={<MarketResearch/>}/>
        </Routes>

          <Routes>
              <Route path="JIWOO" element={<LandingPage/>}/>
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
