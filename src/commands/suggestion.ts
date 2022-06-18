// Command: suggestion
// Suggest a QOTD

import { Quixote, QuixoteCommand } from '../interfaces';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { SuccessEmbed } from '../EmbedTemplates';
import { renderQueue } from '../QueueRenderer';
import { addQOTD } from '../QOTD';

export class Command implements QuixoteCommand {
    name: string = 'suggestion';
    data: SlashCommandBuilder

    constructor() {
        let data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Suggest a QOTD')
            .addStringOption(option => option.setName('question').setRequired(true).setDescription('The question to suggest')) as SlashCommandBuilder;
        
        this.data = data;
    }

    execute(interaction: CommandInteraction, quixote: Quixote): any {
        let embed = SuccessEmbed('Suggestion', `<a:check:986637218930106448> Suggestion submitted!`);
        embed.addField('Question', interaction.options.getString('question'));
        interaction.reply({ embeds: [embed], ephemeral: true });
        addQOTD(interaction.options.getString('question'), interaction.user.id);
        quixote.renderQueue(quixote);
    }
}