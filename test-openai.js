const fs = require('fs');
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY; // pastikan tidak undefined

const imagePath = 'test.jpeg'; // pastikan file ini ada
const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

async function testImage() {
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Gambar ini makanan apa dan kira-kira berapa kalorinya?' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'high' } }
          ]
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Jawaban GPT:\n', res.data.choices[0].message.content);
  } catch (err) {
    console.error('❌ GPT Error:', err.response?.data || err.message);
  }
}

testImage();
