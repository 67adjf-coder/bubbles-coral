const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    PermissionFlagsBits, 
    REST, 
    Routes, 
    SlashCommandBuilder 
} = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
require('dotenv').config();

// Configuration IDs
const CATEGORY_ID = '1539233770035617904';
const STAFF_ROLE_ID = '1533372358755221566';
const TRANSCRIPT_CHANNEL_ID = '1507278726998524046';

// Color & Media Constants
const PASTEL_BLUE = '#AEC6CF';
const BANNER_URL = 'https://cdn.discordapp.com/attachments/1553697060056866906/1554405328462938162/Coral_Reef_Sea_GIF_-_Coral_Reef_Sea_Ocean_-_Discover__Share_GIFs.gif';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// Register Slash Command
const commands = [
    new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Setup the ticket panel')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Register commands globally
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
});

// Helper Function: Build Panel Buttons
function getTicketSetupButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_order_btn').setLabel('order').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('ticket_report_btn').setLabel('report').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ticket_others_btn').setLabel('others').setStyle(ButtonStyle.Success)
    );
}

// Helper Function: Build Ticket Control Buttons
function getTicketControlButtons(claimed = false, closed = false) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_claim_btn')
            .setLabel('Claim')
            .setStyle(ButtonStyle.Success)
            .setDisabled(claimed),
        new ButtonBuilder()
            .setCustomId('ticket_close_btn')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(closed)
    );
}

// ==========================================
// INTERACTION LOGIC
// ==========================================

client.on('interactionCreate', async (interaction) => {

    // 1. Slash Command: /ticket-setup
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'ticket-setup') {
            const embed = new EmbedBuilder()
                .setDescription(
                    "_ _\n" +
                    "# _ _      tick__kette__ b*oo*th <:butterfly:1554370425587245066>\n" +
                    "_ _\n" +
                    "    always  ask  in  <#1507214174084927501>  \n" +
                    "    before ordering and opening a\n" +
                    "    ticket! \n" +
                    "_ _\n" +
                    ">  ꫂ❁  **tickette rules** :\n" +
                    "> ` `   payment first before process\n" +
                    "> ` `   do not open if you are unsure\n" +
                    "> ` `   no trolling.  ticket troll = ban !\n" +
                    "> ` `   reporting hrs: 1pm-10pm only\n" +
                    "> ` `   voided if  reported  outside  ^\n"
                )
                .setColor(PASTEL_BLUE)
                .setImage(BANNER_URL);

            await interaction.reply({ content: 'Ticket panel created!', ephemeral: true });
            await interaction.channel.send({ embeds: [embed], components: [getTicketSetupButtons()] });
        }
        return;
    }

    // 2. Setup Panel Buttons Trigger Modals
    if (interaction.isButton()) {
        const { customId, guild, member, channel } = interaction;

        if (customId === 'ticket_order_btn') {
            const modal = new ModalBuilder().setCustomId('order_modal').setTitle('Order Form');
            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('product_name').setLabel('product name:').setPlaceholder('the product you wish to purchase').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('quantity').setLabel('quantity:').setPlaceholder('how many pcs will you buy').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('details').setLabel('details:').setPlaceholder('uid, id, and username ( put N/A if not applicable )').setStyle(TextInputStyle.Paragraph).setRequired(true)
                )
            );
            return await interaction.showModal(modal);
        }

        if (customId === 'ticket_report_btn') {
            const modal = new ModalBuilder().setCustomId('report_modal').setTitle('Report Form');
            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('product_name').setLabel('product name:').setPlaceholder('the product you wish to report').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('months').setLabel('months purchased:').setPlaceholder('how many months is the product item').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('issue').setLabel('item issue:').setPlaceholder('explain the issue of the product').setStyle(TextInputStyle.Paragraph).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('vouch_link').setLabel('vouch link :').setPlaceholder('paste the link of your vouch').setStyle(TextInputStyle.Short).setRequired(true)
                )
            );
            return await interaction.showModal(modal);
        }

        if (customId === 'ticket_others_btn') {
            const modal = new ModalBuilder().setCustomId('others_modal').setTitle('Others Form');
            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('reason').setLabel('reason for opening a ticket:').setPlaceholder('application, partnership, etc.').setStyle(TextInputStyle.Paragraph).setRequired(true)
                )
            );
            return await interaction.showModal(modal);
        }

        // Staff Button Controls
        const isStaff = member.roles.cache.has(STAFF_ROLE_ID);

        if (customId === 'ticket_claim_btn') {
            if (!isStaff) return await interaction.reply({ content: 'Only staff members can use this button!', ephemeral: true });

            await interaction.update({ components: [getTicketControlButtons(true, false)] });
            await channel.send(`ticket claimed by : ${member.user}`);
            return;
        }

        if (customId === 'ticket_close_btn') {
            if (!isStaff) return await interaction.reply({ content: 'Only staff members can use this button!', ephemeral: true });

            await interaction.update({ components: [getTicketControlButtons(true, true)] });
            await channel.send('ticket will be closed in 10 mins, generating transcript!');

            // 10-Minute Timer Before Transcript & Channel Deletion
            setTimeout(async () => {
                try {
                    // Generate HTML Transcript
                    const attachment = await discordTranscripts.createTranscript(channel, {
                        limit: -1,
                        fileName: `transcript-${channel.name}.html`,
                        poweredBy: false
                    });

                    // Send transcript to User DM
                    const usernamePart = channel.name.split('-').slice(1).join('-');
                    const ticketOwner = guild.members.cache.find(m => m.user.username.toLowerCase() === usernamePart);

                    if (ticketOwner) {
                        await ticketOwner.send({
                            content: `Here is the transcript for your ticket **#${channel.name}**:`,
                            files: [attachment]
                        }).catch(() => {}); // Catch closed DMs
                    }

                    // Send transcript to Log Channel
                    const logChannel = guild.channels.cache.get(TRANSCRIPT_CHANNEL_ID);
                    if (logChannel) {
                        await logChannel.send({
                            content: `Transcript generated for **#${channel.name}**:`,
                            files: [attachment]
                        });
                    }

                    // Delete Ticket Channel
                    await channel.delete();
                } catch (err) {
                    console.error('Error closing channel:', err);
                }
            }, 600000); // 10 minutes (600,000 ms)

            return;
        }
    }

    // 3. Modal Form Submissions
    if (interaction.isModalSubmit()) {
        const { customId, user, guild } = interaction;

        await interaction.reply({ content: 'creating your ticket... please be patient', ephemeral: true });

        // Extract fields
        let ticketType = '';
        const fields = [];

        if (customId === 'order_modal') {
            ticketType = 'order';
            fields.push(
                { name: '> product name:', value: `\`\`\`\n${interaction.fields.getTextInputValue('product_name')}\n\`\`\`` },
                { name: '> quantity:', value: `\`\`\`\n${interaction.fields.getTextInputValue('quantity')}\n\`\`\`` },
                { name: '> details:', value: `\`\`\`\n${interaction.fields.getTextInputValue('details')}\n\`\`\`` }
            );
        } else if (customId === 'report_modal') {
            ticketType = 'report';
            fields.push(
                { name: '> product name:', value: `\`\`\`\n${interaction.fields.getTextInputValue('product_name')}\n\`\`\`` },
                { name: '> months purchased:', value: `\`\`\`\n${interaction.fields.getTextInputValue('months')}\n\`\`\`` },
                { name: '> item issue:', value: `\`\`\`\n${interaction.fields.getTextInputValue('issue')}\n\`\`\`` },
                { name: '> vouch link :', value: `\`\`\`\n${interaction.fields.getTextInputValue('vouch_link')}\n\`\`\`` }
            );
        } else if (customId === 'others_modal') {
            ticketType = 'others';
            fields.push(
                { name: '> reason for opening a ticket:', value: `\`\`\`\n${interaction.fields.getTextInputValue('reason')}\n\`\`\`` }
            );
        }

        // Wait 5 seconds as requested
        setTimeout(async () => {
            const category = guild.channels.cache.get(CATEGORY_ID);

            // Channel Overrides: User + Staff Role + Bot
            const channel = await guild.channels.create({
                name: `\({ticketType}-\){user.username}`.toLowerCase(),
                parent: category ? category.id : null,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
                    { id: STAFF_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                ]
            });

            // Embed Content
            const embed = new EmbedBuilder()
                .setTitle(`Ticket Details (${ticketType.toUpperCase()})`)
                .setColor(PASTEL_BLUE)
                .addFields(fields)
                .setImage(BANNER_URL)
                .setFooter({ text: `Opened by: \({user.tag} (\){user.id})` });

            await channel.send({
                content: `Welcome \({user} | <@&\){STAFF_ROLE_ID}>`,
                embeds: [embed],
                components: [getTicketControlButtons()]
            });

            await interaction.editReply({ content: `Your ticket has been created: ${channel}` });
        }, 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
