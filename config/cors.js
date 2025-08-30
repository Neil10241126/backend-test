import cors from 'cors';

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
]

export default cors({
  origin: allowedOrigins,
})