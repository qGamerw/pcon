import { Application, Request, Response } from 'express';
import { Db, Document, ObjectId } from 'mongodb';
import cors from 'cors';
import {Note} from "../type/InterfacesType";

// Экспорт функции, принимающей приложение Express и подключение к базе данных MongoDB
export default function (app: Application, db: Db) {
    app.use(cors());

    // Маршрут для добавления новой заметки
    app.post('/notes/add', async (req: Request, res: Response) => {
        const note: Note = {
            text: req.body.body,
            title: req.body.title
        };

        try {
            const result = await db.collection('notes').insertOne(note);
            console.log('POST: add', note);

            res.status(200).send({
                insertedId: result.insertedId,
                ...note
            });
        } catch (err) {
            console.log('ERROR', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для получения всех заметок
    app.get('/notes/all', async (req: Request, res: Response) => {
        try {
            const result: Document[] = await db.collection('notes').find({}).toArray();
            console.log('GET: all:', result);
            res.status(200).send(result);
        } catch (err) {
            console.log('An error has occurred', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для удаления заметки по ID
    app.delete('/notes/delete/:id', async (req: Request, res: Response) => {
        const noteId = req.params.id;

        try {
            const result = await db.collection('notes').deleteOne({ _id: new ObjectId(noteId) });

            if (result.deletedCount === 1) {
                console.log(`Note with ID ${noteId} deleted`);
                res.status(200).send({ message: 'Note deleted successfully' });
            } else {
                res.status(404).send({ error: 'Note not found' });
            }
        } catch (err) {
            console.log('An error has occurred', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });

    // Маршрут для изменения заметки по ID
    app.put('/notes/update/:id', async (req: Request, res: Response) => {
        const noteId = req.params.id;
        const updatedNote: Partial<Note> = {
            text: req.body.body,
            title: req.body.title
        };

        try {
            const result = await db.collection('notes').updateOne(
                { _id: new ObjectId(noteId) }, // Условие для поиска заметки
                { $set: updatedNote } // Обновление полей заметки
            );

            if (result.matchedCount === 1) {
                console.log(`Note with ID ${noteId} updated`);
                res.status(200).send({ message: 'Note updated successfully' });
            } else {
                res.status(404).send({ error: 'Note not found' });
            }
        } catch (err) {
            console.log('An error has occurred', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    });
}
