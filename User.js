import bcrypt from 'bcryptjs'
import User from './User.model.js'
import jwt from 'jsonwebtoken'

//register
export const register = async (req, res) => {
    try {
        const { username, email, password, fullName, gender, dateOfBirth, country } = req.body;
        if (!username || !email || !password || !fullName || !gender || !dateOfBirth || !country) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password:hashedPassword,
            fullName,
            gender,
            dateOfBirth,
            country
        })

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Registration successful.'
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const hashedPassword = user.password;
        const comparePassword = await bcrypt.compare(password, hashedPassword);
        if (!comparePassword) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        if (!comparePassword) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Login successful.'
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//searching the user
export const search = async (req, res) => {
    try {
        const { query } = req.query;
        const user = await User.findOne({ $or: [{ username: query }, { email: query }] }).select("-password");
        if (!user)
             return res.status(404).json({
             message: "User not found" 
            });
        
        res.status(200).json({
            message: 'User data found.',
            user
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
