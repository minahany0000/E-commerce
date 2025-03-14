import multer from "multer";
import appError from "../utils/appError.js";

export const validExtensions = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff", "image/svg+xml"],
    video: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/x-flv", "video/x-ms-wmv", "video/webm"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/flac", "audio/x-m4a"],
    document: [
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain", "application/pdf", "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv", "application/rtf", "application/vnd.oasis.opendocument.text"
    ],
    archive: ["application/zip", "application/x-rar-compressed", "application/x-tar", "application/gzip", "application/x-7z-compressed"],
    code: ["text/html", "text/css", "application/javascript", "text/javascript", "application/json", "application/xml", "text/csv", "application/x-yaml", "text/markdown"]
};

export const multerHost = (customValidation) => {

    const storage = multer.diskStorage({});
    const fileFilter = function (req, file, cb) {

        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        else cb(new appError("file is not supported"), false)

    }
    const upload = multer({ storage, fileFilter })
    return upload
}
