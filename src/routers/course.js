const {
  getAllCourse,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");
const express = require("express");
const router = express.Router();

router.get("/", getAllCourse);
router.get("/:id", getCourse);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
