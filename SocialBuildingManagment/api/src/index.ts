import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimit.js';
import { ensureBucket } from './services/storage.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import uploadsRouter from './routes/uploads.js';
import postsRouter from './routes/posts.js';
import recommendationsRouter from './routes/recommendations.js';
import entrepreneursRouter from './routes/entrepreneurs.js';
import reportsRouter from './routes/reports.js';
import blocksRouter from './routes/blocks.js';
import adminRouter from './routes/admin.js';
import { startExpirePostsJob } from './jobs/expirePosts.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(generalLimiter);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/uploads', uploadsRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/recommendations', recommendationsRouter);
app.use('/api/v1/entrepreneurs', entrepreneursRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/blocks', blocksRouter);
app.use('/api/v1/admin', adminRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  });
});

async function start() {
  try {
    await ensureBucket();
    console.log('MinIO bucket ready');
  } catch (err) {
    console.warn('MinIO not available, file uploads will fail:', (err as Error).message);
  }

  startExpirePostsJob();

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

start();
