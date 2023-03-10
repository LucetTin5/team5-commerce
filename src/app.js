import cors from 'cors';
import express from 'express';
import {
  viewsRouter,
  userRouter,
  productRouter,
  categoryRouter,
  orderRouter,
  searchRouter,
  basketRouter,
  sendMailRouter,
} from './routers';
import { errorHandler } from './middlewares';
import morgan from 'morgan';
import { stream } from './utils/logger';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream }));
} else {
  app.use(morgan('dev')); // 개발환경이면
}
// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', orderRouter);
app.use('/api', searchRouter);
app.use('/api', basketRouter);
app.use('/api', sendMailRouter);
// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.get('/*', (_, res) => res.status(404).send(`
  <div>Not Found</div>
  <div>Back to <a href="/">Home</a></div>
`))
app.use(errorHandler);

export { app };
