const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}
export const globalErrorHandling = (error, req, res, next) => {

    res.status(error.statusCode || 500).json({ msg: "error", error: error.message })
    next()

}

export default asyncHandler