const express = require("express");

const router = express.Router();

router.use("/", require("./generalRoutes"));

module.exports = router;
