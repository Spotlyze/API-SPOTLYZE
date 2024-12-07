const {
  findUserById,
  updateUserById,
  deleteUserById,
} = require("../models/userModel");

const getProfile = async (req, res) => {
  try {
    id = req.params.id;
    const history = await findUserById(id);
    if (!history) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};
 /*
const updateUserHandler = async (req, res) => {
  try {
    const user_id = req.params.id; // Ambil parameter id dari request
    const updateData = req.body; // Ambil data yang akan diupdate dari request body

    // Pastikan data untuk update tidak kosong
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    if (req.file) {
      const folderName = "profile-picture"; // Tentukan folder
      const fileName = `${folderName}/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.png`;
      const blob = bucket.file(fileName);
      const publicUrl = ``;
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

      blobStream.on("finish", () => {
        publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      });

      blobStream.end(req.file.buffer);
    }

    // Panggil fungsi untuk mengupdate data di database
    const result = await updateUserById(user_id, updateData);

    // Jika data tidak ditemukan, kirim response 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Response berhasil
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};
*/
const updateUserHandler = async (req, res) => {
  try {
    const user_id = req.params.id;
    const updateData = req.body;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const oldUserData = await findUserById(user_id);

    if (!oldUserData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const folderName = "profile-picture";
      const fileName = `${folderName}/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.png`;
      const blob = bucket.file(fileName);
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      if (oldUserData.profile_picture) {
        const oldFileName = oldUserData.profile_picture.split(
          `https://storage.googleapis.com/${bucket.name}/`
        )[1]; // Ekstrak nama file lama
        if (oldFileName) {
          await bucket.file(oldFileName).delete().catch((err) => {
            console.warn("Failed to delete old file:", err.message);
          });
        }
      }

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype, 
        },
      });

      blobStream.on("error", (err) => {
        console.error("Blob stream error:", err);
        return res
          .status(500)
          .json({ message: "Failed to upload file!", error: err.message });
      });

      await new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          updateData.profile_picture = publicUrl;
          resolve();
        });
        blobStream.on("error", reject);
        blobStream.end(req.file.buffer);
      });
    }

    const result = await updateUserById(user_id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};


const deleteUserHandler = async (req, res) => {
  try {
    const id = req.params.id; // Ambil parameter id dari request

    // Panggil fungsi untuk menghapus data di database
    const result = await deleteUserById(id);

    // Jika data tidak ditemukan, kirim response 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Response berhasil
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { getProfile, updateUserHandler, deleteUserHandler };
