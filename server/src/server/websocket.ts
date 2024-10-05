import http from 'http';
import sockjs from 'sockjs';

// WebSocket-соединения будут обрабатываться через маршрут '/echo'
const echo = sockjs.createServer({prefix: '/echo'});

// Устанавливаем обработчик для событий подключения
echo.on('connection', (conn: sockjs.Connection) => {
    // Настраиваем таймер, который каждую секунду отправляет текущее время клиенту
    const timer = setInterval(() => {
        conn.write(new Date().toLocaleTimeString()); // Отправляем текущее время клиенту
    }, 1000);

    // Обработчик события, когда сервер получает сообщение от клиента
    conn.on('data', (message: string) => {
        // Выводим полученное сообщение в консоль
        console.log(message);
    });

    // Обработчик событие при закрытии соединения
    conn.on('close', () => {
        // Останавливаем таймер, когда соединение закрывается
        clearInterval(timer);
    });
});

// Создаём HTTP-сервер
const server = http.createServer();

// Устанавливаем SockJS-сервер как обработчик маршрута '/echo' на HTTP-сервере
echo.installHandlers(server, {prefix: '/echo'});

// Запускаем HTTP-сервер, который начинает прослушивать соединения на порту 9999
server.listen(9999, '0.0.0.0', () => {
    console.log('Server is listening on port 9999');
});
