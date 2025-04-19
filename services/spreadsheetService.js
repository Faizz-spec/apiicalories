const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 🔑 Load credential dari credential.json
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credential.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const spreadsheetId = '1-EUzStIb77sbicummGl1vintB0IA2dLTvRHXdlzZ3QQ';
const sheetName = 'DataKalori';

exports.appendData = async ({ user_id, image_url, label, calories }) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const timestamp = new Date().toISOString(); // 🕒
    const values = [[user_id, image_url, label, calories, timestamp]];
    const resource = { values };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:E`, // sekarang pakai kolom A-E
      valueInputOption: 'USER_ENTERED',
      resource
    });

    console.log('✅ Data berhasil ditambahkan ke Spreadsheet.');
  } catch (err) {
    console.error('❌ Gagal nulis ke spreadsheet:', err.message);
  }
};
