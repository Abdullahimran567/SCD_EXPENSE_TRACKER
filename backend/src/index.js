const app = require("./app.js");
require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT || 5000, () => {
	console.log(`Server running on ${PORT}`);
});
