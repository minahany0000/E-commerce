import mongoose from "mongoose";



const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            select: false,
        },
        age: {
            type: Number,
            required: [true, "age is required"],
            min: [12, "Age must be at least 12 year"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
        },
        address: {
            street: { type: String, minlength: 3, maxlength: 100 },
            city: { type: String, minlength: 2, maxlength: 50 },
            state: { type: String, minlength: 2, maxlength: 50 },
        },
        loggedIn: {
            type: Boolean,
            default: false,
        },
        OTP: {
            type: String,
            default: "",
            select: false,
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
