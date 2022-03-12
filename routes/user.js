const express = require("express");
const controllWorker = require("../controller/userController");

const router = express.Router();

router
    .route("/:id")
    .patch(controllWorker.modifyUser)
    .delete(controllWorker.removeUser);

module.exports = router;
