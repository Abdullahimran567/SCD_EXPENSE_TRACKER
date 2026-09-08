import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT || 5000, () => {
	console.log(`Server running on ${PORT}`);
});
