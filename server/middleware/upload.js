// server/middleware/upload.js
import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },            // 5 MB max
  fileFilter: (req, file, cb) => {
    const ok = /\.(jpe?g|png)$/i.test(file.originalname)
    cb(ok ? null : new Error("Only .png, .jpg, .jpeg allowed"), ok)
  }
})
