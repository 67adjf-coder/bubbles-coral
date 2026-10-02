const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const express = require('express');
require('dotenv').config();

// -------------------------------------------------------------
// 1. HTTP WEB SERVER FOR RENDER HEALTH CHECKS
// -------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.status(200).send({ status: 'ok', message: 'Discord Status Bot Web Service is live!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server listening on port ${PORT}`);
});

// -------------------------------------------------------------
// 2. DISCORD BOT & SLASH COMMAND SETUP
// -------------------------------------------------------------
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Set shop status to open or closed')
        .addStringOption(option =>
            option.setName('state')
                .setDescription('Select shop status')
                .setRequired(true)
                .addChoices(
                    { name: 'open', value: 'open' },
                    { name: 'closed', value: 'closed' }
                )
        )
].map(cmd => cmd.toJSON());

const OPEN_LAYOUT = `_ _
#        [𝓒oastal  𝓒art](https://.gg/coastalcart) : ( open ) ༄
-# _ _    <@&1533372358755221566>    will be here to assist you !
~~                                                                                                  ~~
                    𝓢hop      𝓔ssentials    :
                   <@&1507222001972940861>    𝓢hop      𝓔ssentials    :(https://discord.com/channels/1507214174084927498/1507219714131365898)    always
         <:hearty:1554781762813558804>    always __ask__ before creating a ticket
         <:hearty:1554781762813558804>    always vouch your items for warranty!
         <:hearty:1554781762813558804>    rude & rush buyers will not be entertained
~~                                                                                                  ~~
          <:zz_blueheart3:1555584821529546752>     **[ticket booth](https://discord.com/channels/1507214174084927498/1507271610837762170) **    ꕀ    to purchase
          <:zz_blueheart3:1555584821529546752>    ** [vouch items](https://discord.com/channels/1507214174084927498/1507271897962778706)**    ꕀ    for warranty
_ _`;

const CLOSED_LAYOUT = `_ _
#      [𝓒oastal  𝓒art](https://.gg/coastalcart) : ( closed ) ༄
-# _ _    <@&1533372358755221566>    will serve you tomorrow !
~~                                                                                                  ~~
                  <@&1507222001972940861>    𝓢hop      𝓔ssentials    :
         <:hearty:1554781762813558804>    kindly read our shop [rules](https://discord.com/channels/1507214174084927498/1507219714131365898) always
         <:hearty:1554781762813558804>    always __ask__ before creating a ticket
         <:hearty:1554781762813558804>    always vouch your items for warranty!
         <:hearty:1554781762813558804>    rude & rush buyers will not be entertained
~~                                                                                                  ~~
          <:zz_blueheart3:1555584821529546752>     **[ticket booth](https://discord.com/channels/1507214174084927498/1507271610837762170) **    ꕀ    to purchase
          <:zz_blueheart3:1555584821529546752>    ** [vouch items](https://discord.com/channels/1507214174084927498/1507271897962778706)**    ꕀ    for warranty
_ _`;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Slash commands registered globally!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'status') {
        const state = interaction.options.getString('state');
        const selectedLayout = state === 'open' ? OPEN_LAYOUT : CLOSED_LAYOUT;

        await interaction.reply({ content: `Status set to **${state}**!`, ephemeral: true });
        await interaction.channel.send({ content: selectedLayout });
    }
});

client.login(process.env.DISCORD_TOKEN);
