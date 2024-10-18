// Интерфейс для состояния приложения
export interface AppState {
    time: string; // Локальное время
    serverTime: string; // Время сервера
    data: NoteRest[]; // Массив заметок
    newTitle: string; // Заголовок заметки
    newText: string; // Текст заметки
    id: string; // ID заметки
}

// Интерфейс для заметки
export interface Note {
    title: string;
    body: string;
}

// Интерфейс для заметок, получаемых с сервера
export interface NoteRest {
    _id: string;
    text: string;
    title: string;
}
