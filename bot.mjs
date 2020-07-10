import dotenv from "dotenv";
import tmi from "tmi.js";

import { init } from "./cli.mjs";

dotenv.config();

const client = new tmi.client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
});

client.on("connected", onConnectedHandler);
client.on("message", onMessageHandler);
client.connect();

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

async function onMessageHandler(target, context, msg, self) {
  if (self) {
    // Ignore messages from the bot
    return;
  }

  init(msg, (out) => client.say(target, out));
}
