// src/pages/LandingPage.jsx
import React from "react";
import Header from "../../components/landingPage/Header";
import HeroSection from "../../components/landingPage/HeroSection";
import FeaturesSection from "../../components/landingPage/FeaturesSection";
import TechnicalAchievements from "../../components/landingPage/TechnicalAchievements";
import CallToActionSection from "../../components/landingPage/CallToActionSection";

const LandingPage = () => {
	return (
		<>
			<Header />
			<HeroSection />
			<FeaturesSection />
			<TechnicalAchievements />
			<CallToActionSection />
		</>
	);
};

export default LandingPage;
