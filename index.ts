import { Client, Intents, ClientOptions } from 'discord.js';
import 'colorts/lib/string';
import color from 'colorts';

require('dotenv').config();

class Quixote extends Client {
  public readonly client: Client;

  constructor(options: ClientOptions) {
    let client: any = super(options);
    this.client = client; // Ahhh it hurts

    this.client.on('ready', () => {
        console.log('QUIXOTE'.blue + ": " + " Online".green);
    });
  }
}

let quixote = new Quixote({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });;

quixote.login(process.env.DISCORD_TOKEN);