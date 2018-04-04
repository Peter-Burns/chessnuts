const router = require("express").Router();
const gameController = require("../../controllers/gameController");

router.route("/join")
  .get(gameController.joinableGames);
  
router.route("/join/:id")
.put(gameController.joinGame);

router.route("/:id")
  .get(gameController.findGame)
  .put(gameController.updateGame);

router.route("/")
  .get(gameController.findAll)
  .post(gameController.create);

module.exports = router;
