import React from 'react';
import { ThemeProvider } from '../../contexts/landing/ThemeContext';
import Navbar from '../../components/landing/layout/Navbar';
import HeroSection from '../../components/landing/sections/HeroSection';
import ServicesSection from '../../components/landing/sections/ServicesSection';
import VehiclesSection from '../../components/landing/sections/VehiclesSection';
import AboutSection from '../../components/landing/sections/AboutSection';
import GetStartedSection from '../../components/landing/sections/GetStartedSection';
import Footer from '../../components/landing/layout/Footer';

function CommonLandingPage() {
  return (
    <ThemeProvider>
        <div className="min-h-screen">
          <Navbar />
          <main>
            <HeroSection />
            <ServicesSection />
            <VehiclesSection />
            <AboutSection />
            <GetStartedSection />
          </main>
          <Footer />
        </div>
    </ThemeProvider>
  );
}

export default CommonLandingPage;