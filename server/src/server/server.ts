import express, { Express } from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import createRoutes from '../route';

const app: Express = express();
const port: number = 8000;

// Middleware для обработки JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Инициализируем маршруты
createRoutes(app, {});

// Запускаем сервер
app.listen(port, () => {
    console.log(`We are live on ${port}`);
});
