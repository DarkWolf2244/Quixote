// Command: Ping
// Ping just makes the bot reply with a quote from https://zenquotes.io/api/random to the channel

import fetch from 'node-fetch';
import { QuixoteCommand } from '../interfaces';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

class Command implements QuixoteCommand {
    name: string = 'ping';
    data: SlashCommandBuilder
    
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Reply with a zen quote')
    }

    execute(interaction: CommandInteraction): any {
        return interaction.channel.send('Pong!');
    }
}