export const expenseCategoryCodesEnum = [
	"housing",
	"utilities",
	"transportation",
	"food",
	"healthAndMedical",
	"insurance",
	"debtRepayment",
	"educationAndChildcare",
	"personalCare",
	"entertainmentAndRecreation",
	"savingsAndInvestments",
	"giftsAndDonations",
	"pets",
	"miscellaneous",
];
export const expenseCognitiveTriggerCodesEnum = [
	"impulseBuying",
	"socialInfluence",
	"emotionalSpending",
	"scarcityPerception",
	"statusSeeking",
	"rewardSeeking",
	"habitualPurchasing",
	"convenience",
	"curiosity",
	"selfIdentity",
	"guiltAvoidance",
	"obligation",
	"nostalgia",
	"financialOptimism",
	"cognitiveDissonance",
];

export const expenseCategoryDescription = `
Please choose the relevant category for the expense using the following codes: 
housing, utilities, transportation, food, healthAndMedical, insurance, debtRepayment, educationAndChildcare, personalCare, entertainmentAndRecreation, savingsAndInvestments, giftsAndDonations, pets, miscellaneous.
`;

export const expenseCognitiveTriggerDescription = `
They represent a comprehensive view of the psychological motivations behind consumer spending, helping to understand the complex factors that influence buying behavior.
These cognitive triggers are not mutually exclusive and can overlap in driving a single purchase.
Please identify the cognitive triggers using the following codes:
impulseBuying, socialInfluence, emotionalSpending, scarcityPerception, statusSeeking, rewardSeeking, habitualPurchasing, convenience, curiosity, selfIdentity, guiltAvoidance, obligation, nostalgia, financialOptimism, cognitiveDissonance.
Triggers are optional but recommended for better tracking of spending behaviors.
`;

export const expenseCategoryDetailedDescription = `
Please select the most appropriate category for the expense from the following codes:
- housing: Expenses related to rent, mortgage, property taxes, or maintenance costs.
- utilities: Essential services such as electricity, water, internet, and phone bills.
- transportation: Costs like fuel, vehicle maintenance, public transit, or parking.
- food: Grocery purchases, dining out, and food delivery services.
- healthAndMedical: Medical expenses, health insurance, dental/vision care, or medications.
- insurance: Any form of insurance, including life, auto, and home insurance.
- debtRepayment: Payments towards credit cards, loans, or other debts.
- educationAndChildcare: Costs for tuition, school supplies, childcare, or after-school programs.
- personalCare: Personal grooming, clothing, gym memberships, and related expenses.
- entertainmentAndRecreation: Leisure activities such as movies, concerts, or vacations.
- savingsAndInvestments: Contributions to savings accounts, retirement funds, or investments.
- giftsAndDonations: Money spent on gifts or charitable donations.
- pets: All pet-related expenses, including food, grooming, and veterinary care.
- miscellaneous: Expenses that do not fit into the above categories.
`;

export const expenseCognitiveTriggerDetailedDescription = `
Please identify any relevant cognitive triggers that influenced this expense using the following codes:
- impulseBuying: A sudden urge to purchase without prior planning.
- socialInfluence: Buying influenced by peers, recommendations, or social norms.
- emotionalSpending: Purchases made to alleviate emotions such as stress or boredom.
- scarcityPerception: Buying due to fear of missing out on limited offers.
- statusSeeking: Purchases to signal wealth or status, often involving luxury goods.
- rewardSeeking: Spending motivated by the desire for discounts, loyalty points, or rewards.
- habitualPurchasing: Recurring purchases made out of routine or habit.
- convenience: Purchases made for the sake of ease, even at higher cost.
- curiosity: Buying something new to explore or experiment with.
- selfIdentity: Purchases that align with how you see or wish to present yourself.
- guiltAvoidance: Buying out of a sense of obligation, such as gifts for others.
- obligation: Purchases made out of a social or moral duty, such as donations.
- nostalgia: Spending triggered by memories or past experiences.
- financialOptimism: Spending in anticipation of future financial improvement.
- cognitiveDissonance: Justifying previous purchases by spending more.
These triggers are optional but help in understanding spending behavior.
`;
