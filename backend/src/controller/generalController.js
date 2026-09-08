const sayHI = async (req, res) => {
	try {
		res.status(200).json({ msg: "Welcome to my Server" });
	} catch (e) {
		res.status(500).json({ err: "Internel Server error" });
	}
};

module.exports = { sayHI };
