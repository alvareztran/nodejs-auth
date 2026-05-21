import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existedUser = await User.findOne({
            $or: [
                {
                    username
                },
                {
                    email
                }
            ]
        });
        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already exists, please check the information again.",
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        await newUser.save();
        if (newUser) {
            res.status(201).json({
                success: true,
                message: "User registed successfully.",
                data: newUser
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to create user, please try again."
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

// Login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials."
            })
        }
        const salt = await bcrypt.genSalt(10);
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials."
            })
        }
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            accessToken
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        const matched = await bcrypt.compare(oldPassword, user.password);
        if (!matched) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect. Please try again."
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

export { registerUser, loginUser, changePassword };