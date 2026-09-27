// public/img/portrait.jpg'den sitenin kullandığı küçük kopyayı üretir: npm run portrait
import sharp from 'sharp';

await sharp('public/img/portrait.jpg').resize({ width: 640 }).webp({ quality: 76 }).toFile('public/img/portrait-640.webp');
console.log('public/img/portrait-640.webp hazır');
