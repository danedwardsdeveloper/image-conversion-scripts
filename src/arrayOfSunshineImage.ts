import sharp from 'sharp';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
	console.error('Please provide an input file path');
	process.exit(1);
}

const fileExtension = path.extname(inputPath).toLowerCase();
const allowedExtensions = [
	'.jpg',
	'.jpeg',
	'.png',
	'.webp',
	'.tiff',
	'.gif',
	'.svg',
];
if (!allowedExtensions.includes(fileExtension)) {
	console.error(
		`This script works with the following formats: ${allowedExtensions.join(
			', '
		)}`
	);
	process.exit(1);
}

const outputPath = path.join(
	path.dirname(inputPath),
	`${path.basename(inputPath, fileExtension)}.webp`
);

sharp(inputPath)
	.metadata()
	.then((metadata) => {
		const width = metadata.width || 0;
		const height = metadata.height || 0;
		const aspectRatio = width / height;

		const newWidth = Math.min(width, 576);
		const newHeight = Math.round(newWidth / aspectRatio);

		return sharp(inputPath)
			.resize(newWidth, newHeight)
			.webp({ quality: 100 })
			.toFile(outputPath);
	})
	.then(() => {
		console.log(`Converted and saved: ${outputPath}`);
	})
	.catch((err) => console.error('Error processing image:', err));
