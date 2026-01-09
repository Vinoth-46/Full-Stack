import express from 'express';
import { getMaintenanceStatus } from '../services/telegramBot.js';

const router = express.Router();

// Get maintenance status
router.get('/maintenance', async (req, res) => {
    try {
        const isMaintenance = await getMaintenanceStatus();
        res.json({
            success: true,
            maintenance: isMaintenance
        });
    } catch (error) {
        console.error('Error fetching maintenance status:', error);
        res.status(500).json({
            success: false,
            maintenance: false
        });
    }
});

export default router;
