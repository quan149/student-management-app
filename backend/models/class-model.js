const {DataTypes } = require("sequelize");
const Student = require('./student-model');
const Grade = require('./grade-model')
const sequelize = require("../config/connect-db"); // Kết nối đến database

// Định nghĩa model Class
const Class = sequelize.define(
  "Class",
  {
    //Mã lớp học
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false, // tắt autoIncrement để xử lý thủ công
    },

    //Tên lớp học
    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    //Mã khối
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "class",
    timestamps: true, // Để Sequelize tự tạo các trường createdAt và updatedAt
    underscored: true, // Sử dụng kiểu tên cột có dấu gạch dưới (student_id thay vì studentId)
  }
);

// Quan hệ với các bảng khác nếu có
Class.associate = (models) => {
    Class.hasMany(models.Student, { foreignKey: 'class_id', as: 'students' });
};
Class.belongsTo(Grade, { foreignKey: "grade_id", as: "grade" });

module.exports = Class;
