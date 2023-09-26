import { ethers } from "ethers";
import { Result } from "ethers/lib/utils.js";
import { appendFile } from "fs/promises";
import { logger } from "./logger.js";

export function randomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloat(min: number, max: number, decimals: number) {
	const str = (Math.random() * (max - min) + min).toFixed(decimals);
	return parseFloat(str);
}

export function shuffleArr([...arr]: any[]) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export async function logToFile(
	message: string,
	filePath: string
): Promise<void> {
	try {
		await appendFile(filePath, message + "\n");
	} catch (error) {
		console.error(`Error writing to file: ${error}`);
	}
}

export function getKeyByValue(
	object: { [key: string]: any },
	value: any
): string {
	for (let [key, val] of Object.entries(object)) {
		if (typeof value === "object" && value !== null) {
			// for objects, perform a deep comparison
			if (JSON.stringify(val) === JSON.stringify(value)) {
				return key;
			}
		} else {
			// for primitive values, perform a direct comparison
			if (val === value) {
				return key;
			}
		}
	}
	throw new Error("Value is not a key of provided object");
}

export function getRandomIndex(length: number, exclude?: number): number {
	let index;
	do {
		index = Math.floor(Math.random() * length);
	} while (index === exclude);
	return index;
}

export function getDeadline(minutes: number): number {
	return Math.floor(Date.now() / 1000) + 60 * minutes;
}

export function decodeABI(typesArr: string[], hexData: string): Result {
	const abiCoder = new ethers.utils.AbiCoder();
	const decodedInput = abiCoder.decode(typesArr, hexData);
	console.log(decodedInput);
	return decodedInput;
}

export function encodeABI(typesArr: string[], data: any[]): string {
	logger.info`### Starting encodeABI ###`;
	const abiCoder = new ethers.utils.AbiCoder();
	const decodedInput = abiCoder.encode(typesArr, data);
	return decodedInput;
}

export function decodeFunctionData(
	abi: any,
	functionName: string,
	hexData: string
) {
	logger.info`### Starting decodeFunctionData ###`;
	const contractInterface = new ethers.utils.Interface(abi);
	const decoded = contractInterface.decodeFunctionData(functionName, hexData);
	console.log(decoded);
	return decoded;
}
