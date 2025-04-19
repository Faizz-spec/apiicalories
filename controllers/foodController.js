const openaiService = require('../services/openaiService');
const foodModel = require('../models/foodModel');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const sheetService = require('../services/spreadsheetService'); // ✅

exports.scanFood = async (req, res) => {
  console.log('🔥 REQUEST MASUK'); // <--- Tambahan log

  try {
    const userId = req.body.userId;
    const image = req.files.image;

    const hash = crypto.createHash('sha256').update(image.data).digest('hex');
    const existing = foodModel.findByHash(userId, hash);
    if (existing) return res.json(existing);

    const uploadPath = path.join(__dirname, '../uploads', image.name);
    await image.mv(uploadPath);

    const result = await openaiService.detectFood(uploadPath);

    const saved = foodModel.save(userId, image.name, hash, {
      label: result.label,
      calories: result.calories,
      raw: result.raw
    });

    // ✅ Simpan ke spreadsheet juga
    await sheetService.appendData({
      user_id: userId,
      image_url: `/uploads/${image.name}`,
      label: result.label,
      calories: result.calories
    });

    res.json(saved);
  } catch (err) {
    console.error('❌ Error di controller:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFoods = (req, res) => {
  const foods = foodModel.getAllByUser(req.params.userId);
  res.json(foods);
};
