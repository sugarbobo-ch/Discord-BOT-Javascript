// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { handleCommand } = require('./features/customCommands');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!')) {
    try {
      const replyMessage = await handleCommand(message);
      if (replyMessage) {
        message.reply(replyMessage);
      }
    }
    catch (err) {
      console.error(err);
      message.reply('發生錯誤，指令處理失敗。');
    }
  }
});

client.on(Events.MessageDelete, (message) => {
  if (message.author.bot) return;

  console.log(`${message.author.username}刪除了${message.content}`);
  message.channel.send('收回怪抓到!!');
});

client.on(Events.MessageUpdate, (message) => {
  if (message.author.bot) return;

  console.log(
    `${message.author.username}更新了${message.content}改為${message.reactions.message.content}`,
  );
  message.channel.send(`${message.author.username} 還想偷改啊`);
});

// Log in to Discord with your client's token
client.login(token);
