import userModel from "../../../db/models/user.model.js"
import jwt from 'jsonwebtoken'
import appError from "../../utils/appError.js"
import sendEmail from "../../services/sendEmail.js"
import bcrypt from 'bcryptjs'
import { customAlphabet } from "nanoid"
import { ApiFeatures } from "../../utils/apiFeatures.js"
/*
User sign up controller
*/
export const signUp = async (req, res, next) => {
    const { name, email, password, cPassword, age, phone, street, city, state, role } = req.body;

    if (password !== cPassword) {
        return next(new appError("Passwords don't match", 400));
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
        return next(new appError("User already exists", 409));
    }

    const token = jwt.sign({ email }, process.env.TOKEN_SIGN_SECRET, { expiresIn: "15m" });
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

    const rfToken = jwt.sign({ email }, process.env.TOKEN_SIGN_SECRET);
    const rfLink = `${req.protocol}://${req.headers.host}/users/rfVerifyEmail/${rfToken}`;

    await sendEmail(email, "E-commerce Verify Email", htmlContent(link, rfLink));

    const user = new userModel({
        name,
        email,
        password: bcrypt.hashSync(password, +process.env.SALT_ROUNDS), // Hash the password before saving
        age,
        phone,
        address: {
            street,
            city,
            state
        },
        role
    });
    req.data = {
        model: userModel,
        _id: user._id
    }
    const newUser = await user.save();

    if (newUser) {
        res.status(201).json({ msg: "User created successfully. Please check your email", newUser });
    } else {
        next(new appError("User not created", 400));
    }
};

/*
User verification controller
*/
export const verifyEmail = async (req, res, next) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);

        if (!decoded?.email) {
            return next(new appError("Invalid or expired verification link", 400));
        }

        const user = await userModel.findOneAndUpdate(
            { email: decoded.email, isEmailVerified: false },
            { isEmailVerified: true },
            { new: true }
        );
        req.data = {
            model: userModel,
            _id: user._id
        }
        if (user) {
            return res.status(200).json({ message: "Email verification successful", user });
        }

        return res.status(409).json({ message: "User is already verified" });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new appError("Verification link has expired, please request a new one", 410)); // 410 Gone
        }
        return next(error);
    }
};


/*
User RE verification controller
*/
export const rfVerifyEmail = async (req, res, next) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);

        if (!decoded?.email) {
            return next(new appError("Invalid verification link", 400));
        }

        const { email } = decoded;

        const user = await userModel.findOne({ email, isEmailVerified: true });
        if (user) {
            return res.status(409).json({ message: "User is already verified" });
        }

        const newToken = jwt.sign({ email: email }, process.env.TOKEN_SIGN_SECRET, { expiresIn: "3m" });
        const verificationLink = `${req.protocol}://${req.headers.host}/users/verifyEmail/${newToken}`;

        const newRfToken = jwt.sign({ email: email }, process.env.TOKEN_SIGN_SECRET);
        const refreshLink = `${req.protocol}://${req.headers.host}/users/rfVerifyEmail/${newRfToken}`;

        await sendEmail(email, "E-commerce Email Verification", htmlContent(verificationLink, refreshLink));

        return res.status(200).json({ message: "A new verification email has been sent. Please check your inbox." });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new appError("Verification link has expired, please request a new one", 410)); // 410 Gone
        }

        return next(error);
    }
};

/*
User Forgets his password
*/

export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return next(new appError("User does not exist", 404));
        }

        const OTPf = customAlphabet("0123456789", 6);
        const OTP = OTPf();

        const emailSent = await sendEmail(email, "Reset Password Code", otpEmailContent(OTP));
        if (!emailSent) {
            return next(new appError("Failed to send email, please try again", 500));
        }

        await userModel.updateOne({ email }, { OTP });

        res.status(200).json({ message: "Success! Check your email for the OTP." });

    } catch (error) {
        return next(error);
    }
};

/*
User Reset his password
*/

export const resetPassword = async (req, res, next) => {
    try {
        const { email, OTP, newPassword, cPassword } = req.body

        if (newPassword !== cPassword) {
            return next(new appError("Passwords do not match", 400));
        }

        const user = await userModel.findOne({ email, OTP })

        if (!user || OTP == "")
            return next(new appError("User not exists or OTP is not correct", 404))

        await userModel.updateOne({ email },
            {
                OTP: "", password: bcrypt.hashSync(newPassword, + process.env.SALT_ROUNDS),
                passwordChangedAt: new Date()
            })
        res.status(200).json({ msg: "Password update done" })
    } catch (error) {
        next(error);
    }
}
/*
User log in
*/
export const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userExist = await userModel.findOne({ email }).select("+password")

        if (!userExist) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }
        if (!userExist.isEmailVerified) {
            return res.status(400).json({ msg: "Verfing pending" });
        }

        if (!bcrypt.compareSync(password, userExist.password)) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: userExist._id, email: userExist.email, role: userExist.role },
            process.env.TOKEN_SIGN_SECRET,
            { expiresIn: "7d" }
        );

        await userModel.findByIdAndUpdate(userExist._id, { loggedIn: true });

        return res.status(200).json({ msg: "Login successful", token });

    } catch (error) {
        next(error);
    }
};
/*
User log out
*/
export const logOut = async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate(req.user._id, { loggedIn: false })
        return res.status(200).json({ msg: "Logut successful" })
    } catch (error) {
        next(error);
    }
};
/*
User Update his profile
*/
export const updateProfile = async (req, res, next) => {
    try {
        const { name, age, phone, street, city, state } = req.body;
        const user = await userModel.findById(req.user._id);

        const updateData = {};

        let isUpdated = false;

        if (name && name !== user.name) {
            updateData.name = name;
            isUpdated = true;
        }

        if (age && age !== user.age) {
            updateData.age = age;
            isUpdated = true;
        }

        if (phone && phone !== user.phone) {
            updateData.phone = phone;
            isUpdated = true;
        }

        if (street || city || state) {
            const newAddress = {
                street: street || user.address?.street,
                city: city || user.address?.city,
                state: state || user.address?.state,
            };

            if (JSON.stringify(newAddress) !== JSON.stringify(user.address)) {
                updateData.address = newAddress;
                isUpdated = true;
            }
        }

        if (isUpdated) {
            await userModel.findByIdAndUpdate(req.user._id, updateData);
            return res.status(200).json({ msg: "User updated successfully" });
        }

        return res.status(400).json({ msg: "No changes detected" });

    } catch (err) {
        next(err);
    }
};

export const myProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        return res.status(200).json({ msg: "done", user })
    }
    catch (err) {
        next(err);
    }
};
export const allUsers = async (req, res, next) => {
    try {

        const apiFeatures = new ApiFeatures(userModel.find(), req.query)
            .filter()
            .pagination()
            .search()
            .sort()
            .select()

        const users = await apiFeatures.query
        return res.status(200).json({ msg: "Done", page: apiFeatures.page, users })
    }
    catch (err) {
        next(err);
    }
};







const otpEmailContent = function (otp) {
    const content = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; 
                    box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto; text-align: center;">
            <h2 style="color: #333;">🔐 Your OTP Code</h2>
            <p style="color: #555;">Use the code below to complete your authentication process. This code is valid for a limited time.</p>
            
            <div style="font-size: 24px; font-weight: bold; color: #28a745; 
                        background: #f8f9fa; padding: 10px; display: inline-block; 
                        border-radius: 5px; margin: 20px 0;">
                ${otp}
            </div>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #777;">If you didn’t request this OTP, please ignore this email.</p>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                This is an automated message, please do not reply.
            </p>
        </div>
    </div>
    `;
    return content;
};

const htmlContent = function (link, rfLink) {
    const content = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); margin: auto; text-align: center;">
            <h2 style="color: #333;">🎉 Welcome to Our E-commerce Platform! 🎉</h2>
            <p style="color: #555;">Thank you for signing up! Please verify your email address to get started.</p>
            
            <a href="${link}" target="_blank" 
               style="display: inline-block; background: #28a745; color: white; padding: 10px 20px; 
               text-decoration: none; border-radius: 5px; font-size: 16px; margin: 20px 0;">
               ✅ Verify Email
            </a>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="color: #777;">Didn't receive the email? Click the button below to request a new verification email.</p>
            
            <a href="${rfLink}" target="_blank" 
               style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; 
               text-decoration: none; border-radius: 5px; font-size: 16px;">
               🔄 Resend Verification Email
            </a>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
                If you didn't sign up, you can safely ignore this email.
            </p>
        </div>
    </div>
    `;
    return content;
};




