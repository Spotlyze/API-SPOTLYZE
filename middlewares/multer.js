const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // Simpan di memori sementara
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg and .png files are allowed!"));
    }
  },
});

module.exports = upload;
