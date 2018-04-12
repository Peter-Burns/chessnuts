const router = require("express").Router();
const gameController = require("../../controllers/gameController");

router.route("/numberofgames")
  .get(gameController.numberOfGames);

router.route("/resigngame/:id")
  .post(gameController.resignGame);

router.route("/yourturngames")
  .get(gameController.yourTurnGames);

router.route("/pastusergames")
  .get(gameController.findPastUserGames);

router.route("/join")
  .get(gameController.joinableGames);

router.route("/join/:id")
  .put(gameController.joinGame);

router.route("/:id")
  .get(gameController.findGame)
  .put(gameController.updateGame);

router.route("/")
  .get(gameController.findUserGames)
  .post(gameController.create);

module.exports = router;
