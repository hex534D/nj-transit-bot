import path from 'path';
import { config } from 'dotenv';
import { cleanEnv, str, num, url, bool } from 'envalid';

/**
 * Load appropriate .env file based on NODE_ENV
 */
function loadEnvFile() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFiles = [
    `.env.${nodeEnv}`,
    '.env',
  ];

  // Load all files in reverse order (so higher priority overrides lower)
  envFiles.reverse().forEach((file) => {
    const envPath = path.resolve(process.cwd(), file);
    config({ path: envPath, override: false }); // Don't override already set vars
  });
}

loadEnvFile();

/**
 * Validated and typed environment variables
 * Using envalid for runtime validation
 */
export const env = cleanEnv(process.env, {
  // Node Environment
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),

  // Telegram Configuration
  TELEGRAM_BOT_TOKEN: str({
    desc: 'Telegram bot token from @BotFather',
    example: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
  }),
  TELEGRAM_CHAT_ID: str({
    desc: 'Your Telegram chat ID',
    example: '987654321',
  }),

  // NJ Transit API
  NJ_TRANSIT_API_URL: url({
    desc: 'NJ Transit GraphQL API endpoint',
    devDefault: 'https://api.example.com/graphql',
  }),
  NJ_TRANSIT_API_KEY: str({
    desc: 'NJ Transit API key',
    default: '',
  }),

  // Application Configuration
  PORT: num({
    desc: 'Server port (if running HTTP server)',
    default: 3000,
  }),
  LOG_LEVEL: str({
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
  }),

  // Feature Flags
  CRON_ENABLED: bool({
    desc: 'Enable cron jobs',
    default: true,
  }),
  DRY_RUN: bool({
    desc: 'Run without sending actual notifications',
    default: false,
  }),
});

// Type-safe access
export type Env = typeof env;
