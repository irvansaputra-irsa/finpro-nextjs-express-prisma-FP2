import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';

export default function CustomerLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />;
    </>
  );
}
