const {DataTypes } = require("sequelize");
const Class = require('./class-model');
const Grade = require('./grade-model')
const sequelize = require("../config/connect-db"); // Kết nối đến database

// Định nghĩa model Student
const Student = sequelize.define(
  "Student",
  {
    //Mã học sinh
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false, // tắt autoIncrement để xử lý thủ công
    },

    //Họ và tên
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    //Ngày sinh
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    //Giới tính
    gender: {
      type: DataTypes.ENUM("Nam", "Nữ","Khác"),
      allowNull: false,
    },

    //Địa chỉ
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    //Số điện thoại
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    //Địa chỉ email
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    //Mã lớp
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    //Mã khối
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: true, // Để Sequelize tự tạo các trường createdAt và updatedAt
    underscored: true, // Sử dụng kiểu tên cột có dấu gạch dưới (student_id thay vì studentId)
  }
);

// Quan hệ với các bảng khác nếu có
Student.belongsTo(Class, { foreignKey: "class_id", as: "class" });
Student.belongsTo(Grade, { foreignKey: "grade_id", as: "grade" });

module.exports = Student;
