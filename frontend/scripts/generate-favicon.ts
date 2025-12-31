import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function generateFavicon() {
  const svgPath = join(process.cwd(), 'public', 'logo-from-png.svg');
  const outputPath = join(process.cwd(), 'app', 'favicon.ico');

  try {
    // SVGを読み込む
    const svgBuffer = readFileSync(svgPath);

    // RGBA形式で32x32のPNGを生成（アルファチャンネル付き）
    // Next.jsのfavicon.icoはRGBA形式のPNGを期待している
    const image = sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 245, g: 245, b: 245, alpha: 1 },
      })
      .ensureAlpha(); // アルファチャンネルを確実に含める

    // メタデータを確認してRGBA形式であることを確認
    const metadata = await image.metadata();
    console.log(`Image format: ${metadata.format}, channels: ${metadata.channels}`);

    // PNG形式でRGBA（4チャンネル）を強制
    const pngBuffer = await image
      .toFormat('png', {
        quality: 100,
        compressionLevel: 9,
        palette: false, // パレットモードを無効にしてRGBA形式を強制
      })
      .toBuffer();

    // ICOファイルとして保存
    // Next.jsはfavicon.icoとしてPNGも受け付けますが、
    // より良い互換性のためにRGBA形式のPNGを.ico拡張子で保存
    writeFileSync(outputPath, pngBuffer);

    console.log(`✅ Favicon generated successfully at ${outputPath}`);
    console.log(`   Size: 32x32 pixels, Format: RGBA PNG`);
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();

