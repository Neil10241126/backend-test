const express = require('express');
const app = express();
const userRouter = require('./routers/users');

app.use(express.json())

app.use('/api/users', userRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})