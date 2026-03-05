import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sesiune_start')
    .setDescription('Pornește o sesiune (doar Gazdă Sesiune)')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Link server Roblox')
        .setRequired(true)
    ),
};