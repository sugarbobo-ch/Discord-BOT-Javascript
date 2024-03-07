// utils/fileUtils.js

const fs = require('fs');

// 讀取檔案的 async function
async function readFileAsync(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }
  catch (err) {
    // 如果檔案不存在或讀取失敗，回傳空的物件
    return {};
  }
}

// 寫入檔案的 async function
async function writeFileAsync(filePath, data) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  readFileAsync,
  writeFileAsync,
};
