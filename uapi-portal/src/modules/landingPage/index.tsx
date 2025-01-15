import { Fragment } from "react";

import { BookDemoSection } from "~/modules/landingPage/components/BookDemoSection";
import { DeveloperExperience } from "~/modules/landingPage/components/DeveloperExperience";
import { Features } from "~/modules/landingPage/components/Features";
import Footer from "~/modules/landingPage/components/Footer";
import HeroSection from "~/modules/landingPage/components/HeroSection";
import ScrollUpButton from "~/modules/landingPage/components/ScrollUpButton";
import { ServiceProviders } from "~/modules/landingPage/components/ServiceProviders";
import { Service } from "~/modules/landingPage/components/Services";
import SocialProof from "~/modules/landingPage/components/SocialProof";

const LandingPage = () => {
  return (
    <Fragment>
      <HeroSection />
      <SocialProof />
      <Features />
      <ServiceProviders />
      <DeveloperExperience />
      <Service />
      <BookDemoSection />
      <ScrollUpButton />
      <Footer />
    </Fragment>
  );
};

export default LandingPage;
