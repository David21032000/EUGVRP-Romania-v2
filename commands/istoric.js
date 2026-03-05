import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';

const historyPath = path.join(process.cwd(), 'data', 'command_history.log');

export default {
  data: new SlashCommandBuilder()
    .setName('istoric')
    .setDescription('Arată ultimele comenzi folosite de bot')
    .addIntegerOption(opt => opt.setName('limit').setDescription('Numărul de intrări (max 200)').setRequired(false)),

  async execute(interaction) {
    const limit = Math.min(Math.max(interaction.options.getInteger('limit') || 10, 1), 200);

    if (!fs.existsSync(historyPath)) {
      return interaction.reply({ content: 'Nu există istoric încă.', ephemeral: true });
    }

    const raw = fs.readFileSync(historyPath, 'utf8').trim();
    if (!raw) return interaction.reply({ content: 'Fișier istoric gol.', ephemeral: true });

    const lines = raw.split('\n').filter(Boolean);
    const last = lines.slice(-limit).join('\n');

    if (last.length <= 1900) {
      return interaction.reply({ content: `Ultimele ${Math.min(limit, lines.length)} comenzi:\n` + last, ephemeral: true });
    }

    return interaction.reply({ files: [{ attachment: Buffer.from(last, 'utf8'), name: 'istoric_comenzi.txt' }], ephemeral: true });
  }
};
