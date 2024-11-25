require("dotenv").config();

const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID, // Ganti dengan ID proyek Google Cloud Anda
});
const bucketName = process.env.GOOGLE_STORAGE_BUCKET; // Ganti dengan nama bucket Anda
const bucket = storage.bucket(bucketName);

module.exports = { bucket };