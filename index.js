import fs from 'fs';
import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';

// dacă ai nevoie de alte setări poți păstra config
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));

async function main() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  // Events
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const { default: event } = await import(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }

  // Commands
  client.commands = new Collection();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    if (command && command.data?.name) {
      client.commands.set(command.data.name, command);
    }
  }

  // Session / shifts
  client.sessionActive = false;
  client.sessionLink = '';
  client.activeShifts = []; // { userId, role, startTime }

  const token = process.env.TOKEN_BOT || config.botToken;
  if (!token) throw new Error('Bot token not set (set TOKEN_BOT env or config.botToken)');
  await client.login(token);
  console.log('Bot logged in ✓');
}

main().catch(err => {
  console.error('Startup failed:', err);
  process.exit(1);
});