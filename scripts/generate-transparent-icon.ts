import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

async function generateTransparentIcon() {
  // 元のPNGファイルが存在しない場合、app/icon.svgから画像を抽出する
  const iconSvgPath = join(process.cwd(), 'app', 'icon.svg');
  const outputPath = join(process.cwd(), 'app', 'icon.svg');

  try {
    // app/icon.svgからbase64データを抽出
    const svgContent = readFileSync(iconSvgPath, 'utf-8');
    
    // base64データを抽出（data:image/png;base64, または href="data:image/png;base64, の形式）
    const base64Match = svgContent.match(/data:image\/png;base64,([^"']+)/);
    if (!base64Match) {
      throw new Error('Could not find base64 image data in icon.svg');
    }
    
    // base64データをバッファに変換
    const pngBuffer = Buffer.from(base64Match[1], 'base64');
    
    // 画像のメタデータを取得
    const metadata = await sharp(pngBuffer).metadata();
    const width = metadata.width || 512;
    const height = metadata.height || 512;

    // 色の定義（緑色と背景グレー）
    const greenColor = { r: 74, g: 222, b: 128 }; // #4ade80
    const bgGrayColor = { r: 245, g: 245, b: 245 }; // #f5f5f5
    const colorTolerance = 30; // 色の許容範囲

    // 色が緑色かどうかを判定する関数
    const isGreen = (r: number, g: number, b: number): boolean => {
      const dr = Math.abs(r - greenColor.r);
      const dg = Math.abs(g - greenColor.g);
      const db = Math.abs(b - greenColor.b);
      return dr < colorTolerance && dg < colorTolerance && db < colorTolerance;
    };

    // 色が背景グレーかどうかを判定する関数
    const isBackgroundGray = (r: number, g: number, b: number): boolean => {
      const dr = Math.abs(r - bgGrayColor.r);
      const dg = Math.abs(g - bgGrayColor.g);
      const db = Math.abs(b - bgGrayColor.b);
      return dr < colorTolerance && dg < colorTolerance && db < colorTolerance;
    };

    // 画像をRGBA形式のrawデータとして取得
    const { data, info } = await sharp(pngBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 各行について、右から左にスキャンして緑からグレーに変わる境界を検出
    const boundaryX: number[] = new Array(height).fill(width); // 各行の境界X座標（デフォルトは右端）

    for (let y = 0; y < height; y++) {
      let foundGreen = false;
      // 右から左にスキャン
      for (let x = width - 1; x >= 0; x--) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        if (isGreen(r, g, b)) {
          foundGreen = true;
        } else if (foundGreen && isBackgroundGray(r, g, b)) {
          // 緑色を見つけた後、グレーに変わった点が境界
          boundaryX[y] = x + 1; // 境界はグレーの開始位置
          break;
        }
      }
    }

    // 境界より外側（右側）を透過させる
    for (let y = 0; y < height; y++) {
      for (let x = boundaryX[y]; x < width; x++) {
        const index = (y * width + x) * 4;
        data[index + 3] = 0; // アルファチャンネルを0に（透明にする）
      }
    }

    // 透過PNGを生成
    const transparentPng = await sharp(data, {
      raw: {
        width,
        height,
        channels: 4, // RGBA
      },
    })
      .png()
      .toBuffer();

    // PNGをbase64エンコード
    const base64Image = transparentPng.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;

    // 透過SVGを作成
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" href="${dataUri}"/>
</svg>`;

    // SVGファイルを保存
    writeFileSync(outputPath, svg);

    console.log(`✅ Transparent icon generated successfully at ${outputPath}`);
    console.log(`   Size: ${width}x${height} pixels`);
    console.log(`   Method: Green to gray boundary detection (right to left scan)`);
    console.log(`   Format: Transparent PNG embedded in SVG`);
  } catch (error) {
    console.error('❌ Error generating transparent icon:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

generateTransparentIcon();

