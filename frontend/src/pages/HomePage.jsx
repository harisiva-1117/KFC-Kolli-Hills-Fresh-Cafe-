import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Categories from "@/components/site/Categories";
import BestSellers from "@/components/site/BestSellers";
import OurStory from "@/components/site/OurStory";
import Gallery from "@/components/site/Gallery";
import Reviews from "@/components/site/Reviews";
import ContactLocation from "@/components/site/ContactLocation";
import Footer from "@/components/site/Footer";

const HomePage = () => {
  return (
    <div
      data-testid="home-page"
      className="relative bg-[#FDFBF7] text-[#1F1F1F] font-body"
    >
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <BestSellers />
        <OurStory />
        <Gallery />
        <Reviews />
        <ContactLocation />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#FDFBF7",
            color: "#1F1F1F",
            border: "1px solid #E8E2D9",
            borderRadius: 0,
          },
        }}
      />
    </div>
  );
};

export default HomePage;
