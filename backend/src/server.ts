// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

 
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import registrationRoutes from './routes/registration.routes';
import usersRoutes from './routes/users.routes';
import suppliersRoutes from './routes/suppliers.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http:localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/dashboard', dashboardRoutes);





app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  }
);

 
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http:localhost:${PORT}/health`);
});
