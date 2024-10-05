import { Express, Request, Response } from 'express';
import noteRoutes from './routes';

// Функция для инициализации маршрутов
export default function initializeRoutes(app: Express, db: any) {
    // Вызываем функцию noteRoutes, передавая ей объект приложения и базу данных
    noteRoutes(app, db);
}
