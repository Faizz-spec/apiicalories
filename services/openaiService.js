const fs = require('fs');
const path = require('path');
const axios = require('axios');

function getOpenAIKey() {
  const file = path.join(__dirname, '../credential.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return json.openai_api_key;
}

exports.detectFood = async (imagePath) => {
  const apiKey = getOpenAIKey();

  // 🔥 Convert image ke base64
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Gambar ini makanan apa kira kira berapa gram beratnya dan berapa estimasi kalorinya (dalam angka saja)?'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // 🔍 Coba ambil angka kalori dari teks (misal "105", "300 kcal", dll)
    const match = content.match(/([0-9]{2,5})\s*(kcal|kalori)?/i);
    const estimatedCalories = match ? parseInt(match[1]) : null;
    
    return {
      label: content,
      calories: estimatedCalories,
      raw: content
    };
    
  } catch (error) {
    console.error('❌ GPT ERROR:', error.response?.data || error.message);
    return {
      label: '[ERROR] Gagal menghubungi GPT',
      calories: null,
      raw: '[GPT tidak merespon atau format base64 tidak valid]'
    };
  }
};
