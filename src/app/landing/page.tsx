"use client";

import LandingNavbar from "@/components/LandingComp/LandingNavbar";
import HeroSection from "@/components/LandingComp/HeroSection";
import ParticleField from "@/components/LandingComp/ParticleField";
import InfiniteOrb from "@/components/LandingComp/InfiniteOrb";
import NeonGradient from "@/components/LandingComp/NeonGradient";
import FeaturesShowcase from "@/components/LandingComp/FeaturesShowcase";

const LandingPage = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <LandingNavbar />
            <ParticleField />
            <NeonGradient />
            <InfiniteOrb />

            <HeroSection />
            <FeaturesShowcase />
        </div>
    );
};

export default LandingPage;