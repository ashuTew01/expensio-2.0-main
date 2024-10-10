import React from "react";
import SummaryMarkdownDisplay from "../SummaryMarkdownDisplay";
import SummaryHeading from "./SummaryHeading";
import { motion } from "framer-motion";

const SummaryList = ({ financialSummary }) => {
	const sectionVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.3,
			},
		}),
	};

	const sections = [
		{
			title: "BEHAVIOURAL INSIGHTS",
			subtitle: "See your financial spending behaviour!",
			content: financialSummary.behavioralInsights,
		},
		{
			title: "BENCHMARKING",
			subtitle: "Compare your financial performance!",
			content: financialSummary.benchmarking,
		},
		{
			title: "PERSONALITY INSIGHTS",
			subtitle: "Understand your financial personality!",
			content: financialSummary.personalityInsights,
		},
		{
			title: "PERSONALIZED RECOMMENDATION",
			subtitle: "Get tailored advice for your finances!",
			content: financialSummary.personalizedRecommendations,
		},
	];

	return (
		<>
			{sections.map((section, index) => (
				<motion.div
					key={index}
					custom={index}
					initial="hidden"
					animate="visible"
					variants={sectionVariants}
				>
					<SummaryHeading
						title={section.title}
						subtitle={section.subtitle}
						variant="h2"
						titleFontColor="#36da45"
					/>
					<SummaryMarkdownDisplay markdown={section.content} />
				</motion.div>
			))}
		</>
	);
};

export default SummaryList;
