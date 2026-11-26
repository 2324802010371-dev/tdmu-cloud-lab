
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');

// Chống NoSQL Injection
mongoose.set('sanitizeFilter', true);

const app = express();

// Cấu hình proxy
app.set('trust proxy', 1);

// Bổ sung HTTP Security Headers
app.use(helmet());

// Giới hạn kích thước JSON
app.use(express.json({ limit: '100kb' }));

// Giới hạn 20 yêu cầu trong 15 phút
app.use(
  '/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20
  }),
  authRouter
);

// Trang chủ API
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Cloud API',
    status: 'running'
  });
});

// API quản lý ghi chú
app.use('/notes', notesRouter);

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err);

  const clientError =
    ['ValidationError', 'CastError'].includes(err.name) ||
    err.code === 'LIMIT_FILE_SIZE';

  res.status(clientError ? 400 : 500).json({
    error: clientError
      ? err.message
      : 'Lỗi máy chủ'
  });
});

module.exports = app;
