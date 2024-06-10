'use client';

import FeatureSection from '@/components/homepage/FeatureSection';
import HeroSection from '@/components/homepage/HeroSection';
import Product from '@/components/homepage/Product';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <Product />
    </>
  );
}
