import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Client, Collection } from 'discord.js'


export interface QuixoteCommand {
    name: string;
    data: SlashCommandBuilder;
    
    execute(interaction: CommandInteraction, quixote: Quixote): any;
}

export interface ConfigInterface {
    clientId: string;
    guildId: string;
    queueChannelId: string;
    qotdChannelId: string;
}

export interface Quixote {
    client: Client;
    commands: Collection<string, QuixoteCommand>;
    consoleError(message: string): void;
    consoleDebug(message: string): void;
    getProperty(property: string): any;
    setProperty(property: string, value: any): void;
    renderQueue(quixote: Quixote): void;
}

export interface QOTD {
    content: string;
    authorId: string;
    messageId?: string;
}

export interface QOTDQueue {
    queue: QOTD[];
    approved: QOTD[];
}