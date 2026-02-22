import { telegram } from '../src/services/notifications.ts';
import { logger } from '../src/utils/logger.js';

async function testTelegram() {
  logger.info('🔔 Testing Telegram notification...\n');

  try {
    // Test 1: Simple message
    await telegram.sendMessage('Hello from NJ Transit Bot! 🚆', {
      title: '✅ Test Notification',
      priority: 'normal',
    });
    logger.info('✓ Simple message sent');

    // Test 2: Formatted message
    await telegram.sendMessage(
      '🚆 *Train 1234*\n⏱ Delay: 10 minutes\n📍 Reason: Signal problems',
      { title: '⚠️ Delay Alert' },
    );
    logger.info('✓ Formatted message sent');

    // Test 3: Multiple lines
    const stations = [
      '22nd Street Station (Bayonne)',
      '2nd Street Station (Hoboken)',
      'Exchange Place Station',
    ];
    await telegram.sendMessage(
      `📍 *Station List*\n\n${stations.join('\n')}`,
      { title: '🚉 Stations' },
    );
    logger.info('✓ Station list sent');

    logger.info('\n✅ All tests passed! Check your Telegram app.');
  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testTelegram();
