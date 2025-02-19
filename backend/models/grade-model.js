const {DataTypes } = require("sequelize");
const sequelize = require("../config/connect-db"); // Kết nối đến database

// Định nghĩa model Grade
const Grade = sequelize.define(
  "Grade",
  {
    //Mã khối
    grade_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false, // tắt autoIncrement để xử lý thủ công
    },

    //Tên khối
    grade_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "grade",
    timestamps: true, // Để Sequelize tự tạo các trường createdAt và updatedAt
    underscored: true, // Sử dụng kiểu tên cột có dấu gạch dưới (student_id thay vì studentId)
  }
);

// Quan hệ với các bảng khác nếu có
Grade.associate = (models) => {
    Grade.hasMany(models.Class, { foreignKey: 'grade_id', as: 'class' });
};

module.exports = Grade;
