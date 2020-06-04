const Course = require("../models/course");
const Student = require("../models/student");

async function getCourse(req, res) {
  const { id } = req.params;
  const course = await Course.findById(id)
    .populate("students", "firstname lastname email")
    .exec();
  if (!course) {
    return res.status(404).json("cannot find this course");
  }
  return res.json(course);
}

async function getAllCourse(req, res) {
  const course = await Course.find().exec();
  return res.json(course);
}

async function addCourse(req, res) {
  const { _id, name, description } = req.body;
  const course = new Course({
    _id,
    name,
    description,
  });
  const addcourse = await course.save();
  return res.json(addcourse);
}

async function updateCourse(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatecourse = await Course.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  if (!updatecourse) {
    return res.status(404).json("cannot find this couse");
  }
  return res.json(updatecourse);
}

async function deleteCourse(req, res) {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id).exec();
  if (!course) {
    return res.status(404).json("cannot find this course");
  }
  await Student.updateMany(
    { courses: course._id },
    {
      $pull: {
        courses: course._id,
      },
    }
  );
  return res.sendStatus(200);
}

module.exports = {
  getAllCourse,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
