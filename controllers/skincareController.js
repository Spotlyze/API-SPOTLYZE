const {
  findSkincareByName,
  createSkincare,
  getAllSkincare,
  findSkincareFavoriteById,
  createFavorite,
  updateSkincareById,
  deleteSkincareById,
  getAllFavorite,
} = require("../models/skincareModel");

const addSkincare = async (req, res) => {
  const { name, ingredients, price, explanation } = req.body;

  console.log(req.body);

  if (!name || !ingredients || !price || !explanation) {
    return res.status(400).json({
      message:
        "Name, ingredients, price, and explaination about the product are required",
    });
  }

  try {
    const existingSkincare = await findSkincareByName(name);
    if (existingSkincare) {
      return res.status(409).json({ message: "Skincare is already exists" });
    }

    const skincareId = await createSkincare(
      name,
      ingredients,
      price,
      explanation
    );

    res
      .status(201)
      .json({ message: "Skincare added successfully", skincareId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSkincareHandler = async (req, res) => {
  try {
    const skincares = await getAllSkincare();
    res.status(200).json(skincares);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve skincare" });
  }
};

const updateSkincareHandler = async (req, res) => {
  try {
    const skincare_id = req.params.id; // Ambil parameter id dari request
    const updateData = req.body; // Ambil data yang akan diupdate dari request body

    // Pastikan data untuk update tidak kosong
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Panggil fungsi untuk mengupdate data di database
    const result = await updateSkincareById(skincare_id, updateData);

    // Jika data tidak ditemukan, kirim response 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skincare not found" });
    }

    // Response berhasil
    res.status(200).json({ message: "Skincare updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update Skincare" });
  }
};

const deleteSkincareHandler = async (req, res) => {
  try {
    const skincaer_id = req.params.id; // Ambil parameter id dari request

    // Panggil fungsi untuk menghapus data di database
    const result = await deleteSkincareById(skincaer_id);

    // Jika data tidak ditemukan, kirim response 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skincare not found" });
    }

    // Response berhasil
    res.status(200).json({ message: "Skincare deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete Skincare" });
  }
};

const addSkincareFavorite = async (req, res) => {
  const { user_id, skincare_id } = req.body;

  console.log(req.body);

  if (!user_id || !skincare_id) {
    return res.status(400).json({
      message: "user_id, skincare_id are required",
    });
  }

  try {
    const existingFavorite = await findSkincareFavoriteById(
      user_id,
      skincare_id
    );
    if (existingFavorite) {
      return res.status(409).json({ message: "Favorite is already exists" });
    }

    const favoriteId = await createFavorite(user_id, skincare_id);

    res
      .status(201)
      .json({ message: "Favorite added successfully", favoriteId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFavoriteHandler = async (req, res) => {
  try {
    id = req.params.id;
    const favorite = await getAllFavorite(id);
    res.status(200).json(favorite);
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve favorite" });
  }
};

module.exports = {
  addSkincare,
  getAllSkincareHandler,
  addSkincareFavorite,
  updateSkincareHandler,
  deleteSkincareHandler,
  getAllFavoriteHandler,
};
