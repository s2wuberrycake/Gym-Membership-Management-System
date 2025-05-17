import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 7 * 1280 * 1280 },
  fileFilter: (req, file, cb) => {
    const ok = /\.(jpe?g|png)$/i.test(file.originalname)
    cb(ok ? null : new Error("Only .png, .jpg, .jpeg allowed"), ok)
  }
})
