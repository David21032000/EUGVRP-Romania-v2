export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

      const { commandName, user, member, options } = interaction;
      // load config (fallback to project config) - this file contains channel/role IDs
      const cfg = JSON.parse(await (await import('../config/config.json', { assert: { type: 'json' } })).default || '{}');
      const { roles, channels } = cfg;

      // prepare history logging
      const fs = await import('fs');
      const path = await import('path');
      const historyDir = path.join(process.cwd(), 'data');
      const historyPath = path.join(historyDir, 'command_history.log');
      try {
        if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
      } catch (e) {
        console.error('Failed to ensure history dir:', e);
      }

    // ---------- TURA START ----------
    if (commandName === 'tura_start') {
      if (!client.sessionActive)
        return interaction.reply({ content: '❌ Nu există nicio sesiune activă. Așteaptă ca o sesiune să fie pornită de către Gazdă.', ephemeral: true });

      if (client.activeShifts.find(s => s.userId === user.id))
        return interaction.reply({ content: '⚠️ Ai deja o tură activă!', ephemeral: true });

      let userRole = '';
      if (member.roles.cache.has(roles.politie)) userRole = 'Poliție';
      else if (member.roles.cache.has(roles.pompieri)) userRole = 'Pompieri';
      else if (member.roles.cache.has(roles.dot)) userRole = 'DOT';
      else
        return interaction.reply({
          content: `🚫 **${user.username}**, nu ai rolul necesar pentru a începe această tură. Dacă vrei să faci parte dintr-o facțiune, aplică pe server.`,
          ephemeral: true
        });

      client.activeShifts.push({ userId: user.id, role: userRole, startTime: new Date() });

      const embed = {
        title: 'TURĂ PORNITĂ',
        description: `**${user.username}** a început tura în cadrul **${userRole}**`,
        color: 0x00ff00,
        timestamp: new Date()
      };
      const canalTure = await client.channels.fetch(channels.ture);
      canalTure.send({ embeds: [embed] });

      const embedLog = {
        title: 'LOG TURA START',
        description: `**${user.tag}** a început tura în **${userRole}**`,
        color: 0x0099ff,
        timestamp: new Date()
      };
      const canalLog = await client.channels.fetch(channels.log);
      canalLog.send({ embeds: [embedLog] });

      // log command
      try {
        const line = `${new Date().toISOString()} | ${user.tag} | tura_start | ${JSON.stringify({ role: userRole })}\n`;
        fs.appendFileSync(historyPath, line);
      } catch (e) { console.error('Failed to log command:', e); }
      return interaction.reply({ content: `✅ Ai început tura în **${userRole}**`, ephemeral: true });
    }

    // ---------- TURA STOP ----------
    if (commandName === 'tura_stop') {
      const shift = client.activeShifts.find(s => s.userId === user.id);
      if (!shift) return interaction.reply({ content: '❌ Nu ai nicio tură activă.', ephemeral: true });

      const durationMs = new Date() - shift.startTime;
      const durationMin = Math.floor(durationMs / 60000);
      client.activeShifts = client.activeShifts.filter(s => s.userId !== user.id);

      const embed = {
        title: 'TURĂ ÎNCHEIATĂ',
        description: `**${user.username}** a încheiat tura în **${shift.role}** după ${durationMin} minute.`,
        color: 0xffa500,
        timestamp: new Date()
      };
      const canalTure = await client.channels.fetch(channels.ture);
      canalTure.send({ embeds: [embed] });

      const embedLog = {
        title: 'LOG TURA STOP',
        description: `**${user.tag}** a încheiat tura în **${shift.role}** după ${durationMin} minute.`,
        color: 0xffaa00,
        timestamp: new Date()
      };
      const canalLog = await client.channels.fetch(channels.log);
      canalLog.send({ embeds: [embedLog] });

      try {
        const line = `${new Date().toISOString()} | ${user.tag} | tura_stop | ${JSON.stringify({ durationMin })}\n`;
        fs.appendFileSync(historyPath, line);
      } catch (e) { console.error('Failed to log command:', e); }
      return interaction.reply({ content: `✅ Ai încheiat tura după ${durationMin} minute.`, ephemeral: true });
    }

    // ---------- SESIUNE START ----------
    if (commandName === 'sesiune_start') {
      if (!member.roles.cache.has(roles.sessionHost))
        return interaction.reply({ content: '❌ Nu ai rolul de Gazdă Sesiune.', ephemeral: true });

      if (client.sessionActive) return interaction.reply({ content: '⚠️ O sesiune este deja activă!', ephemeral: true });

      client.sessionLink = options.getString('link') || '';
      client.sessionActive = true;
      client.activeShifts = [];

      const embed = {
        title: 'SESIUNE PORNITĂ',
        description: `O nouă sesiune a fost pornită.\n[Link server Roblox](${client.sessionLink})`,
        color: 0x00ffff,
        timestamp: new Date()
      };
      const canalSesiune = await client.channels.fetch(channels.sesiune);
      canalSesiune.send({ embeds: [embed] });

      try {
        const line = `${new Date().toISOString()} | ${user.tag} | sesiune_start | ${JSON.stringify({ link: client.sessionLink })}\n`;
        fs.appendFileSync(historyPath, line);
      } catch (e) { console.error('Failed to log command:', e); }
      return interaction.reply({ content: '✅ Sesiunea a fost pornită cu succes.', ephemeral: true });
    }

    // ---------- SESIUNE STOP ----------
    if (commandName === 'sesiune_stop') {
      if (!member.roles.cache.has(roles.sessionHost))
        return interaction.reply({ content: '❌ Nu ai rolul de Gazdă Sesiune.', ephemeral: true });

      if (!client.sessionActive) return interaction.reply({ content: '⚠️ Nu există nicio sesiune activă!', ephemeral: true });

      let raport = {};
      for (const shift of client.activeShifts) {
        raport[shift.role] = (raport[shift.role] || 0) + 1;
      }

      let raportText = '';
      for (const [role, count] of Object.entries(raport)) {
        raportText += `**${role}**: ${count}\n`;
      }
      if (!raportText) raportText = 'Nu au existat ture active.';

      const embedRaport = {
        title: 'RAPORT SESIUNE',
        description: raportText,
        color: 0xff0000,
        timestamp: new Date()
      };
      const canalSesiune = await client.channels.fetch(channels.sesiune);
      canalSesiune.send({ embeds: [embedRaport] });

      client.activeShifts = [];
      client.sessionActive = false;
      client.sessionLink = '';

      try {
        const line = `${new Date().toISOString()} | ${user.tag} | sesiune_stop | ${JSON.stringify({ report: raportText })}\n`;
        fs.appendFileSync(historyPath, line);
      } catch (e) { console.error('Failed to log command:', e); }
      return interaction.reply({ content: '✅ Sesiunea a fost oprită și toate turele au fost încheiate.', ephemeral: true });
    }
  }
};