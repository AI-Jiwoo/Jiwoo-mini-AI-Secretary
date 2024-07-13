import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import SimilarServicePage from './pages/SimilarAnalysisPage';
import Header from '../src/component/Header';
import LandingPage from "./pages/LandingPage";
import BusinessSupportPage from "./pages/BusinessSupportPage";
import MarketResearch from "./pages/MarketResearch";
import Footer from './component/Footer';

function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="SimilarService" element={
                        <>
                            <Header />
                            <SimilarServicePage />
                            <Footer /> {/* Footer 추가 */}
                        </>
                    } />
                    <Route path="BusinessSupport" element={
                        <>
                            <Header />
                            <BusinessSupportPage />
                            <Footer /> {/* Footer 추가 */}
                        </>
                    } />
                    <Route path="MarketResearch" element={
                        <>
                            <Header />
                            <MarketResearch />
                            <Footer /> {/* Footer 추가 */}
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
