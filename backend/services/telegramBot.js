import TelegramBot from 'node-telegram-bot-api';
import Settings from '../models/settingsModel.js';

// Initialize bot with token from environment
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot = null;

// Authorized admin chat IDs
let authorizedAdmins = [];

const initTelegramBot = () => {
    if (!token) {
        console.log('⚠️ TELEGRAM_BOT_TOKEN not set - Telegram bot disabled');
        return;
    }

    bot = new TelegramBot(token, { polling: true });
    console.log('🤖 Telegram bot started: t.me/VinoTreats_bot');

    // /start command
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const username = msg.from.username || msg.from.first_name;

        if (!authorizedAdmins.includes(chatId)) {
            authorizedAdmins.push(chatId);
            await Settings.findOneAndUpdate(
                { key: 'telegram_admins' },
                { value: authorizedAdmins, updatedBy: username },
                { upsert: true }
            );
        }

        bot.sendMessage(chatId,
            `🍽️ *Welcome to VinoTreats Admin Bot!*\n\n` +
            `Hello ${username}! You're registered as admin.\n\n` +
            `*Commands:*\n` +
            `• /maintenance on - Enable maintenance\n` +
            `• /maintenance off - Disable maintenance\n` +
            `• /status - Check status\n` +
            `• /help - Show commands`,
            { parse_mode: 'Markdown' }
        );
    });

    // /help command
    bot.onText(/\/help/, (msg) => {
        bot.sendMessage(msg.chat.id,
            `🍽️ *VinoTreats Commands*\n\n` +
            `• /maintenance on\n` +
            `• /maintenance off\n` +
            `• /status\n` +
            `• /help`,
            { parse_mode: 'Markdown' }
        );
    });

    // /maintenance command
    bot.onText(/\/maintenance (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const action = match[1].toLowerCase();
        const username = msg.from.username || msg.from.first_name;

        if (action === 'on' || action === 'enable') {
            await Settings.findOneAndUpdate(
                { key: 'maintenance_mode' },
                { value: true, updatedBy: username },
                { upsert: true }
            );
            bot.sendMessage(chatId,
                `🔧 *Maintenance Mode ENABLED*\n\nWebsite is now in maintenance mode.\n\n_By: ${username}_`,
                { parse_mode: 'Markdown' }
            );
        } else if (action === 'off' || action === 'disable') {
            await Settings.findOneAndUpdate(
                { key: 'maintenance_mode' },
                { value: false, updatedBy: username },
                { upsert: true }
            );
            bot.sendMessage(chatId,
                `✅ *Maintenance Mode DISABLED*\n\nWebsite is now live!\n\n_By: ${username}_`,
                { parse_mode: 'Markdown' }
            );
        } else {
            bot.sendMessage(chatId, `❌ Use: /maintenance on or /maintenance off`);
        }
    });

    // /status command
    bot.onText(/\/status/, async (msg) => {
        const setting = await Settings.findOne({ key: 'maintenance_mode' });
        const isOn = setting?.value || false;
        const by = setting?.updatedBy || 'N/A';

        bot.sendMessage(msg.chat.id,
            `📊 *VinoTreats Status*\n\n` +
            `🔧 Maintenance: ${isOn ? '🔴 ON' : '🟢 OFF'}\n` +
            `👤 Changed by: ${by}`,
            { parse_mode: 'Markdown' }
        );
    });

    // Load admins from DB
    Settings.findOne({ key: 'telegram_admins' }).then(s => {
        if (s?.value) authorizedAdmins = s.value;
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
