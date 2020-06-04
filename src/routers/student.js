const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudent,
  deleteCourse,
  getStudent,
  updateStudent,
  addCourse,
  deleteStudent,
} = require("../controllers/student");

router.get("/", getAllStudent);
router.get("/:id", getStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.post("/", addStudent);
router.put("/:id/courses/:code", addCourse);
router.delete("/:id/courses/:code", deleteCourse);

module.exports = router;
