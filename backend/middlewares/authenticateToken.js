const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecretkey";

const authenticateToken = (req, res, next) => {
  // Lấy token từ header Authorization
  const token = req.header("Authorization")?.split(" ")[1]; // Token nằm sau "Bearer"

  // Nếu không có token
  if (!token) {
    return res
      .status(403)
      .json({ error: "Yêu cầu bị từ chối, bạn cần cung cấp token" });
  }

  // Kiểm tra tính hợp lệ của token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "Token không hợp lệ" });
    }
    req.user = decoded; // Chứa thông tin người dùng đã được giải mã từ token
    next(); // Tiếp tục xử lý request
  });
};

module.exports = authenticateToken;
