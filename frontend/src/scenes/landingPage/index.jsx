// src/pages/LandingPage.jsx
import React from "react";
import Header from "../../components/landingPage/Header";
import HeroSection from "../../components/landingPage/HeroSection";
import FeaturesSection from "../../components/landingPage/FeaturesSection";
import TechnicalAchievements from "../../components/landingPage/TechnicalAchievements";
import CallToActionSection from "../../components/landingPage/CallToActionSection";
import TeamSection from "../../components/landingPage/TeamSection";
import Footer from "../../components/landingPage/Footer";

const LandingPage = () => {
	return (
		<>
			<Header />
			<HeroSection />
			<FeaturesSection />
			<TechnicalAchievements />
			<TeamSection />
			<CallToActionSection />
			<Footer />
		</>
	);
};

export default LandingPage;
