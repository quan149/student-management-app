const express = require('express');
const app = express();
const { swaggerUi, specs } = require('./config/swagger-config');
const cors = require('cors');
const studentRoutes = require('./routes/student-router');  // Import các route của học sinh
const classRoutes = require('./routes/class-router')
const authRoutes = require('./routes/auth-router')

// Middleware để parse dữ liệu JSON
app.use(express.json());

// Sử dụng cors cho tất cả các yêu cầu
app.use(cors());

// Sử dụng route studentRoutes cho tất cả các request liên quan đến học sinh
app.use('/api/students', studentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/classes', classRoutes);
app.use('/api/auth', authRoutes)

// Lắng nghe cổng server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});