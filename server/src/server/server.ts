import express, { NextFunction, Request, Response } from 'express';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
const port = 8000;
const uri = "mongodb+srv://faleot724:BlvvIyRfU5YWn1BE@cluster0.mf9xf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'Test'; // Название базы данных

// Некоторые настройки безопасности
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Установка заголовка CORS
    next();
});

// Используем body-parser для обработки данных из тела запроса
app.use(bodyParser.urlencoded({ extended: true })); // Обработка URL-кодированных данных
app.use(bodyParser.json()); // Обработка JSON-данных

(async function () {
    let client: MongoClient; // клиент MongoDB

    try {
        // Опции для подключения к MongoDB
        const options: MongoClientOptions = {};

        // Подключение к MongoDB с использованием указанного URI и опций
        client = await MongoClient.connect(uri, options);
        console.log("Connected correctly to server");

        const db: Db = client.db(dbName);
        // Импортируем маршруты из файла '../route'
        const routes = await import('../route');
        routes.default(app, db); // Вызов маршрутов, передавая экземпляр приложения и подключение к базе данных

        // Запуск сервера
        app.listen(port, () => {
            console.log('We are live on ' + port); // Логирование информации о запущенном сервере
        });
    } catch (err) {
        console.log(err); // Логирование ошибок, возникающих при подключении к базе данных
    }
})();
