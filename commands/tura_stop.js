import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('tura_stop')
    .setDescription('Oprește tură activă'),
};