import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalName))
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/
        const extname = allowed.test(path.extname(file.originalName).toLowerCase())
        const mimetype = allowed.test(file.mimetype)

        if (extname && mimetype) return cb(null, true)
        cb("Error: Only images are allowed!")
    }
})

export default upload