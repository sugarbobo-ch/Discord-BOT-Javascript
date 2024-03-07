// features/customCommands.js

const { readFileAsync, writeFileAsync } = require('../utils/fileUtils');

const cache = {}; // 快取所有伺服器的指令

async function addCommand(guildId, commandName, replyMessage) {
  const commands = await getCommands(guildId);

  const lowercaseCommandName = commandName.toLowerCase();
  if (['add', 'edit', 'remove'].includes(lowercaseCommandName)) {
    return '禁止使用保留關鍵字作為指令名稱。';
  }

  if (!commandName || !replyMessage) {
    return '請使用正確的格式：!add [指令名稱] [回覆內容]';
  }

  commands[lowercaseCommandName] = replyMessage;
  await saveCommands(guildId, commands);

  return `已新增指令「${lowercaseCommandName}」，回覆訊息為：${replyMessage}`;
}

async function editCommand(guildId, commandName, replyMessage) {
  const commands = await getCommands(guildId);

  const lowercaseCommandName = commandName.toLowerCase();
  if (!commands[lowercaseCommandName]) {
    return `找不到指令「${commandName}」，請先使用 !add 新增指令。`;
  }

  if (!replyMessage) {
    return '請設定回覆訊息：!edit [指令名稱] [回覆內容]';
  }

  commands[lowercaseCommandName] = replyMessage;
  await saveCommands(guildId, commands);

  return `已編輯指令「${lowercaseCommandName}」的回覆訊息為：${replyMessage}`;
}

async function removeCommand(guildId, commandName) {
  const commands = await getCommands(guildId);

  const lowercaseCommandName = commandName.toLowerCase();
  if (!commands[lowercaseCommandName]) {
    return `找不到指令「${commandName}」，請先使用 !add 新增指令。`;
  }

  delete commands[lowercaseCommandName];
  await saveCommands(guildId, commands);

  return `已刪除指令「${lowercaseCommandName}」`;
}

async function getCommands(guildId) {
  if (!cache[guildId]) {
    try {
      const filePath = `server/${guildId}.json`;
      const data = await readFileAsync(filePath);
      cache[guildId] = data || {};
    }
    catch (err) {
      console.error(err);
      cache[guildId] = {};
    }
  }

  return cache[guildId];
}

async function saveCommands(guildId, commands) {
  try {
    const filePath = `server/${guildId}.json`;
    await writeFileAsync(filePath, commands);
    cache[guildId] = commands;
  }
  catch (err) {
    console.error(err);
  }
}

async function processCustomCommand(guildId, command) {
  const lowercaseCommand = command.toLowerCase();
  const commands = await getCommands(guildId);

  if (commands[lowercaseCommand]) {
    return commands[lowercaseCommand];
  }
  else {
    return '無效的指令！請使用 !add、!edit 或 !remove 來管理指令。';
  }
}

async function handleCommand(message) {
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const guildId = message.guild.id;

  if (['add', 'edit', 'remove'].includes(command)) {
    if (command === 'add') {
      const commandName = args.shift();
      const replyMessage = args.join(' ');
      return await addCommand(guildId, commandName, replyMessage);
    }
    else if (command === 'edit') {
      const commandName = args.shift();
      const replyMessage = args.join(' ');
      return await editCommand(guildId, commandName, replyMessage);
    }
    else if (command === 'remove') {
      const commandName = args.shift();
      return await removeCommand(guildId, commandName);
    }
  }
  else {
    return await processCustomCommand(guildId, command);
  }
}

module.exports = {
  addCommand,
  editCommand,
  removeCommand,
  handleCommand,
};
