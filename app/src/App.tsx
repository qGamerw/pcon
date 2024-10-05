import React, {Component} from 'react';
import SockJS from 'sockjs-client';

// Определяем интерфейс для состояния компонента
interface AppState {
    time: string;
    serverTime: string;
}

// URL для WebSocket-соединения с сервером
const URL: string = 'http://127.0.0.1:9999/echo';
// Создаем соединение через SockJS с сервером
let SOCKET: WebSocket = new SockJS(URL);

class App extends Component<{}, AppState> {
    state: AppState = {
        time: new Date().toLocaleTimeString(),
        serverTime: 'нет данных',
    };

    // Объявляем переменную для хранения WebSocket-соединения

    componentDidMount() {
        // Устанавливаем обработчик для события открытия соединения
        SOCKET.onopen = () => {
            console.log('open');
            // Если соединение успешно установлено, отправляем сообщение на сервер
            if (SOCKET) {
                SOCKET.send('socket opened');
            }
        };

        // Устанавливаем обработчик для получения сообщений от сервера
        SOCKET.onmessage = this.onMessage.bind(this);

        // Устанавливаем обработчик для закрытия соединения
        SOCKET.onclose = () => {
            console.log('close');
        };

        setInterval(this.tick, 1000);
    }

    // Обработчик для получения сообщений от сервера
    onMessage = (messageEvent: MessageEvent) => {
        if (messageEvent.data) {
            this.setState({
                serverTime: messageEvent.data, // Обновляем serverTime значением, полученным от сервера
            });
        }
    };

    // Функция для обновления текущего времени каждую секунду
    tick = () => {
        this.setState({
            time: new Date().toLocaleTimeString(), // Обновляем локальное время в состоянии
        });
    };

    render() {
        const {time, serverTime} = this.state;

        return (
            <div>
                <h1>Время: {time}</h1>
                <h1>Серверное время: {serverTime}</h1>
            </div>
        );
    }
}

export default App;
