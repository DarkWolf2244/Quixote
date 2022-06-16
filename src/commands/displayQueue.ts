import { Quixote, QuixoteCommand } from "../interfaces";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuccessEmbed } from "../EmbedTemplates";
import { renderQueue } from "../QueueRenderer";

export class Command implements QuixoteCommand {
    name: string = "displayqueue";
    data: SlashCommandBuilder;

    constructor() {
        let data = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Render the QOTD queue to the queue channel, after clearing it");

        this.data = data;
    }

    execute(interaction: CommandInteraction, quixote: Quixote): any {
        renderQueue(quixote);
        let embed = SuccessEmbed("Queue Rendered", `Successfully rendered the queue to <#${interaction.channel.id}>`);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}