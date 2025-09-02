import cors, { type CorsOptions } from 'cors';

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
]

const options: CorsOptions = {
  origin: allowedOrigins,
};

export default cors(options);