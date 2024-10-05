import { Express, Request, Response } from 'express';
import { Db } from 'mongodb';

// Функция для обработки маршрута создания заметки
function createNoteRoutes(app: Express, db: Db): void {
    // Определяем POST-маршрут для создания заметки
    app.post('/notes', (req: Request, res: Response) => {
        console.log(req.body)
        res.send('Hello');
    });
}

export default createNoteRoutes;
