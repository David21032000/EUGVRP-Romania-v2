import fs from 'fs';
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

// dacă foloseşti valorile din config.json pentru CLIENT_ID / GUILD_ID
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));

async function main() {
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    // import dinamically and destructure default export
    const { default: command } = await import(`./commands/${file}`);
    if (command && command.data) {
      commands.push(command.data.toJSON());
    }
  }

  const token = process.env.TOKEN_BOT || config.botToken;
  const clientId = process.env.CLIENT_ID || config.clientId;
  const guildId = process.env.GUILD_ID || config.guildId; // optional - if set, register to guild

  if (!token) throw new Error('Bot token not set (set TOKEN_BOT env or config.botToken)');
  if (!clientId) throw new Error('Client ID not set (set CLIENT_ID env or config.clientId)');

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('✅ Comenzile au fost înregistrate pe guild:', guildId);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('✅ Comenzile globale au fost înregistrate (pot dura până la o oră să se propage)');
    }
  } catch (err) {
    console.error('Eroare la înregistrarea comenzilor:', err);
    process.exit(1);
  }
}

main().catch(console.error);
