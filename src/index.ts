import { Client, Intents, ClientOptions, CommandInteraction, Collection, Interaction, ButtonInteraction, Message, TextChannel } from 'discord.js';
import { QOTDQueue, QuixoteCommand } from './interfaces';
import { setProperty, getProperty } from './Config';
import { SuccessEmbed } from './EmbedTemplates';
let express = require('express');

import 'colorts/lib/string';
import * as fs from 'fs';
import { clearScreenDown } from 'readline';
import { renderQueue } from './QueueRenderer';

import * as node_schedule from 'node-schedule';


require('dotenv').config();

export class Quixote {
    public readonly client: Client;
    public commands: Collection<string, QuixoteCommand>;
    public setProperty: (property: string, value: any) => void;
    public getProperty: (property: string) => any;
    public renderQueue: (quixote: Quixote) => void;

    constructor(options: ClientOptions) {
        let client: any = new Client(options);
        this.client = client; // Ahhh it hurts

        this.client.on('ready', () => {
            console.log('QUIXOTE'.blue + ": " + " Online".green);
        });

        this.commands = new Collection();
        
        console.log(__dirname)
        let commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            let command = require(`./commands/${file}`);
            let cmd = new command.Command();
            this.commands.set(cmd.name, cmd);
        }

        this.client.on('interactionCreate', (interaction: Interaction) => {
            if (interaction.isCommand()) {
                let commandInteraction: CommandInteraction = interaction as CommandInteraction;
                let command: QuixoteCommand = this.commands.get(commandInteraction.commandName);
                
                if (command) {
                    command.execute(commandInteraction, this);
                }
            }
        });
        
        this.client.on('interactionCreate', (interaction: ButtonInteraction) => {
            if (!interaction.isButton()) return;
            // Find the QOTD with the corresponding message ID in queueFile
            let queueFile = JSON.parse(fs.readFileSync(__dirname + '/queueFile.json', 'utf8')) as QOTDQueue;
            let qotd = queueFile.queue.find(q => q.messageId === interaction.message.id);
            this.consoleDebug(`Button clicked on QOTD suggestion for ${qotd.content}`);
            interaction.reply({ embeds: [ SuccessEmbed('QOTD Approved', '<a:check:986637218930106448> The suggestion has been approved.') ], ephemeral: true });

            // Delete the QOTD from the queue
            queueFile.queue = queueFile.queue.filter(q => q.messageId !== interaction.message.id);
            queueFile.approved.push(qotd);
            fs.writeFileSync(__dirname + '/queueFile.json', JSON.stringify(queueFile, null, 4));
            // Delete the QOTD message
            let message = interaction.message as Message;
            message.delete();
            // Render the queue
            this.renderQueue(this);
        });

        this.setProperty = setProperty;
        this.getProperty = getProperty;
        
        this.renderQueue = renderQueue;
        // setInterval(() => renderQueue(this), 10000);
    }

    consoleError(error: string) {
        console.error(`${'ERROR'.red}: ${error}`);
    }

    consoleDebug(message: string) {
        console.debug(`${'DEBUG'.blue}: ${message}`);
    }
}

let quixote = new Quixote({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });;

quixote.client.login(process.env.DISCORD_TOKEN);

process.on('SIGINT', () => {
    console.log('QUIXOTE'.blue + ": " + " Offline".red);
    quixote.client.user.setPresence({ status: 'invisible' });
    quixote.client.destroy();
    process.exit(0);
});

/* setInterval(() => {
    quixote.consoleDebug("Now sending QOTD");
    let queueFile = JSON.parse(fs.readFileSync(__dirname + '/queueFile.json', 'utf8')) as QOTDQueue;
    let qotd = queueFile.approved[Math.floor(Math.random() * queueFile.approved.length)];

    let qotdChannel = quixote.client.channels.cache.get(quixote.getProperty('qotdChannelId')) as TextChannel;
    
    let embed = SuccessEmbed('QOTD', qotd.content);
    embed.setAuthor({ name: qotd.authorId, iconURL: 'https://cdn.discordapp.com/avatars/' + qotd.authorId + '/' + qotd.authorId + '.png' });
    embed.setFooter({ text: `Suggested by <@${qotd.authorId}>` });
    qotdChannel.send({ embeds: [ embed ] });

    // Delete the QOTD from the queue
    queueFile.approved = queueFile.approved.filter(q => q.messageId !== qotd.messageId);
    fs.writeFileSync(__dirname + '/queueFile.json', JSON.stringify(queueFile, null, 4));
    // Render the queue
    quixote.renderQueue(quixote);
}, 10000);*/

let app = express();

app.get('/health', (req, res) => res.send("App running!"));
app.listen(10000, () => quixote.consoleDebug("Express health server running.");
