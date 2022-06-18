import { QuixoteCommand, ConfigInterface, Quixote } from '../interfaces';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { SuccessEmbed } from '../EmbedTemplates';
import { setProperty } from '../Config';

export class Command implements QuixoteCommand {
    name: string = 'setqueuechannel';
    data: SlashCommandBuilder
    
    constructor() {
        let data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Set a channel to be the queue for pending QOTDs (defaults to current channel)')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the queue')) as SlashCommandBuilder;
        
        this.data = data;
    }

    execute(interaction: CommandInteraction, quixote: Quixote): any {
        setProperty('queueChannelId', interaction.channel.id);
        let embed = SuccessEmbed('Channel Set', `Successfully set the queue channel to <#${interaction.channel.id}>`);
        interaction.reply({ embeds: [embed] });
    }
}