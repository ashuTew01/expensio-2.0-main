import { logInfo } from "@expensio/sharedlib";
import { app } from "./app.js";

const PORT = process.env.PORT || process.env.EVENT_BUS_PORT || 3000;

app.listen(PORT, () => {
	logInfo(`Event Bus Service is running on port ${PORT}`);
});
