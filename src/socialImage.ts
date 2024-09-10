import sharp from 'sharp';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
	console.error('Please provide an input file path');
	process.exit(1);
}

const fileExtension = path.extname(inputPath).toLowerCase();
if (fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
	console.error('This script only works with JPG/JPEG files');
	process.exit(1);
}

const outputPath = path.join(
	path.dirname(inputPath),
	`${path.basename(inputPath, fileExtension)}.png`
);

sharp(inputPath)
	.resize(1200, 675)
	.png()
	.toFile(outputPath)
	.then(() => {
		console.log(`Converted and saved: ${outputPath}`);
	})
	.catch((err) => console.error('Error processing image:', err));
