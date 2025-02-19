const Student = require("../models/student-model");
const Class = require("../models/class-model");
const Grade = require("../models/grade-model");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Lấy học sinh theo student_id
const getAllClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const {count, rows}  = await Class.findAndCountAll({
      offset: offset,
      limit: limit,
      include: [
        {
          model: Grade, // JOIN với bảng Class
          as: "grade",
          attributes: ["grade_name"],
        },
      ],
      raw: true,
    });
    res.status(200).json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit: limit,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllClasses,
};
