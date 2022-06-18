// Command: Ping
// Ping just makes the bot reply with a quote from https://zenquotes.io/api/random to the channel


import { Quixote, QuixoteCommand } from '../interfaces';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { SuccessEmbed } from '../EmbedTemplates';

export class Command implements QuixoteCommand {
    name: string = 'ping';
    data: SlashCommandBuilder
    
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Reply with a zen quote')
    }

    execute(interaction: CommandInteraction, quixote: Quixote): any {
        axios.get('https://zenquotes.io/api/random')
            .then(res => {
                let embed = SuccessEmbed('Zen Quote', `"${res.data[0].q}" --${res.data[0].a}`);
                interaction.reply({ embeds: [embed] });
            })
            .catch(err => {
                console.error(err);
            });
    }
}