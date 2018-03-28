const router = require("express").Router();
const gameController = require("../../controllers/gameController");


router.route("/")
  .get(gameController.findAll)
  .post(gameController.create);


router
  .route("/:id")
  .get(gameController.findGame)
  .put(gameController.updateGame);

module.exports = router;
