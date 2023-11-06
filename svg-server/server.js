const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Require the CORS middleware
const app = express();

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Enable CORS for your React app running on http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's URL
}));

// "svgs" klasörünün yolunu oluşturun
const folderPath = path.join(__dirname, 'svgs');

// Klasörün varlığını kontrol edin ve yoksa oluşturun
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.post('/save-svg', (req, res) => {
  const { svgData, generatedString } = req.body;

  // "generatedstring" verisini kullanarak dosya adı oluşturun
  const fileName = `generated-svg-${generatedString}.svg`;

  // Dosya yolunu oluşturun
  const filePath = path.join(folderPath, fileName);

  // SVG verisini dosyaya kaydedin
  fs.writeFile(filePath, svgData, (err) => {
    if (err) {
      console.error('SVG dosyasını kaydederken bir hata oluştu:', err);
      res.status(500).send('SVG dosyasını kaydederken bir hata oluştu.');
    } else {
      console.log('SVG dosyası başarıyla kaydedildi:', filePath);
      res.status(200).send('SVG dosyası başarıyla kaydedildi.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
