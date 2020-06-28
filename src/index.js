// Import .env file
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan');
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
// Для того, чтоб не выкидывало из сессии, когда сохраняется файлы на сервере
// Стоять должа ниже session пакета
const MongoStore = require('connect-mongo')(session);


// Passport config
require('./config/passport')(passport);

// MongoDB
require('./db/db');

// Импорт маршрутов
const router = require('./router/router');
const routerAuth = require('./router/auth');
const routerAddStory = require('./router/stories')

const app = express();

// Логирование при разработке
// Показывает статусы, запросы, время запроса
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Папка с статическими файлами
app.use(express.static(path.join(__dirname, './public')));

// Парсим ссылки
app.use(express.urlencoded({ extended: true }));

// Парсим входящие данные
app.use(express.json());

// Перезаписываем метод POST в шаблонах 
// на PUT/DELETE/UPDATE в маршрутах
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Шаблонизатор
app.set('view engine', 'ejs');
app.set('views', './src/view');

// Сессии авторизации
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Маршрутизаторы
app.use('/', router);
app.use('/auth', routerAuth);
app.use('/stories', routerAddStory);

// Слушаем портсервера
app.listen(process.env.PORT, () => console.log(' Server running! '));
