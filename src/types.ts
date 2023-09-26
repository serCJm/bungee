import { Wallet } from "ethers";
import { CHAINS } from "../data/chain-data.js";

// ALL CHAINS

export type ChainsType = (typeof CHAINS)[keyof typeof CHAINS];
export type ChainsTypeKey = keyof typeof CHAINS;
export type ChainsData = {
	rpc: string;
	explorer: string;
	chainId: number;
};
export type ChainsDataType = Record<ChainsType, ChainsData>;

// Refuel Contracts
export type RefuelContractsType = (typeof CHAINS)[keyof typeof CHAINS];
export type RefuelContractsTypeKey = keyof typeof CHAINS;
export type RefuelContractsData = {
	address: string;
};
export type RefuelContractsDataType = Record<
	RefuelContractsType,
	RefuelContractsData
>;

// MISC
export type WalletHDData = {
	name: number;
	address: string;
	signer: Wallet;
};

export type WalletData = {
	name: string;
	privateKey: string;
};

// MODULES
export type ModuleConfigType = {
	fn: Function;
	ENABLED: boolean;
	[key: string]: any;
};

export type RefuelCLIArgs = {
	wallet: string;
	fromNetwork: ChainsType;
	amount?: string;
	toNetwork: ChainsType | "all";
	_: string[];
	$0: string;
};
