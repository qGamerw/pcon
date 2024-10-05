import * as http from 'http';

// Определяем хост
const hostname: string = '127.0.0.1';

// Определяем порт
const port: number = 3000;

// Создаем HTTP-сервер. Функция, переданная в createServer, будет вызываться каждый раз
const server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
        // Устанавливаем статус ответа
        res.statusCode = 200;

        // Устанавливаем заголовок
        res.setHeader('Content-Type', 'text/plain');

        // Завершаем ответ
        res.end('Hello World\n');
    });

// Запускаем сервер, который будет прослушивать входящие запросы на заданном хосте и порту
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
