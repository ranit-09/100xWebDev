const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.headers.token; // jwt

    const decoded = jwt.verify(token, "attlasiationsupersecret123123password");
    const userId = decoded.userId;
    if (userId) {
        req.userId = userId; //attach userId with the req object
        next();
    } else {
        res.status(403).json({
            message: "Token was incorrect"
        })
    }
}

module.exports = {
    authMiddleware: authMiddleware
}