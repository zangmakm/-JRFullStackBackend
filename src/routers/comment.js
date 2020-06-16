const express = require("express");
const router = express.Router();
const {getComment} = require("../controllers/comment");

//get comment by id
router.get("/:commentId", getComment);

module.exports = router;
