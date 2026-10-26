import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import LogoBar from "../components/tiny/LogoBar";
import HeroImage from "../components/tiny/HeroImage";
import BrowseSection from "../components/BrowseSection";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
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
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
