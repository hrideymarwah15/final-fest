import { HeroSection } from "@/components/sections/hero";
import { FeaturedSportsSection } from "@/components/sections/featured-sports";
import { GallerySection } from "@/components/sections/gallery";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { CTASection } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSportsSection />
      <GallerySection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
