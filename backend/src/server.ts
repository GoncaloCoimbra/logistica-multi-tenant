import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path'; 

// Importar todas as rotas
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import registrationRoutes from './routes/registration.routes';
import usersRoutes from './routes/users.routes';
import suppliersRoutes from './routes/suppliers.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationsRoutes from './routes/notifications.routes';
import transportsRoutes from './routes/transports.routes';  
import vehiclesRoutes from './routes/vehicles.routes';
import companyRoutes from './routes/company.routes';
import auditlogRoutes from './routes/auditlog.routes'; 
import superAdminRoutes from './routes/superadmin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ROTAS DA API =====
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/transports', transportsRoutes);  
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/auditlog', auditlogRoutes); 
app.use('/api/superadmin', superAdminRoutes);

// Error handler
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`); 
  console.log(`📋 Routes registered:`);
  console.log(`   - /api/auth`);
  console.log(`   - /api/registration`);
  console.log(`   - /api/products`);
  console.log(`   - /api/users`);
  console.log(`   - /api/suppliers`);
  console.log(`   - /api/transports`);
  console.log(`   - /api/vehicles`);
  console.log(`   - /api/dashboard`);
  console.log(`   - /api/notifications`);
  console.log(`   - /api/company`);
  console.log(`   - /api/auditlog`); 
  console.log(`   - /api/superadmin`);
});