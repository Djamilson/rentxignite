import 'reflect-metadata';
import 'dotenv/config';

import 'express-async-errors';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import '@shared/container';
import '@shared/infra/typeorm';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

// import rateLimiter from './middlewares/rateLimiter';

import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadsFolder));
// analisa as conexões por IP
// app.use(rateLimiter);

app.use(routes);

app.use(errors());

// tratar os erros
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  // console.log(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3335, () => {
  console.log('Inicializou o server, port 3335!');
});
