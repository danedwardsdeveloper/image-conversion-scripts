const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const MAX_SIZE = 20000;
const DESKTOP_PATH = path.join(require('os').homedir(), 'Desktop');
const OUTPUT_FOLDER = path.join(DESKTOP_PATH, 'converted_images');

async function convertAndResizeImage(inputPath, outputPath) {
	try {
		const image = sharp(inputPath);
		const metadata = await image.metadata();

		let width, height;
		if (metadata.width > metadata.height) {
			if (metadata.width > MAX_SIZE) {
				width = MAX_SIZE;
				height = Math.round((MAX_SIZE * metadata.height) / metadata.width);
			} else {
				width = metadata.width;
				height = metadata.height;
			}
		} else {
			if (metadata.height > MAX_SIZE) {
				height = MAX_SIZE;
				width = Math.round((MAX_SIZE * metadata.width) / metadata.height);
			} else {
				width = metadata.width;
				height = metadata.height;
			}
		}

		await image.resize(width, height).webp().toFile(outputPath);

		console.log(`Converted and resized: ${path.basename(inputPath)}`);
	} catch (error) {
		console.error(`Error processing ${inputPath}:`, error);
	}
}

async function processDesktopImages() {
	try {
		await fs.mkdir(OUTPUT_FOLDER, { recursive: true });

		const files = await fs.readdir(DESKTOP_PATH);
		const supportedFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];

		for (const file of files) {
			const ext = path.extname(file).toLowerCase();
			if (supportedFormats.includes(ext)) {
				const inputPath = path.join(DESKTOP_PATH, file);
				const outputPath = path.join(
					OUTPUT_FOLDER,
					`${path.parse(file).name}.webp`
				);
				await convertAndResizeImage(inputPath, outputPath);
			}
		}

		console.log('All images processed.');
	} catch (error) {
		console.error('Error processing images:', error);
	}
}

processDesktopImages();
