import { removeIncomeFinancialDataService } from "../../services/financialDataService.js";

export const incomeDeletedEventHandler = async (message) => {
	await removeIncomeFinancialDataService(message);
};
