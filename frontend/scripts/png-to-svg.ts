import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

async function convertPngToSvg() {
  const pngPath = join(process.cwd(), 'public', 'Gemini_Generated_Image_idynmnidynmnidyn.png');
  const outputPath = join(process.cwd(), 'public', 'logo-from-png.svg');

  try {
    // PNG画像を読み込む
    const pngBuffer = readFileSync(pngPath);
    
    // 画像のメタデータを取得（サイズなど）
    const metadata = await sharp(pngBuffer).metadata();
    const width = metadata.width || 512;
    const height = metadata.height || 512;

    // PNGをbase64エンコード
    const base64Image = pngBuffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;

    // SVGを作成（画像を埋め込む）
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="${dataUri}"/>
</svg>`;

    // SVGファイルを保存
    writeFileSync(outputPath, svg);

    console.log(`✅ SVG generated successfully at ${outputPath}`);
    console.log(`   Original size: ${width}x${height} pixels`);
    console.log(`   Format: Embedded PNG in SVG`);
  } catch (error) {
    console.error('❌ Error converting PNG to SVG:', error);
    process.exit(1);
  }
}

convertPngToSvg();

