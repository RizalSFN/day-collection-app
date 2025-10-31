import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (!file || !file.originalname) {
        return cb(new Error("No file provided"), false);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowed.includes(ext)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

export const upload = multer({ storage, fileFilter })