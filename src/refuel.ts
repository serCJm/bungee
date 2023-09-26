import { ethers } from "ethers";
import { WalletManager } from "./../data/wallet-data.js";

import { setTimeout } from "timers/promises";
import { CHAINS, ProviderManager } from "../data/chain-data.js";
import { RefuelContractManager } from "../data/refuel-data.js";
import { parseRefuelCLIArgs } from "./parseRefuelCLIArgs.js";
import { ChainsType, RefuelCLIArgs } from "./types.js";
import { logger } from "./utils/logger.js";
import { randomFloat, shuffleArr } from "./utils/utils.js";
import { sendTransaction } from "./utils/web3/sendTransaction.js";

const AMOUNT_MIN = 0.001;
const AMOUNT_MAX = 0.0015;

async function refuel(
	fromNetwork: ChainsType,
	toNetwork: ChainsType,
	amount?: string
) {
	try {
		logger.info`### Starting refuel ###`;

		const refuelContract = RefuelContractManager.getContract(
			fromNetwork
		).connect(WalletManager.getSigner(fromNetwork));

		const txArgs = {
			chainID: ProviderManager.getChainId(toNetwork),
			wallet: WalletManager.address,
		};

		const value = ethers.utils.parseEther(
			amount || randomFloat(AMOUNT_MIN, AMOUNT_MAX, 4).toString()
		);

		const message = `refuel ${ethers.utils.formatEther(
			value
		)} ETH to ${toNetwork}`;

		await sendTransaction(
			refuelContract,
			"depositNativeToken",
			message,
			value,
			txArgs
		);
	} catch (err) {
		logger.error`Error in refuel: ${err}`;
	}
}

export async function processRefuel() {
	try {
		const { fromNetwork, amount, toNetwork } =
			parseRefuelCLIArgs() as RefuelCLIArgs;
		if (toNetwork === "all") {
			const toNetworks = shuffleArr(
				Object.values(CHAINS).filter((chain) => chain !== fromNetwork)
			);

			for (const network of toNetworks) {
				await refuel(fromNetwork, network, amount);
				await setTimeout(3000);
			}
		} else {
			await refuel(fromNetwork, toNetwork, amount);
		}
	} catch (err) {
		logger.error`Error in processChainIDs: ${err}`;
	}
}
