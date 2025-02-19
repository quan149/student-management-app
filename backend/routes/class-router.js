const express = require('express');
const {getAllClasses} = require('../controllers/class-controller');
const Class = require("../models/class-model");
const Student = require('../models/student-model');  // Import model Student
const authenticateToken = require("../middlewares/authenticateToken")

const router = express.Router();

// Route lọc học sinh theo tên, địa chỉ, lớp, khối và phân trang
router.get('/', authenticateToken, getAllClasses);

module.exports = router;
