<!-- prettier-ignore -->
# Node.js + Express.js + Typescript + Mongoose

Cтек (Node.js + Express.js + Typescript + Mongoose)

Валидация backend - express-validator

## Особенности

-   Подключены prettier и ESlint
-   Добавлены middleware для обработки общих ошибок от сервера.
-   Добавлены middleware для обработки методов логина и регистрации
-   Настройки вынесены в .env

---

## API

АПИ доступен по ссылке https://mevn-auth-back.onrender.com

### Регистрация

POST /signup
body {
    email,
    name,
    password
}

Response: Получаем токен пользователя

### Авторизация

POST /signin
body {
    email,
    password
}

Response: Получаем токен пользователя

### Инфо

GET /info
HEADER: authorization: Bearer <token>

Response: Получаем имя, логин, email пользователя

### Логаут

GET /logout
HEADER: authorization: Bearer <token>

Response: Получаем статус 200

### Список пользователей

POST /users
HEADER: authorization: Bearer <token>

Response: Получаем список пользователей

### Пинг

GET /ping

Response: Получаем статус 200

---
## Запуск и сборка проекта

### Установка зависимостей

`npm i`

### Запуск сервера

`npm run start`

### Запуск сервера в режиме разработки

`npm run dev:inspect`

Запуск build

`npm run build`

Запуск lint

`npm run lint`
