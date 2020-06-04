const Student = require('../models/student');
const Course = require('../models/course');

async function addStudent(req, res) {
    const { firstname, lastname, email } = req.body;
    const student = new Student({
        firstname,
        lastname,
        email,
    });
    await student.save();
    return res.json(student);
}
async function getStudent(req, res) {
    const { id } = req.params;
    const student = await Student.findById(id)
        .populate('courses', 'name description')
        .exec();
    if (!student) {
        return res.status(404).json('cannot find this student');
    }
    return res.json(student);
}
async function getAllStudent(req, res) {
    const students = await Student.find().exec();
    return res.json('hello world');
}
async function updateStudent(req, res) {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    const student = await Student.findByIdAndUpdate(
        id,
        { firstname, lastname, email },
        { new: true }
    ).exec();
    if (!student) {
        return res.status(404).json('cannot find student');
    }
    return res.json(student);
}
async function deleteStudent(req, res) {
    const { id } = req.params;
    const student = await (await Student.findByIdAndDelete(id)).execPopulate();
    if (!student) {
        return res.status(404).json('cannot find the student');
    }
    await Course.updateMany(
        { id: { $in: student.courses } },
        {
            $pull: {
                students: student._id,
            },
        }
    );
    return res.sendStatus(200);
}
async function addCourse(req, res) {
    const { id, code } = req.params;
    const student = await Student.findById(id);
    const course = await Course.findById(code);
    if (!student || !course) {
        return res.status(404).json('student or course are not found');
    }
    student.courses.addToSet(course._id);
    course.students.addToSet(student._id);
    await course.save();
    await student.save();
    return res.json(student);
}
async function deleteCourse(req, res) {
    const { id, code } = req.params;
    const student = await Student.findById(id);
    const course = await Course.findById(code);
    if (!student || !course) {
        return res.status(404).json('not found');
    }
    const oldlength = student.courses.length;
    student.courses.pull(code);
    if (student.courses.length === oldlength) {
        return res.status(500).json('not even have this obj');
    }
    course.students.pull(id);
    await course.save();
    await student.save();
    return res.json(student);
}

module.exports = {
    deleteCourse,
    addCourse,
    addStudent,
    getAllStudent,
    getStudent,
    updateStudent,
    deleteStudent,
};
