import { Application, Request, Response } from 'express'; // Импорт необходимых типов из express
import { Db, Document, ObjectId } from 'mongodb'; // Импорт типов из mongodb

// Описание структуры заметки (Note) с двумя полями: текст и заголовок
interface Note {
    text: string; // Текст заметки
    title: string; // Заголовок заметки
}

// Экспорт функции, принимающей приложение Express и подключение к базе данных MongoDB
export default function (app: Application, db: Db) {
    // Маршрут для добавления новой заметки
    app.post('/notes/add', async (req: Request, res: Response) => {
        // Создание объекта заметки на основе данных из тела запроса
        const note: Note = {
            text: req.body.body, // Извлечение текста заметки
            title: req.body.title // Извлечение заголовка заметки
        };

        try {
            // Вставка новой заметки в коллекцию 'notes'
            const result = await db.collection('notes').insertOne(note);
            console.log('POST: add', note); // Логирование добавленной заметки
            // Отправка успешного ответа с ID вставленной заметки
            res.status(200).send({
                insertedId: result.insertedId, // ID вставленной заметки
                ...note // Остальные данные заметки
            });
        } catch (err) {
            // Логирование ошибки
            console.log('ERROR', err);
            // Отправка сообщения об ошибке
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для получения всех заметок
    app.get('/notes/all', async (req: Request, res: Response) => {
        try {
            // Извлечение всех заметок из коллекции 'notes'
            const result: Document[] = await db.collection('notes').find({}).toArray();
            console.log('GET: all:', result); // Логирование полученных заметок
            // Отправка всех заметок в ответе
            res.status(200).send(result);
        } catch (err) {
            // Логирование ошибки
            console.log('An error has occurred', err);
            // Отправка сообщения об ошибке
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для удаления заметки по ID
    app.delete('/notes/delete/:id', async (req: Request, res: Response) => {
        const noteId = req.params.id; // Извлечение ID заметки из параметров запроса

        try {
            // Удаление заметки с указанным ID из коллекции 'notes'
            const result = await db.collection('notes').deleteOne({ _id: new ObjectId(noteId) });

            if (result.deletedCount === 1) {
                // Логирование успешного удаления
                console.log(`Note with ID ${noteId} deleted`);
                // Отправка сообщения об успешном удалении
                res.status(200).send({ message: 'Note deleted successfully' });
            } else {
                // Отправка сообщения об ошибке, если заметка не найдена
                res.status(404).send({ error: 'Note not found' });
            }
        } catch (err) {
            // Логирование ошибки
            console.log('An error has occurred', err);
            // Отправка сообщения об ошибке
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для изменения заметки по ID
    app.put('/notes/update/:id', async (req: Request, res: Response) => {
        const noteId = req.params.id; // Извлечение ID заметки из параметров запроса
        const updatedNote: Partial<Note> = {
            text: req.body.body, // Извлечение текста для обновления
            title: req.body.title // Извлечение заголовка для обновления
        };

        try {
            // Обновление заметки с указанным ID
            const result = await db.collection('notes').updateOne(
                { _id: new ObjectId(noteId) }, // Условие для поиска заметки
                { $set: updatedNote } // Обновление полей заметки
            );

            if (result.matchedCount === 1) {
                // Логирование успешного обновления
                console.log(`Note with ID ${noteId} updated`);
                // Отправка сообщения об успешном обновлении
                res.status(200).send({ message: 'Note updated successfully' });
            } else {
                // Отправка сообщения об ошибке, если заметка не найдена
                res.status(404).send({ error: 'Note not found' });
            }
        } catch (err) {
            // Логирование ошибки
            console.log('An error has occurred', err);
            // Отправка сообщения об ошибке
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });
}
