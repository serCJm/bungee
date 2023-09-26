import { providers } from "ethers";
import { ChainsDataType, ChainsType } from "../src/types.js";

export const CHAINS = {
	zkSync: "zksync",
	OP: "optimism",
	Polygon: "polygon",
	BSC: "bsc",
	Base: "base",
	Avalanche: "avalanche",
} as const;
export class ProviderManager {
	static #providers: ChainsDataType = {
		[CHAINS.zkSync]: {
			rpc: "https://rpc.ankr.com/zksync_era",
			explorer: "https://explorer.zksync.io",
			chainId: 324,
		},
		[CHAINS.OP]: {
			rpc: "https://optimism.publicnode.com",
			explorer: "https://optimistic.etherscan.io",
			chainId: 10,
		},
		[CHAINS.Polygon]: {
			rpc: "https://polygon.llamarpc.com",
			explorer: "https://polygonscan.com",
			chainId: 137,
		},
		[CHAINS.BSC]: {
			rpc: "https://rpc.ankr.com/bsc",
			explorer: "https://bscscan.com",
			chainId: 56,
		},
		[CHAINS.Base]: {
			rpc: "https://rpc.ankr.com/base",
			explorer: "https://basescan.org",
			chainId: 8453,
		},
		[CHAINS.Avalanche]: {
			rpc: "https://avalanche-c-chain.publicnode.com",
			explorer: "https://snowtrace.io",
			chainId: 43114,
		},
	};

	static #createProvider(rpc: string): providers.JsonRpcProvider {
		return new providers.JsonRpcProvider(rpc);
	}

	public static getProvider(chain: ChainsType): providers.JsonRpcProvider {
		return this.#createProvider(this.#providers[chain].rpc);
	}

	static getExplorer(chain: ChainsType): string {
		return this.#providers[chain].explorer;
	}

	static getChainId(chain: ChainsType): number {
		return this.#providers[chain].chainId;
	}

	static getExplorerByChainId(chainId: number): string {
		for (let chain in this.#providers) {
			if (this.#providers[chain as ChainsType].chainId === chainId) {
				return this.#providers[chain as ChainsType].explorer;
			}
		}
		throw new Error("Wrong chain Id, no provider found");
	}
}
