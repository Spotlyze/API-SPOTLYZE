# API-Spotlyze

## How to use

1. Install all depedency for the node with NPM
 	```shell
    npm install
    ```
2. Make the `.env`
    ```txt
    DB_HOST=database-host
    DB_USER=database-user
    DB_PASSWORD=database-password
    DB_NAME=name-database
    PORT=API-port
    GOOGLE_STORAGE_BUCKET=bucket-name
    GOOGLE_PROJECT_ID=project-name
    ```
3. Make the storage bucket public and add the link to the `.env`
4. Run API using 
    ```shell
    npm run start
    ```
5. Download [predict-model](https://github.com/Spotlyze/Machine-Learning/raw/refs/heads/main/model_transfer_learning_VGG16.h5) and [recommendation-model](https://github.com/Spotlyze/Machine-Learning/raw/refs/heads/main/recommendation_model_ver1.pkl)
6. Copy the model into `predict` folder
7. Run the code in `predict` folder
    ```shell
    python app.py
    ```
    and
    ```shell
    python recomendation.py
    ```
8. The API is ready to serve