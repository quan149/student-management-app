const authenticateUser = (req, res, next) => {
    console.log(req.user);
    
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === 1) {
        return next();
    }

    if (req.user.role === 2) {
        return next();
    }
    
    return res.status(403).json({ message: "Forbidden: You don't have permission" });
};

module.exports = authenticateUser;