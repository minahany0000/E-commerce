import { model } from "mongoose"


export const deleteFromDb = async (req, res, next) => {
    if (req?.date) {
        const { model, _id } = req.data
        await model.deleteOne({_id})
    } 
}