import TelegramBot from 'node-telegram-bot-api';
import Settings from '../models/settingsModel.js';

// Initialize bot with token from environment
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

// ADMIN ONLY - Your Telegram Chat ID
const ADMIN_ID = 1915596093;

const initTelegramBot = () => {
    if (!token) {
        console.log('⚠️ TELEGRAM_BOT_TOKEN not set - Telegram bot disabled');
        return;
    }

    bot = new TelegramBot(token, { polling: true });
    console.log('🤖 Telegram bot started: t.me/VinoTreats_bot');

    // Check if user is admin
    const isAdmin = (chatId) => chatId === ADMIN_ID;

    // Unauthorized access message
    const sendUnauthorized = (chatId) => {
        bot.sendMessage(chatId,
            `🚫 *Access Denied*\n\nYou are not authorized to use this bot.`,
            { parse_mode: 'Markdown' }
        );
    };

    // /start command
    bot.onText(/\/start/i, async (msg) => {
        const chatId = msg.chat.id;

        if (!isAdmin(chatId)) {
            sendUnauthorized(chatId);
            return;
        }

        const username = msg.from.username || msg.from.first_name;

        bot.sendMessage(chatId,
            `🍽️ *Welcome to VinoTreats Admin Bot!*\n\n` +
            `Hello ${username}! ✅ You are authorized.\n\n` +
            `*Commands:*\n` +
            `• /maintenance on - 🔴 Enable maintenance\n` +
            `• /maintenance off - 🟢 Disable maintenance\n` +
            `• /status - 📊 Check status\n` +
            `• /help - ❓ Show commands`,
            { parse_mode: 'Markdown' }
        );
    });

    // /help command
    bot.onText(/\/help/i, (msg) => {
        const chatId = msg.chat.id;

        if (!isAdmin(chatId)) {
            sendUnauthorized(chatId);
            return;
        }

        bot.sendMessage(chatId,
            `🍽️ *VinoTreats Admin Commands*\n\n` +
            `• /maintenance on - 🔴 Enable maintenance mode\n` +
            `• /maintenance off - 🟢 Disable maintenance mode\n` +
            `• /status - 📊 Check current status\n` +
            `• /help - ❓ Show this help`,
            { parse_mode: 'Markdown' }
        );
    });

    // /maintenance on command
    bot.onText(/\/maintenance\s+on/i, async (msg) => {
        const chatId = msg.chat.id;

        if (!isAdmin(chatId)) {
            sendUnauthorized(chatId);
            return;
        }

        const username = msg.from.username || msg.from.first_name;

        await Settings.findOneAndUpdate(
            { key: 'maintenance_mode' },
            { value: true, updatedBy: username },
            { upsert: true }
        );

        bot.sendMessage(chatId,
            `🔧 *Maintenance Mode ENABLED* 🔴\n\n` +
            `✅ Website is now in maintenance mode.\n` +
            `👤 Changed by: ${username}\n\n` +
            `🌐 Users will see the maintenance screen.`,
            { parse_mode: 'Markdown' }
        );
    });

    // /maintenance off command
    bot.onText(/\/maintenance\s+off/i, async (msg) => {
        const chatId = msg.chat.id;

        if (!isAdmin(chatId)) {
            sendUnauthorized(chatId);
            return;
        }

        const username = msg.from.username || msg.from.first_name;

        await Settings.findOneAndUpdate(
            { key: 'maintenance_mode' },
            { value: false, updatedBy: username },
            { upsert: true }
        );

        bot.sendMessage(chatId,
            `✅ *Maintenance Mode DISABLED* 🟢\n\n` +
            `🌐 Website is now LIVE!\n` +
            `👤 Changed by: ${username}\n\n` +
            `Users can access the website normally.`,
            { parse_mode: 'Markdown' }
        );
    });

    // /status command
    bot.onText(/\/status/i, async (msg) => {
        const chatId = msg.chat.id;

        if (!isAdmin(chatId)) {
            sendUnauthorized(chatId);
            return;
        }

        const setting = await Settings.findOne({ key: 'maintenance_mode' });
        const isOn = setting?.value || false;
        const by = setting?.updatedBy || 'Not set yet';
        const updatedAt = setting?.updatedAt
            ? new Date(setting.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : 'Never';

        bot.sendMessage(chatId,
            `📊 *VinoTreats Status*\n\n` +
            `🔧 Maintenance: ${isOn ? '🔴 ON' : '🟢 OFF'}\n` +
            `👤 Last changed by: ${by}\n` +
            `🕐 Updated: ${updatedAt}\n\n` +
            `🌐 Website: https://full-stack-yldm.onrender.com`,
            { parse_mode: 'Markdown' }
        );
    });

    // Handle unknown commands - only for admin
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text || '';

        // Skip if it's a known command
        if (text.match(/^\/(start|help|maintenance|status)/i)) {
            return;
        }

        // Only respond to messages starting with /
        if (text.startsWith('/')) {
            if (!isAdmin(chatId)) {
                sendUnauthorized(chatId);
                return;
            }

            bot.sendMessage(chatId,
                `❓ Unknown command: ${text}\n\n` +
                `Available commands:\n` +
                `• /maintenance on\n` +
                `• /maintenance off\n` +
                `• /status\n` +
                `• /help`
            );
        }
    });
};

// Get maintenance status
const getMaintenanceStatus = async () => {
    try {
        const setting = await Settings.findOne({ key: 'maintenance_mode' });
        return setting?.value || false;
    } catch (error) {
        console.error('Error getting maintenance status:', error);
        return false;
    }
};

export { initTelegramBot, getMaintenanceStatus };
