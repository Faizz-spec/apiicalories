// test-upload.js
const uploadToDrive = require('./services/driveUploader');

uploadToDrive('./uploads/Pisang-Cavendish-Lampung-Copy.png', 'Pisang.png')
  .then((url) => {
    console.log('✅ File berhasil diupload ke Google Drive:');
    console.log(url);
  })
  .catch((err) => {
    console.error('❌ Gagal upload:', err.message);
  });
