import multer from "multer"
import path from "path"
import os from "os"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir())
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