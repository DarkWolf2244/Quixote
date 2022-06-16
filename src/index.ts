import { Client, Intents, ClientOptions, CommandInteraction, Collection, Interaction } from 'discord.js';
import { QuixoteCommand } from './interfaces';
import { setProperty, getProperty } from './Config';

import 'colorts/lib/string';
import * as fs from 'fs';
import { clearScreenDown } from 'readline';
import { renderQueue } from './QueueRenderer';


require('dotenv').config();

export class Quixote {
    public readonly client: Client;
    public commands: Collection<string, QuixoteCommand>;
    public setProperty: (property: string, value: any) => void;
    public getProperty: (property: string) => any;

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
        
        this.setProperty = setProperty;
        this.getProperty = getProperty;

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