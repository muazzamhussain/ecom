import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import LogoBar from "../components/LogoBar";
import HeroImage from "../components/HeroImage";
import BrowseSection from "../components/BrowseSection";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <HeroImage />
      <LogoBar />
      <ProductSection />
      <BrowseSection />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
