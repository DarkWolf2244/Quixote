import { Quixote } from './interfaces';
import { ErrorEmbed } from './EmbedTemplates';
import { TextChannel } from 'discord.js';

let qJSON = require('./queue.json');
let q = qJSON.queue;

let lastQ = q;
