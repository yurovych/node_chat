/* eslint-disable no-console */
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { userRouter } from './routers/userRouter.js';

const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_HOST || 'http://localhost:7071',
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(userRouter);

  app.use((req, res, next) => {
    res.status(404).send({ message: 'Page Not Found' });
  });

  return app;
};

const PORT = process.env.PORT || 7070;

createServer().listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
