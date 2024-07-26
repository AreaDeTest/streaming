import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const inputDir = path.join(__dirname, 'public/images');
const outputDir = path.join(__dirname, 'public/optimized-images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach((file: string) => {
  const inputFilePath = path.join(inputDir, file);
  const outputFilePath = path.join(outputDir, file);

  if (/\.(svg)$/.test(file)) {
    // Otimização de SVG com svgo
    const svg = fs.readFileSync(inputFilePath, 'utf-8');
    const result = optimize(svg, { path: inputFilePath });
    fs.writeFileSync(outputFilePath, result.data);
    console.log(`SVG otimizado: ${file}`);
  } else if (/\.(jpg|jpeg)$/.test(file)) {
    // Otimização de JPEG
    sharp(inputFilePath)
      .resize(800)
      .jpeg({
        quality: 80,
        mozjpeg: true
      })
      .toFile(outputFilePath, (err: Error, info: sharp.OutputInfo) => {
        if (err) {
          console.error(`Erro ao otimizar ${file} para JPEG:`, err);
        } else {
          console.log(`Imagem otimizada ${file} para JPEG:`, info);
        }
      });
  } else if (/\.(png)$/.test(file)) {
    // Otimização de PNG
    sharp(inputFilePath)
      .resize(800)
      .png({
        compressionLevel: 9, // Nível de compressão (0-9), onde 9 é a maior compressão
        adaptiveFiltering: true, // Usa filtragem adaptativa para melhorar a compressão
        quality: 80 // Qualidade para PNG (0-100), onde 100 é a melhor qualidade
      })
      .toFile(outputFilePath, (err: Error, info: sharp.OutputInfo) => {
        if (err) {
          console.error(`Erro ao otimizar ${file} para PNG:`, err);
        } else {
          console.log(`Imagem otimizada ${file} para PNG:`, info);
        }
      });
  } else if (/\.(webp)$/.test(file)) {
    // Otimização de WebP
    sharp(inputFilePath)
      .resize(800)
      .webp({
        quality: 80
      })
      .toFile(outputFilePath, (err: Error, info: sharp.OutputInfo) => {
        if (err) {
          console.error(`Erro ao otimizar ${file} para WebP:`, err);
        } else {
          console.log(`Imagem otimizada ${file} para WebP:`, info);
        }
      });
  }
});
