import { QuixoteCommand, ConfigInterface } from '../interfaces';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { SuccessEmbed } from '../EmbedTemplates';

import * as fs from 'fs';

export function setProperty(property: string, value: any): void {
    let config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8'));
    config[property] = value;
    fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(config, null, 4));
}

export class Command implements QuixoteCommand {
    name: string = 'setqueuechannel';
    data: SlashCommandBuilder
    
    constructor() {
        let data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Set a channel to be the queue for pending QOTDs')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the queue')) as SlashCommandBuilder;
        
        this.data = data;
    }

    execute(interaction: CommandInteraction): any {
        setProperty('queueChannelId', interaction.channel.id);
        let embed = SuccessEmbed('Channel Set', `Successfully set the queue channel to <#${interaction.channel.id}>`);
        interaction.reply({ embeds: [embed] });
    }
}