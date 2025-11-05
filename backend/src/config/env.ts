import dotenv from 'dotenv';
import { z, ZodError } from 'zod'; 

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error('❌ Erro nas variáveis de ambiente:');
      error.issues.forEach((issue: z.ZodIssue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
    } else {
      console.error('❌ Erro inesperado ao carregar variáveis de ambiente:', error);
    }
    process.exit(1);
  }
};

export const env = parseEnv();