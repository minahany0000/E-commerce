import jwt from 'jsonwebtoken'
import appError from '../utils/appError.js'
import asyncHandler from '../utils/asyncHandler.js'
import userModel from '../../db/models/user.model.js'
const auth = (allowedRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers
        if (!token || !token.startsWith(process.env.TOKEN_PREFIX)) {
            return next(new appError("No valid token found", 401))
        }
        const newToken = token.split(process.env.TOKEN_PREFIX)[1]
        if (!newToken) {
            return next(new appError("No valid token found", 401))
        }
        const decoded = jwt.verify(newToken, process.env.TOKEN_SIGN_SECRET)
        if (!decoded?.email) {
            return next(new appError("No valid token found", 401))
        }
        const user = await userModel.findOne({ email: decoded.email })
        if (!user) {
            return next(new appError("User not exist or logged out", 404))
        }
        if (user.passwordChangedAt && parseInt(user.passwordChangedAt.getTime() / 1000) > decoded.iat) {
            return res.status(403).json({ msg: "Token expired, log in again" });
        }

        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            return next(new appError("Unauthorized: You do not have permission", 403));
        }

        req.user = user
        next()
    })
}
export default auth