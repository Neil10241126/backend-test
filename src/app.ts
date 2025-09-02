import express from 'express';
import authRouter from './routers/auth.ts';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.ts';
import cors from './config/cors.ts';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json())
app.use(cors)

app.use('/api/v1/auth', authRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})