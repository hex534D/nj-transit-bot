import axios from 'axios';
import { env } from '../config/env.ts';
import { logger } from '../utils/logger.js';
import { NotificationOptions } from '../utils/types.ts';

export class TelegramNotifier {
  private baseUrl: string;

  constructor(
    private botToken: string,
    private chatId: string,
  ) {
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  async sendMessage(
    message: string,
    options: NotificationOptions = {},
  ): Promise<void> {
    try {
      const text = options.title
        ? `*${options.title}*\n\n${message}`
        : message;

      await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: this.chatId,
        text,
        parse_mode: 'Markdown',
        disable_notification: options.silent || false,
      });

      logger.info('Telegram notification sent');
    } catch (error) {
      logger.error('Failed to send Telegram notification:', error);
      throw error;
    }
  }

  async sendLocation(
    latitude: number,
    longitude: number,
    title?: string,
  ): Promise<void> {
    try {
      if (title) {
        await this.sendMessage(title);
      }

      await axios.post(`${this.baseUrl}/sendLocation`, {
        chat_id: this.chatId,
        latitude,
        longitude,
      });

      logger.info('Location sent via Telegram');
    } catch (error) {
      logger.error('Failed to send location:', error);
      throw error;
    }
  }
}

// Singleton instance
export const telegram = new TelegramNotifier(
  env.TELEGRAM_BOT_TOKEN,
  env.TELEGRAM_CHAT_ID,
);
