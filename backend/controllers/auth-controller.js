const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const SECRET_KEY = "supersecretkey";

// Đăng nhập User
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Tìm kiếm người dùng có tài khoản và username
  const user = await User.findOne({ where: { username } });
  if (!user)
    return res
      .status(400)
      .json({ error: "Tài khoản hoặc mật khẩu không đúng!" });

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);

  // Nếu mật khẩu trong trùng khớp thì trả về thông báo
  if (!isMatch)
    return res
      .status(400)
      .json({ error: "Tài khoản hoặc mật khẩu không đúng!" });

  // Tạo jwt
  const token = jwt.sign({ id: user.id, user: user.username, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });

  // Phản hồi đăng nhập thành công
  res.status(200).json({ 
    message: "Đăng nhập thành công!", 
    username: user.username,
    role: user.role,
    authToken: token });
};

// Đăng ký User
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      role: role,
    });
    res.json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    res.status(500).json({ error: "Tên đăng nhập đã tồn tại hoặc lỗi hệ thống!" });
  }
};
