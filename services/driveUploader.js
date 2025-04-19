// services/driveUploader.js
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const mime = require('mime-types');

const credential = JSON.parse(fs.readFileSync(path.join(__dirname, '../credential.json'), 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: credential,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = '1FUAgr3Vtki6jhnTWHU65imncclqyoShb'; // Ganti sesuai folder kamu

async function uploadToDrive(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: mime.lookup(filePath),
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });

  const fileId = file.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}

module.exports = uploadToDrive;
