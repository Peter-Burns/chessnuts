const router = require("express").Router();
const userController = require("../../controllers/userController");


router.route("/")
    .post(userController.create)
    .delete(userController.logout);


router.route("/login")
    .post(userController.login);


module.exports = router;
