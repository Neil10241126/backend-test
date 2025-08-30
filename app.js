import express from 'express';
import userRouter from './routers/users.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggar.js';
import cors from './config/cors.js';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json())
app.use(cors)

app.use('/api/v1/users', userRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})