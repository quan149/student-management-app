const express = require('express');
const { getAllStudents, getStudentById, filterStudents, generateStudentId, createStudent, updateStudent, updateClassOfStudents, deleteStudents } = require('../controllers/student-controller');
const paginate = require('../middlewares/pagination');
const validateStudentInput = require("../middlewares/validate-input")
const authenticateToken = require("../middlewares/authenticateToken")
const authenticateUser = require("../middlewares/authenticateUser")
const Class = require("../models/class-model");
const Student = require('../models/student-model');  // Import model Student

const router = express.Router();

// Route lấy toàn bộ học sinh, sử dụng middleware phân trang
router.get('/', authenticateToken, authenticateUser, paginate(Student, [
    {
      model: Class,
      as: "class",
      attributes: ["class_name"],
    },
  ],), getAllStudents);

// Route lọc học sinh theo tên, địa chỉ, lớp, khối và phân trang
router.get('/filter', authenticateToken, authenticateUser, filterStudents);

router.get('/random-id/:grade_id',authenticateToken, authenticateUser, generateStudentId)

//Route thay đổi thông tin về lớp cho nhiều học sinh
router.put('/update-class-student',authenticateToken, authenticateUser, updateClassOfStudents)

// Route lấy học sinh theo student_id
router.get('/:student_id',authenticateToken, authenticateUser, getStudentById);

//Route tạo mới học sinh
router.post('/create-student',authenticateToken, authenticateUser, validateStudentInput, createStudent)

//Route thay đổi thông tin học sinh
router.put('/update-student/:student_id',authenticateToken, authenticateUser, updateStudent)

//Xóa một hoặc nhiều học sinh theo danh sách id
router.delete('/delete-student',authenticateToken, authenticateUser, deleteStudents)

module.exports = router;
