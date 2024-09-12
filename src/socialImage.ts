import sharp from 'sharp';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
	console.error('Please provide an input file path');
	process.exit(1);
}

const fileExtension = path.extname(inputPath).toLowerCase();
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif'];

if (!supportedExtensions.includes(fileExtension)) {
	console.error(
		`This script works with ${supportedExtensions.join(', ')} files`
	);
	process.exit(1);
}

let outputFileName;
if (fileExtension === '.png') {
	outputFileName = `${path.basename(
		inputPath,
		fileExtension
	)}-resized${fileExtension}`;
} else {
	outputFileName = path.basename(inputPath);
}

const outputPath = path.join(path.dirname(inputPath), outputFileName);

let imageProcess = sharp(inputPath);

if (fileExtension === '.png') {
	imageProcess = imageProcess.resize(1200, 675);
} else {
	imageProcess = imageProcess.resize(1200, 675).png();
}

imageProcess
	.toFile(outputPath)
	.then(() => {
		console.log(`Processed and saved: ${outputPath}`);
	})
	.catch((err) => console.error('Error processing image:', err));
