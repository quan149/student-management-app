const Student = require("../models/student-model");
const Class = require("../models/class-model");
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Lấy toàn bộ học sinh (sử dụng phân trang ở middleware)
const getAllStudents = async (req, res) => {
  try {
    const { role, username } = req.user;
    const { paginatedResults } = res;
    // Kiểm tra nếu không có học sinh nào (danh sách rỗng)
    if (!paginatedResults || paginatedResults.data.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có học sinh nào trong hệ thống." });
    }

    if (req.user.role === 2) {
      paginatedResults.data = paginatedResults.data.filter(
        (student) => student.class_id === req.user.username
      );
    }

    // Trả về dữ liệu đã phân trang từ middleware
    res.status(200).json({
      total: paginatedResults.total,
      totalPages: paginatedResults.totalPages,
      currentPage: paginatedResults.currentPage,
      limit: paginatedResults.limit,
      data: paginatedResults.data,
    });
  } catch (error) {
    // Kiểm tra lỗi trong request
    if (error.name === "SequelizeDatabaseError") {
      return res
        .status(400)
        .json({ error: "Lỗi trong quá trình truy vấn cơ sở dữ liệu." });
    }
    // Các lỗi không xác định
    res.status(500).json({ error: error.message });
  }
};

// Lấy học sinh theo student_id
const getStudentById = async (req, res) => {
  const { student_id } = req.params;
  try {
    const student = await Student.findOne({
      where: { student_id },
      include: [
        {
          model: Class, // JOIN với bảng Class
          as: "class",
          attributes: ["class_name"],
        },
      ],
      raw: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy học sinh nào." });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lọc học sinh theo tên, địa chỉ, lớp, khối và phân trang
const filterStudents = async (req, res) => {
  const { name, address, class_id, grade_id } = req.query;
  try {
    const filterCriteria = {};

    // Thêm điều kiện lọc nếu có giá trị trong query
    if (name) {
      filterCriteria.full_name = { [Sequelize.Op.like]: `%${name}%` }; // Tìm kiếm tên theo kiểu LIKE
    }
    if (address) {
      filterCriteria.address = { [Sequelize.Op.like]: `%${address}%` }; // Tìm kiếm địa chỉ
    }
    if (class_id) {
      filterCriteria.class_id = class_id; // Lọc theo class_id
    }
    if (grade_id) {
      filterCriteria.grade_id = grade_id; // Lọc theo grade_id
    }

    console.log(req.user);

    // Nếu user có role = 2, chỉ cho phép lọc theo class_id của chính họ
    if (req.user.role === 2) {
      filterCriteria.class_id = req.user.user;
    }

    // Kiểm tra giá trị phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Student.findAndCountAll({
      where: filterCriteria,
      offset: offset,
      limit: limit,
      include: [
        {
          model: Class, // JOIN với bảng Class
          as: "class",
          attributes: ["class_name"],
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
    console.log("Lỗi:", error);
    res.status(500).json({ error: error.message });
  }
};

// Hàm tạo mã học sinh mới dựa trên mã học sinh lớn nhất trong khối
const generateStudentId = async (req, res) => {
  const { grade_id } = req.params;
  let new_student_id = "00000000";
  try {
    // Lấy mã học sinh lớn nhất trong khối theo grade_id
    const lastStudent = await Student.findOne({
      where: { grade_id: grade_id },
      order: [["student_id", "DESC"]], // Lấy bản ghi có student_id lớn nhất
      attributes: ["student_id"],
    });

    //Gán phần mở đầu của mã học sinh theo từng khối
    if (grade_id == 1) new_student_id = process.env.IDCODE_STUDENT_GRADE_1;
    else if (grade_id == 2) new_student_id = process.env.IDCODE_STUDENT_GRADE_2;
    else if (grade_id == 3) new_student_id = process.env.IDCODE_STUDENT_GRADE_3;

    if (!lastStudent) {
      res.status(200).json(`${new_student_id}0000`);
    } else {
      // Lấy số thứ tự cuối cùng trong mã học sinh
      const lastStudentId = lastStudent.student_id;
      const lastIdNumber = parseInt(String(lastStudentId).slice(4)); // Lấy phần số thứ tự của mã học sinh

      // Tạo mã học sinh mới bằng cách cộng thêm 1 vào số thứ tự
      const newStudentId = `${new_student_id}${(lastIdNumber + 1)
        .toString()
        .padStart(4, "0")}`; // Đảm bảo số thứ tự 4 chữ số
      res.status(200).json(newStudentId);
    }
  } catch (error) {
    console.error("Error generating student ID:", error);
    throw new Error("Không thể tạo mã học sinh mới");
  }
};

// Tạo học sinh mới
const createStudent = async (req, res) => {
  const {
    student_id,
    full_name,
    date_of_birth,
    gender,
    address,
    phone,
    email,
    class_id,
    grade_id,
  } = req.body;
  try {
    // Kiểm tra xem học sinh đã tồn tại chưa
    const existingStudent = await Student.findOne({
      where: { student_id }, // Kiểm tra trùng mã học sinh
    });

    if (existingStudent) {
      return res.status(400).json({ error: process.env.ERROR_ID_CONFLICT });
    }

    // Nếu tài khoản có quyền admin hoặc quản lý lớp (user === class_id)
    if (req.user.user == class_id || req.user.role == 1) {
      const newStudent = await Student.create({
        student_id,
        full_name,
        date_of_birth,
        gender,
        address,
        phone,
        email,
        class_id,
        grade_id,
      });
      res.status(201).json({
        message: "Thêm học sinh thành công",
        student: newStudent,
      });
    } else {
            // Trả về thông báo không có quyền truy cập
      res.status(400).json({ message: "Bạn không có quyền thêm học sinh vào lớp đã chọn" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { student_id } = req.params; // Lấy student_id từ tham số URL
  const {
    full_name,
    date_of_birth,
    gender,
    address,
    phone,
    email,
    class_id,
    grade_id,
  } = req.body; // Lấy dữ liệu từ body

  try {
    // Tìm học sinh theo student_id
    const student = await Student.findOne({
      where: { student_id },
    });

    // Nếu học sinh không tồn tại, trả về lỗi
    if (!student) {
      return res.status(404).json({ error: "Học sinh không tồn tại" });
    }

    if (student.class_id == req.user.user || req.user.role == 1) {
      // Cập nhật thông tin học sinh
      await student.update({
        full_name,
        date_of_birth,
        gender,
        address,
        phone,
        email,
        class_id,
        grade_id,
      });

      // Trả về thông báo thành công cùng với thông tin học sinh đã cập nhật
      res.status(200).json({
        message: "Cập nhật thông tin học sinh thành công",
        student: student, // Trả về thông tin học sinh đã được cập nhật
      });
    } else {
      // Trả về thông báo không có quyền truy cập
      res.status(400).json({message: "Bạn không có quyền thay đổi thông tin học sinh này"});
    }
  } catch (error) {
    // Nếu có lỗi trong quá trình cập nhật, trả về lỗi
    res.status(500).json({ error: error.message });
  }
};

const updateClassOfStudents = async (req, res) => {
  const { student_ids } = req.body; // Lấy student_id từ tham số URL
  const { class_id } = req.body; // Lấy dữ liệu từ body

  console.log(student_ids);

  try {
    // Tìm học sinh theo student_id
    if (
      !student_ids ||
      !Array.isArray(student_ids) ||
      student_ids.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Danh sách student_id không hợp lệ" });
    }

    // Kiểm tra lớp học có tồn tại không
    const newClass = await Class.findByPk(class_id);
    if (!newClass) {
      return res.status(404).json({ message: "Không tồn tại lớp học" });
    }

    // Cập nhật lớp học cho danh sách học sinh
    const updatedStudents = await Student.update(
      { class_id: class_id },
      { where: { student_id: student_ids } }
    );

    res.json({
      message: "Cập nhật thông tin về lớp thành công",
      updatedCount: updatedStudents[0],
    });
  } catch (error) {
    // Nếu có lỗi trong quá trình cập nhật, trả về lỗi
    res.status(500).json({ error: error.message });
  }
};

// Xóa một hoặc nhiều học sinh theo danh sách student_id
const deleteStudents = async (req, res) => {
  const { student_ids } = req.body; // Lấy danh sách student_id từ body

  if (!student_ids || !Array.isArray(student_ids)) {
    return res.status(400).json({ error: "Danh sách student_id không hợp lệ" });
  }

  try {
    // Xóa học sinh theo danh sách student_ids
    const result = await Student.destroy({
      where: {
        student_id: student_ids, // Lọc các học sinh có student_id nằm trong danh sách
      },
    });

    // Nếu không có học sinh nào bị xóa
    if (result === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy học sinh nào để xóa" });
    }

    // Trả về thông báo xóa thành công
    res.status(200).json({
      message: `${result} học sinh đã được xóa thành công`,
    });
  } catch (error) {
    // Nếu có lỗi trong quá trình xóa, trả về lỗi
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  filterStudents,
  generateStudentId,
  createStudent,
  updateStudent,
  deleteStudents,
  updateClassOfStudents,
};
