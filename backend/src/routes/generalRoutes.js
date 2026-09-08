const express = require("express");
const { sayHI } = require("../controller/generalController");
const { route } = require(".");
const router = express.Router();

router.get("/", sayHI);

module.exports = router;
