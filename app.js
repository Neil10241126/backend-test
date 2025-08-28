const express = require('express');
const app = express();
const userRouter = require('./routers/users');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggar');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())

app.use('/api/v1/users', userRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})