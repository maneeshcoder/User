import jwt from 'jsonwebtoken'
export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ 
                message: "User must be logged in" });
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        next()
    } catch (error) {
        next(500, error.message)
    }
}