import { QOTD, QOTDQueue, Quixote } from './interfaces';
import { ErrorEmbed, PendingEmbed, SuccessEmbed } from './EmbedTemplates';
import { TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import * as fs from 'fs';

let qJSON = require('./queueFile.json');
let q = qJSON.queue;

function readQueue(quixote: Quixote): QOTDQueue {
    delete require.cache[require.resolve('./queueFile.json')];
    return require('./queueFile.json');
}

function writeQueue(quixote: Quixote, queue: QOTDQueue): void {
    delete require.cache[require.resolve('./queueFile.json')];
    require('fs').writeFileSync('./queueFile.json', JSON.stringify(queue, null, 4));
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
    let queue = q.queue;

    for (let qotd of queue) {
        quixote.consoleDebug(`Rendering QOTD: ${qotd.content}`);
        let embed = PendingEmbed('QOTD Suggestion', qotd.content);
        embed.addField('Author', `<@${qotd.authorId}>`);

        let buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                            .setLabel('Reject')
                            .setCustomId('reject')
                            .setStyle('DANGER'),
                new MessageButton()
                            .setLabel('Accept')
                            .setCustomId('accept')
                            .setStyle('SUCCESS')
                );


        let sentMessage = queueChannel.send({ embeds: [embed], components: [buttonRow] });
        sentMessage.then(message => {
            // Add the message ID to the QOTD
            qotd.messageId = message.id;
            
            // Replace the old QOTD with the new one
            q.queue = q.queue.filter(q => q.messageId !== message.id);
            q.queue.push(qotd);

            quixote.consoleDebug(`Added message ID ${message.id} to QOTD`);
            quixote.consoleDebug(`New queue to write is: ${JSON.stringify(q, null, 4)}`);
            // Write the file back to disk
            fs.writeFileSync(__dirname + '/queueFile.json', JSON.stringify(q, null, 4));
        });
    }

    quixote.consoleDebug('Rendered queue');
    displayQueueAsEmbed(quixote);
}

export function displayQueueAsEmbed(quixote: Quixote): void {
    let q = readQueue(quixote);
    let queue = q.queue;
    let approved = q.approved;

    let embed = SuccessEmbed('Pending QOTD Queue', 'Here\'s the current queue:');
    for (let qotd of queue) {
        embed.addField('QOTD', qotd.content);
        embed.addField('Author', `<@${qotd.authorId}>`);
    }

    let embed2 = SuccessEmbed('Approved QOTDs', 'Here\'s the approved queue:');
    for (let qotd of approved) {
        embed2.addField('QOTD', qotd.content);
        embed2.addField('Author', `<@${qotd.authorId}>`);
    }

    quixote.consoleDebug(`Rendering queue as embed`);
    let queueChannel = quixote.client.channels.cache.get(quixote.getProperty('queueChannelId')) as TextChannel;
    queueChannel.send({ embeds: [embed, embed2] });
}
