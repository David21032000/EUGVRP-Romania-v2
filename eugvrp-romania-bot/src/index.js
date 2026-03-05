// filepath: /workspaces/EUGVRP-Romania-v2/src/index.js
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { deployCommands } from './deploy-commands.js';
import { logger } from './utils/logger.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
    ],
});

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    if (command === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        logger.info('Bot logged in successfully.');
        deployCommands();
    })
    .catch(err => {
        logger.error('Failed to log in:', err);
    });