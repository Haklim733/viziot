import { describe, it } from 'vitest';
import { generateARVisionData, generateUniqueToken } from './simulator';

describe('generateARVisionData', () => {
	it('should output all telemetry needed', async () => {
		let data = await generateARVisionData('testDeivceId');
		let b64Str = btoa(JSON.stringify(data));
		// const buffer = Buffer.from(b64Str, 'base64');
		// console.log(buffer)
		// const decoder = new TextDecoder('utf-8');
		// const decodedString = decoder.decode(buffer);
		// console.log(decodedString);
	});
});

describe('generateToken', () => {
	it('test', async () => {
		const uniqueToken = generateUniqueToken();
		console.log(uniqueToken);
	});
});