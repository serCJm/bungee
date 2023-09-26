import { BigNumber, BigNumberish, Contract } from "ethers";
import { logger } from "../logger.js";
import { estimateGas } from "./estimateGas.js";
import { getTransactionState } from "./getTransactionState.js";

export async function sendTransaction(
	contract: Contract,
	methodName: string,
	message: string,
	value: BigNumberish = BigNumber.from(0),
	...txParams: any[]
) {
	logger.info`### Starting sendTransaction ###`;
	let txArgs = txParams;
	if (txParams.length === 1) {
		if (Array.isArray(txParams[0])) {
			txArgs = txParams[0];
		} else if (typeof txParams[0] === "object") {
			txArgs = Object.values(txParams[0]);
		}
	}
	const gas = await estimateGas(contract, methodName, ...txArgs, {
		value,
	});

	logger.info`### Sending transaction ###`;
	const swapTx = await contract[methodName](...txArgs, {
		...gas,
		value,
	});

	const receipt = await getTransactionState(swapTx, message);

	return receipt;
}
