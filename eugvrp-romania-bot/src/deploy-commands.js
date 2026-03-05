// filepath: /workspaces/EUGVRP-Romania-v2/src/deploy-commands.js
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId } from '../config.json';
import { pingCommand } from './commands/ping.js';

const commands = [pingCommand];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();