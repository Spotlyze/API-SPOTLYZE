const {
  findHistoryByUser,
  findHistoryById,
  createHistory,
  getAllHistory,
} = require("../models/historyModel");

const { findSkincareByName } = require("../models/skincareModel");

const { bucket } = require("../models/bucketStorage");
const formData = require("form-data");
const axios = require("axios");

const addHistory = async (req, res) => {
  // Validasi input
  const { user_id, skin_type, skin_sensitivity, concerns } = req.body;

  if (!user_id || !skin_type || !skin_sensitivity || !concerns) {
    return res.status(400).json({
      message:
        "User_id, skin_type, skin_sensitivity, and concerns are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  try {
    const form = new formData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Mengirim permintaan POST ke API Flask
    const result = await axios.post("http://localhost:5000/predict", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const skinData = {
      skin_type,
      skin_sensitivity,
      concerns,
    };

    const productResponse = await axios.post(
      "http://localhost:3000",
      skinData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // const productsByCategory = productResponse.data;
    // const allProductNames = [];
    // Object.values(productsByCategory).forEach((products) => {
    //   products.forEach(async (product) => {
    //     let idSkincare = await findSkincareByName(product.product_name);
    //     allProductNames.push(idSkincare[0]?.skincare_id);
    //   });
    // });

    const allProductNames = await Promise.all(
      Object.values(productsByCategory).flatMap((products) =>
        products.map(async (product) => {
          try {
            const idSkincare = await findSkincareByName(product.product_name);
            console.log("ID Skincare:", idSkincare);
            return idSkincare[0].skincare_id; // Ambil skincare_id jika ditemukan
          } catch (error) {
            console.error("Error finding skincare:", error.message);
            return null; // Pastikan untuk mengembalikan nilai default jika terjadi kesalahan
          }
        })
      )
    );

    // Filter undefined atau null
    const validProductIds = allProductNames.filter(
      (id) => id !== null && id !== undefined
    );

    console.log("All Product Names:", validProductIds);

    console.log("All Product Names:", allProductNames);

    // Generate file name and upload to bucket
    const folderName = "history-picture";
    const fileName = `${folderName}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;

    const blob = bucket.file(fileName);
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error("Blob stream error:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload file!", error: err.message });
    });

    blobStream.on("finish", async () => {
      // Create history record after successful file upload
      try {
        const historyId = await createHistory(
          user_id,
          result.data.predicted_class,
          allProductNames.join(", "),
          publicUrl
        );
        res
          .status(201)
          .json({ message: "History added successfully", historyId });
      } catch (dbError) {
        console.error("Error creating history record:", dbError);
        res.status(500).json({
          message: "Failed to create history record",
          error: dbError.message,
        });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error("Error during prediction or upload:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getAllHistoryHandler = async (req, res) => {
  try {
    const history = await getAllHistory();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getByUser = async (req, res) => {
  try {
    id = req.params.id;
    const history = await findHistoryByUser(id);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getByid = async (req, res) => {
  try {
    id = req.params.id;
    const history = await findHistoryById(id);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

module.exports = { getAllHistoryHandler, addHistory, getByUser, getByid };
