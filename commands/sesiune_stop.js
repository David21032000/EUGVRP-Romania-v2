import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('sesiune_stop')
    .setDescription('Oprește sesiunea și toate turele (doar Gazdă Sesiune)'),
};