const {DataTypes} = require("sequelize");

const sequelize = require("../config/connect-db"); // Kết nối đến database

// Định nghĩa model Student
const User = sequelize.define(
  "User",
  {
    // Mã học sinh
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true, 
    },

    // Tên đăng nhập
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Mật khẩu
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Quyền của tải khoản 
    // 1: tài khoản của trường quản lý toàn bộ học sinh
    // 2: tài khoản của GVCN quản lý học sinh trong lớp
    role: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true, // Để Sequelize tự tạo các trường createdAt và updatedAt
    underscored: true, // Sử dụng kiểu tên cột có dấu gạch dưới (student_id thay vì studentId)
  }
);

module.exports = User;
