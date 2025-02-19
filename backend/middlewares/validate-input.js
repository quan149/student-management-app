require("dotenv").config()

const validateStudentInput = (req, res, next) => {
  const {full_name, date_of_birth, gender, address, phone, email, class_id, grade_id} = req.body;

  let list_error = []

  if (!full_name || full_name == "") {
    list_error.push(process.env.ERROR_NAME_REQUIRED)
  }

  if (!gender || gender == "") {
    list_error.push(process.env.ERROR_GENDER_REQUIRED)
  }

  if (!address || address == "") {
    list_error.push(process.env.ERROR_ADDRESS_REQUIRED)
  }

  if (!class_id || class_id == "") {
    list_error.push(process.env.ERROR_CLASS_REQUIRED)
  }

  if (email && !/\S+@\S+\.\S+/.test(email) && email != "") {
    list_error.push(process.env.ERROR_EMAIL_INVALID)
  }

  // Kiểm tra kiểu dữ liệu của gender
  const validGenders = ["Nam", "Nữ"];
  if (!validGenders.includes(gender)) {
    list_error.push(process.env.ERROR_GENDER_INVALID)
  }

  // Kiểm tra định dạng ngày sinh
  const isValidDate = !isNaN(Date.parse(date_of_birth));
  if (!date_of_birth || date_of_birth == "") {
    list_error.push(process.env.ERROR_DOB_REQUIRED)
  } else if (!isValidDate) {
    list_error.push(process.env.ERROR_DOB_INVALID)
  }

  if (list_error.length != 0) return res.status(400).json({error: list_error})

  // Tiến hành tiếp với yêu cầu nếu không có lỗi
  next();
};

module.exports = validateStudentInput;