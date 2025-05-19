import multer from "multer"

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 7 * 1280 * 1280
  },
  fileFilter: (req, file, cb) => {
    const isValid = /\.(jpe?g|png)$/i.test(file.originalname)
    if (isValid) {
      cb(null, true)
    } else {
      cb(new Error("Only .png, .jpg, .jpeg allowed"), false)
    }
  }
})
