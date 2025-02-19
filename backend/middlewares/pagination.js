const paginate = (model, include = []) => async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit); // Tính offset từ trang và giới hạn
    const { count, rows } = await model.findAndCountAll({
      offset: offset,
      limit: parseInt(limit),
      include: include,
      raw: true
    });

    res.paginatedResults = {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
      data: rows,
    };
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = paginate;
