'use client';

import Footer from '@/components/footer/Footer';
import FeatureSection from '@/components/homepage/FeatureSection';
import HeroSection from '@/components/homepage/HeroSection';
import Product from '@/components/homepage/Product';
import Navbar from '@/components/navbar/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <Product />
      <Footer />
    </>
  );
}
