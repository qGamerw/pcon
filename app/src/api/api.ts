import axios, { AxiosResponse } from 'axios';
import { Note, NoteRest } from "../type/InterfacesType";

// Функция для получения всех заметок
export const getAllNotes = async (): Promise<NoteRest[]> => {
    try {
        return (await axios.get('http://localhost:8000/notes/all')).data;
    } catch (error) {
        console.error('Ошибка при получении заметок:', error);
        return [];
    }
}

// Функция для отправки новой заметки
export const sendNote = (note: Note): Promise<AxiosResponse> => {
    return axios.post('http://localhost:8000/notes/add', {
        title: note.title,
        body: note.body
    });
}

// Функция для удаления заметки по ID
export const deleteNote = (id: string): Promise<AxiosResponse> => {
    return axios.delete(`http://localhost:8000/notes/delete/${id}`);
}

// Функция для обновления существующей заметки
export const updateNote = (id: string, note: Note): Promise<AxiosResponse> => {
    return axios.put(`http://localhost:8000/notes/update/${id}`, {
        title: note.title,
        body: note.body
    });
}
