// filepath: /workspaces/EUGVRP-Romania-v2/src/events/interactionCreate.js
import { InteractionType } from 'discord.js';
import { logger } from '../utils/logger.js';

export default async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        const command = await import(`../commands/${commandName}.js`);
        await command.default(interaction);
    } catch (error) {
        logger.error(`Error handling command ${commandName}: ${error.message}`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
};