from flask import Flask, request, jsonify
import numpy as np
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load the processed dataset and one-hot encoded features
df2 = pd.read_csv('./skincare_dataset_fix.csv')
with open('recommendation_model.pkl', 'rb') as f:
    file_data = pickle.load(f)
    
print(df2.head())
print(df2.dtypes)

one_hot_encodings = file_data['one_hot_encodings']

if not isinstance(one_hot_encodings, np.ndarray):
    raise ValueError("The 'one_hot_encodings' key does not contain a numpy array.")

print(f"Shape of one_hot_encodings: {one_hot_encodings.shape}")

# Define features
define_features = ['all skin types', 'normal skin', 'dry skin', 'oily', 'combination', 'acne', 'sensitive', 'wrinkles',
                   'dark circle', 'skin brightness', 'uneven skin texture', 'skin dullness', 'hydration and nourishment', 'general care']

def name2index(name):
    return df2[df2["product_name"] == name].index.tolist()[0]

def wrap(info_arr):
    result = {
        'product_name': info_arr[0],
        'product_brand': info_arr[1],
        'price': info_arr[5],
        'skin_type': info_arr[3],
        'product_image_url': info_arr[6],
        'ingredients': info_arr[2]
    }
    return result

def recs_cs(vector=None, product_name=None, category=None, count=8):
    products = []
    if product_name:
        idx = name2index(product_name)
        fv = one_hot_encodings[idx]
    elif vector is not None:
        fv = vector
    else:
        return []

    cs_values = cosine_similarity(np.array([fv]), one_hot_encodings)
    df2['cs'] = cs_values[0]

    if category:
        dff = df2[df2['category'] == category]
    else:
        dff = df2

    if product_name:
        dff = dff[dff['product_name'] != product_name]

    recommendations = dff.sort_values('cs', ascending=False).head(count)
    data = recommendations[['product_name', 'product_brand', 'ingredients', 'skin_type', 'concern', 'price', 'product_image_url']].to_dict('split')['data']
    
    for element in data:
        products.append(wrap(element))
    return products

def recs_essentials(vector=None, product_name=None):
    response = {}
    LABELS = df2['category'].unique()
    for label in LABELS:
        if product_name:
            r = recs_cs(None, product_name, label)
        elif vector:
            r = recs_cs(vector, None, label)
        response[label] = r
    return response

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid input, please provide JSON data."}), 400

        # Extract input fields
        skin_type = data.get('skin_type', '').lower()
        skin_sensitivity = data.get('skin_sensitivity', '').lower()
        concerns = data.get('concerns', '').lower()

        if not skin_type and not concerns:
            return jsonify({"error": "'skin_type' and 'concerns' must be provided."}), 400

        # Generate feature vector
        vector = [0] * len(define_features)

        # Map skin_type to vector
        if skin_type in define_features[:5]:
            vector[define_features.index(skin_type)] = 1

        # Map skin_sensitivity to vector
        if skin_sensitivity == 'sensitive':
            vector[define_features.index('sensitive')] = 1

        # Map concerns to vector
        for concern in concerns.split(','):
            concern = concern.strip()
            if concern in define_features:
                vector[define_features.index(concern)] = 1

        # Get recommendations
        recommendations = recs_essentials(vector, None)
        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)