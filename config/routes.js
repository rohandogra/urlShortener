const express = require("express");
const router = express.Router();
const urlController = require("../app/controllers/urlController");
const userController = require("../app/controllers/userController");
const { auth } = require("../app/middlewares/authenticate");
const { clickUpdates } = require("../app/middlewares/clickUpdates");

router.post("/short", auth, urlController.create);
router.get("/short", auth, urlController.list);
router.get("/:hash", clickUpdates, urlController.redirect);
router.get("/short/:id", urlController.show);
router.delete("/short/:id", urlController.destroy);

//! register Route
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
