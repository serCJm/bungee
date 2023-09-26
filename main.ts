import { config } from "./config.js";
import { WalletManager } from "./data/wallet-data.js";
import { parseRefuelCLIArgs } from "./src/parseRefuelCLIArgs.js";
import { processRefuel } from "./src/refuel.js";
import { RefuelCLIArgs, WalletData, WalletHDData } from "./src/types.js";
import { countdownTimer } from "./src/utils/countdownTimer.js";
import { getWallets } from "./src/utils/db.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { logger } from "./src/utils/logger.js";
import { shuffleArr } from "./src/utils/utils.js";

const { EXCLUDED_WALLETS } = config;
const excludedWalletsSet = new Set(EXCLUDED_WALLETS);

process.on("unhandledRejection", (reason, promise) => {
	if (reason instanceof Error) {
		errorHandler(reason);
	} else {
		console.error("Unhandled Rejection at:", promise, "reason:", reason);
	}
});

async function processWallet(walletData: WalletHDData | WalletData) {
	let wallet;
	let name;
	if ("signer" in walletData) {
		({ name, signer: wallet } = walletData);
	} else {
		({ name, privateKey: wallet } = walletData);
	}

	WalletManager.init(wallet);
	const address = WalletManager.address;

	logger.setCustomPrepend(`[Name: ${name}][${address}]`);

	await processRefuel();

	logger.success`Task completed, waiting for next wallet...`;
}

async function processWallets(wallets: WalletHDData[] | WalletData[]) {
	for (let i = 0; i < wallets.length; i++) {
		const wallet = wallets[i];
		if (excludedWalletsSet.has(+wallet.name)) {
			logger.info`Skipping wallet ${wallet.name} as it's in the excluded list.`;
			continue;
		}
		await processWallet(wallet);
		if (wallets[i + 1]) await countdownTimer(120, 240);
	}
	logger.success`Automation job completed`;
}

async function main() {
	const { wallet } = parseRefuelCLIArgs() as RefuelCLIArgs;
	const wallets = shuffleArr((await getWallets(wallet)) ?? []);
	// const wallets: WalletData[] = shuffleArr(config.SECRET_WALLET_DATA ?? []);

	if (wallets.length === 0) throw new Error("Wallets array is empty");

	// const filWallets = wallets.filter((wallet) => [wallet].includes(wallet.name));
	await processWallets(wallets);

	process.exit(0);
}

main();
