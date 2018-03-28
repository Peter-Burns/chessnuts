const router = require("express").Router();
const userRoutes = require("./users");
const gameRoutes = require("./games");

router.use("/users", userRoutes);
router.use("/games", gameRoutes);

module.exports = router;
