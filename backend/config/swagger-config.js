// config/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cấu hình options cho swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0', // Định dạng OpenAPI 3.0
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Node.js app'
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Địa chỉ API của bạn
      },
    ],
  },
  // Đường dẫn tới các file chứa các route để swagger có thể tự động tạo tài liệu
  apis: ['./routes/*.js'], // Nếu routes của bạn nằm trong thư mục routes, có thể thay đổi tuỳ thuộc vào cấu trúc của bạn
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };