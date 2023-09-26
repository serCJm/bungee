import { Wallet } from "ethers";
import { ChainsType } from "../src/types.js";
import { ProviderManager } from "./chain-data.js";

export class WalletManager {
	static #wallet: Wallet | null = null;
	public static address: string | null = null;

	public static init(privateKey: string | Wallet) {
		if (typeof privateKey === "string") {
			this.#wallet = new Wallet(privateKey);
		} else {
			this.#wallet = privateKey;
		}
		this.address = this.#wallet.address;
	}

	public static getSigner(chain: ChainsType): Wallet {
		if (!this.#wallet) throw new Error("Wallet is not initialized");
		return this.#wallet.connect(ProviderManager.getProvider(chain));
	}
}
