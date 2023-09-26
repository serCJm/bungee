import { getAddress } from "ethers/lib/utils.js";
import { Contract } from "zksync-web3";
import { ChainsType, RefuelContractsDataType } from "../src/types.js";
import { CHAINS } from "./chain-data.js";

export class RefuelContractManager {
	static #abi = [
		"function depositNativeToken(uint256 destinationChainId, address _to) payable",
	];
	static #contracts: RefuelContractsDataType = {
		[CHAINS.zkSync]: {
			address: "0x7Ee459D7fDe8b4a3C22b9c8C7aa52AbadDd9fFD5",
		},
		[CHAINS.OP]: {
			address: "0x5800249621DA520aDFdCa16da20d8A5Fc0f814d8",
		},
		[CHAINS.Polygon]: {
			address: "0xAC313d7491910516E06FBfC2A0b5BB49bb072D91",
		},
		[CHAINS.BSC]: {
			address: "0xBE51D38547992293c89CC589105784ab60b004A9",
		},
		[CHAINS.Base]: {
			address: "",
		},
		[CHAINS.Avalanche]: {
			address: "",
		},
	};

	static getContract(chain: ChainsType): Contract {
		return new Contract(
			getAddress(this.#contracts[chain].address),
			this.#abi
		);
	}

	static getAddress(chain: ChainsType): string {
		return getAddress(this.#contracts[chain].address);
	}
}
