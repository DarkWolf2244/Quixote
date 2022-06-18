import { QuixoteCommand, Quixote } from "../interfaces";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuccessEmbed } from "../EmbedTemplates";

export class Command implements QuixoteCommand {
    name: string = "setqotdchannel";
    data: SlashCommandBuilder;

    constructor() {
        let data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Set a channel to be used for QOTDs (defaults to current channel)")
            .addStringOption(option => option.setName("channel").setRequired(false).setDescription("The channel to set as the QOTD channel")) as SlashCommandBuilder;

        this.data = data;
    }

    execute(interaction: CommandInteraction, quixote: Quixote): any {
        quixote.setProperty("qotdChannelId", interaction.channel.id);
        let embed = SuccessEmbed("Channel Set", `Successfully set the QOTD channel to <#${interaction.channel.id}>`);
        interaction.reply({ embeds: [embed] });

        let channelID = interaction.channelId;
        if (interaction.options.getString("channel")) {
            channelID = interaction.options.getString("channel");
        }

        quixote.setProperty("qotdChannelId", channelID);

    }
}