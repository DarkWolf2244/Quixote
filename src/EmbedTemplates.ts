import { MessageEmbed } from 'discord.js';

let randomFooters = [
    `Hi, D4N13L.`,
    `My name is Quixote. I'm the QOTD bot sent by DarkWolf.`,
    `My predecessor was unfortunately destroyed. This incident will not affect the investigation.`,
    `There's a small chance of seeing this footer.`
]

let randomErrorFooters = [
    `It's not me, it's you.`,
    `I'm sorry an error occured. Please ~~don't~~ report this to the bot owner.`,
]

export function SuccessEmbed(title: string, message: string): MessageEmbed {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor('#00ff00')
        .setFooter({ text: randomFooters[Math.floor(Math.random() * randomFooters.length)] });  
}

export function ErrorEmbed(title: string, message: string): MessageEmbed {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor('#ff0000')
        .setFooter({ text: randomErrorFooters[Math.floor(Math.random() * randomErrorFooters.length)] });  
}