import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import LogoBar from "../components/ui/LogoBar";
import HeroImage from "../components/ui/HeroImage";
import BrowseSection from "../components/BrowseSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <HeroImage />
      <LogoBar />
      <ProductSection />
      <BrowseSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
