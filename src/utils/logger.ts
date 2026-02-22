import chalk from "chalk";
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(
      chalk.green(`[INFO] ${new Date().toISOString()} - ${message}`),
      ...args,
    );
  },
  error: (message: string, ...args: any[]) => {
    console.error(
      chalk.red(`[ERROR] ${new Date().toISOString()} - ${message}`),
      ...args,
    );
  },
  debug: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(
        chalk.blue(
          `[DEBUG] ${new Date().toISOString()} - ${message}`,
        ),
        ...args,
      );
    }
  },
};
