import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 675;

async function convertImages() {
	try {
		const files = await fs.readdir(process.cwd());
		const jpgFiles = files.filter(
			(file) => path.extname(file).toLowerCase() === '.jpg'
		);

		for (const file of jpgFiles) {
			const inputPath = path.join(process.cwd(), file);
			const outputPath = path.join(
				process.cwd(),
				`${path.parse(file).name}.png`
			);

			await sharp(inputPath)
				.resize(TARGET_WIDTH, TARGET_HEIGHT, {
					fit: 'cover',
					position: 'center',
				})
				.png()
				.toFile(outputPath);

			console.log(
				`Converted ${file} to PNG and resized to ${TARGET_WIDTH}x${TARGET_HEIGHT}`
			);
		}

		console.log('All images processed successfully');
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

convertImages();
