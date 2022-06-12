import { MessageEmbed } from 'discord.js';

let randomFooters = [
    `Hi, D4N13L.`,
    `My name is Quixote. I'm the QOTD bot sent by DarkWolf.`,
    `My predecessor was unfortunately destroyed. This incident will not affect the investigation.`,
    `There's a small chance of seeing this footer.`
]

export function SuccessEmbed(title: string, message: string): MessageEmbed {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor('#00ff00')
        .setFooter({ text: randomFooters[Math.floor(Math.random() * randomFooters.length)] });  
}