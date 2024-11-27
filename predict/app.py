from flask import Flask, request, jsonify
from flask import send_from_directory
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Load model .h5
model_path = 'model_transfer_learning.h5'  # Ganti dengan path model Anda
model = load_model(model_path)

# Daftar label kelas
classes = ['dark circle', 'acne', 'wrinkle']

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        print("No image found in request")
        return jsonify({'error': 'File gambar tidak ditemukan'}), 400

    image_file = request.files['image']
    try:
        image = Image.open(image_file)
        image = image.resize((150, 150))
        image_array = np.array(image) / 255.0
        input_data = np.expand_dims(image_array, axis=0)
        predictions = model.predict(input_data)
        predicted_class_index = np.argmax(predictions)
        classes = ['dark circle', 'acne', 'wrinkle']
        predicted_class = classes[predicted_class_index]
        response = {
            'predicted_class': predicted_class,
            'confidence': float(predictions[0][predicted_class_index])
        }
        return jsonify(response)
    except Exception as e:
        print("Error processing image:", e)
        return jsonify({'error': 'Error processing image'}), 500

if __name__ == '__main__':
    app.run(debug=True)
