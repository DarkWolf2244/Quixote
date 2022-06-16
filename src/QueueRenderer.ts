import { QOTD, Quixote } from './interfaces';
import { ErrorEmbed, SuccessEmbed } from './EmbedTemplates';
import { TextChannel } from 'discord.js';

let qJSON = require('./queue.json');
let q = qJSON.queue;

function readQueue(quixote: Quixote): QOTD[] {
    delete require.cache[require.resolve('./queue.json')];
    quixote.consoleDebug(`Reading: Queue is ${require('./queue.json').queue}`);
    return require('./queue.json').queue;
}

export function renderQueue(quixote: Quixote) {
    // Clear the queue channel
    let queueChannel = quixote.client.channels.cache.get(quixote.getProperty('queueChannelId')) as TextChannel;
    queueChannel.messages.fetch({ limit: 100 }).then(messages => {
        messages.forEach(message => {
            if (message.deletable) message.delete();
        });
    });
    quixote.consoleDebug('Cleared queue channel');

    // Render the queue
    let q = readQueue(quixote);

    for (let qotd of q) {
        quixote.consoleDebug(`Rendering QOTD: ${qotd.content}`);
        let embed = SuccessEmbed('QOTD', qotd.content);
        queueChannel.send({ embeds: [embed] });
    }
}
