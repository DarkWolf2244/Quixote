import * as fs from 'fs';
import { QOTDQueue } from './interfaces';

export function addQOTD(content: string, authorId: string): void {
    let queueFile: QOTDQueue = JSON.parse(fs.readFileSync(__dirname + '/queueFile.json', 'utf8'));
    queueFile.queue.push({ content: content, authorId: authorId });
    fs.writeFileSync(__dirname + '/queueFile.json', JSON.stringify(queueFile, null, 4));
}