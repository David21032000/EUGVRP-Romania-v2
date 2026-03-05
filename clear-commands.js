import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const token = process.env.TOKEN_BOT || config.botToken;
const clientId = process.env.CLIENT_ID || config.clientId;
const guildId = process.env.GUILD_ID || config.guildId;

if (!token) {
  console.error('TOKEN_BOT not set in env or config.');
  process.exit(1);
}
if (!clientId) {
  console.error('CLIENT_ID not set in env or config.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

async function clear() {
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
      console.log('✅ Guild commands cleared for', guildId);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      console.log('✅ Global commands cleared');
    }
  } catch (err) {
    console.error('Failed to clear commands:', err);
    process.exit(1);
  }
}

clear();
