import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface QuixoteCommand {
    name: string;
    data: SlashCommandBuilder;
    
    execute(interaction: CommandInteraction): any;
}