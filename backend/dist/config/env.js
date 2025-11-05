"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3001').transform(Number),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
});
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('❌ Erro nas variáveis de ambiente:');
            error.issues.forEach((issue) => {
                console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
            });
        }
        process.exit(1);
    }
};
exports.env = parseEnv();
