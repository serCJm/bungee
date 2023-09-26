import { BigNumber, Contract } from "ethers";
import { logger } from "../logger.js";

type GasFees = {
	maxPriorityFee: number;
	maxFee: number;
};

type GasInfoResponse = {
	safeLow: GasFees;
	standard: GasFees;
	fast: GasFees;
	estimatedBaseFee: number;
	blockTime: number;
	blockNumber: number;
};

type EstimateGasReturnProps = {
	gasLimit?: BigNumber;
	maxPriorityFeePerGas?: BigNumber;
	maxFeePerGas?: BigNumber;
	gasPrice?: BigNumber;
};

export async function estimateGas(
	contract: Contract,
	methodName: string,
	...args: any[]
): Promise<EstimateGasReturnProps> {
	logger.info`### Running estimateGas ###`;

	const provider = contract.provider;

	const block = await provider.getBlock("latest");
	const baseFee = block?.baseFeePerGas;
	const gasPrice = await provider.getGasPrice();

	let maxPriorityFeePerGas = undefined;

	let maxFeePerGas;
	if (baseFee && maxPriorityFeePerGas)
		maxFeePerGas = baseFee.add(maxPriorityFeePerGas);

	const gasLimit = await contract.estimateGas[methodName](...args);

	return {
		...(gasLimit !== undefined && {
			gasLimit: gasLimit.add(BigNumber.from(25000)),
		}),
		...(maxPriorityFeePerGas !== undefined && { maxPriorityFeePerGas }),
		...(maxFeePerGas !== undefined && { maxFeePerGas }),
		...(gasPrice !== undefined && { gasPrice }),
	};
}
