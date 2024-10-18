import React, {Component} from 'react';
import SockJS from 'sockjs-client';
import {deleteNote, getAllNotes, sendNote, updateNote} from "./api/api";
import {Button, Card, Form, Input, Space, Table} from "antd";
import {AppState, Note, NoteRest} from "./type/InterfacesType";

class App extends Component<{}, AppState> {
    private socket: WebSocket | null = null;
    private intervalId: NodeJS.Timeout | null = null;

    state: AppState = {
        data: [],
        time: '',
        serverTime: '',
        newTitle: '',
        newText: '',
        id: ''
    };

    componentDidMount() {
        this.socket = new SockJS('http://127.0.0.1:9999/echo') as WebSocket;

        this.socket.onopen = () => {
            console.log('Соединение открыто');
            this.getAll();
        };

        this.socket.onmessage = this.onMessage;
        this.socket.onclose = () => {
            console.log('Соединение закрыто');
        };

        this.intervalId = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.socket) {
            this.socket.close();
        }
    }

    onMessage = (messageEvent: MessageEvent) => {
        if (messageEvent.data) {
            this.setState((prevState) => ({
                ...prevState,
                serverTime: messageEvent.data,
            }));
        }
    };

    // Обновляем локальное время
    tick = () => {
        this.setState((prevState) => ({
            ...prevState,
            time: new Date().toLocaleTimeString(),
        }));
    };

    // Метод для отправки новой заметки
    handleSendNote = async () => {
        try {
            const myNote: Note = {
                title: this.state.newTitle,
                body: this.state.newText,
            };
            await sendNote(myNote); // Отправляем заметку
            await this.getAll(); // Обновляем список заметок
            this.setState((prevState) => ({// Очищаем поля ввода
                ...prevState,
                newTitle: '',
                newText: '',
                id: ''
            }));
        } catch (err) {
            console.log('Ошибка при добавлении записи:', err);
        }
    };

    // Метод для удаления заметки
    handleDeleteNote = async () => {
        const {id} = this.state; // Получаем id
        if (!id) {
            console.log('ID заметки не указан');
            return;
        }
        try {
            await deleteNote(id); // Удаляем заметку
            await this.getAll(); // Обновляем список заметок
            this.setState((prevState) => ({// Очищаем поля ввода
                ...prevState,
                newTitle: '',
                newText: '',
                id: ''
            }));
        } catch (err) {
            console.log('Ошибка при удалении записи:', err);
        }
    };

    // Метод для обновления заметки
    handleUpdateNote = async () => {
        const {id, newTitle, newText} = this.state; // Получаем id, заголовок и текст
        if (!id) {
            console.log('ID заметки не указан');
            return;
        }
        try {
            await updateNote(id, {title: newTitle, body: newText}); // Обновляем заметку
            await this.getAll(); // Обновляем список заметок
            this.setState((prevState) => ({// Очищаем поля ввода
                ...prevState,
                newTitle: '',
                newText: '',
                id: ''
            }));
        } catch (err) {
            console.log('Ошибка при обновлении записи:', err);
        }
    };

    // Метод для получения всех заметок
    getAll = async () => {
        try {
            const res: NoteRest[] = await getAllNotes(); // Получаем заметки
            this.setState((prevState) => ({ // Обновляем состояние с новыми заметками
                ...prevState,
                data: res
            }));
        } catch (err) {
            console.log('Ошибка при получении данных:', err);
        }
    };

    handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => ({
            ...prevState,
            id: e.target.value,
        }));
    };

    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => ({
            ...prevState,
            newTitle: e.target.value,
        }));
    };

    handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((prevState) => ({
            ...prevState,
            newText: e.target.value,
        }));
    };

    render() {
        const columns = [
            {
                title: 'Id',
                dataIndex: '_id',
                key: '_id',
            },
            {
                title: 'Text',
                dataIndex: 'text',
                key: 'text',
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
        ];

        return (
            <Card
                title={'Hello, world!'}
                actions={[
                    <h1 key="time">Время: {this.state.time}</h1>,
                    <h1 key="serverTime">Серверное время: {this.state.serverTime}</h1>
                ]}
            >
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    rowKey="_id"
                />
                <Form layout="vertical">
                    <Form.Item label="Id">
                        <Input
                            value={this.state.id}
                            onChange={this.handleIdChange}
                            placeholder="Введите id"
                        />
                    </Form.Item>
                    <Form.Item label="Заголовок">
                        <Input
                            value={this.state.newTitle}
                            onChange={this.handleTitleChange}
                            placeholder="Введите заголовок"
                        />
                    </Form.Item>
                    <Form.Item label="Текст">
                        <Input
                            value={this.state.newText}
                            onChange={this.handleTextChange}
                            placeholder="Введите текст"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" onClick={this.handleSendNote}>
                                Добавить запись
                            </Button>
                            <Button type="primary" onClick={this.handleDeleteNote}>
                                Удалить запись
                            </Button>
                            <Button type="primary" onClick={this.handleUpdateNote}>
                                Обновить запись
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default App;
