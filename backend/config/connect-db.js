const { Sequelize } = require("sequelize");
require("dotenv").config()

// Tạo đối tượng Sequelize để kết nối với cơ sở dữ liệu
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST, 
  dialect: process.env.DB_DIALECT, 
  logging: false, 
});

async function testConnection() {
  try {
    await sequelize.authenticate(); // Kiểm tra kết nối
    console.log(process.env.SUCCESS_MESSEAGE_CONNECT);
  } catch (error) {
    console.error(process.env.ERROR_MESSEAGE_CONNECT, error);
  }
}

testConnection();

module.exports = sequelize;
