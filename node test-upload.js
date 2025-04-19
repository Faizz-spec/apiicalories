const uploadToDrive = require('./services/driveUploader');

uploadToDrive('./uploads/test.jpg', 'test.jpg')
  .then((url) => {
    console.log('✅ Gambar berhasil diupload ke:', url);
  })
  .catch((err) => {
    console.error('❌ Gagal upload:', err.message);
  });
