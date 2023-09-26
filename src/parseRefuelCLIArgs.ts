import yargs, { Arguments } from "yargs";
import { CHAINS } from "../data/chain-data.js";
import { RefuelCLIArgs } from "./types.js";

export function parseRefuelCLIArgs(): Arguments<RefuelCLIArgs> {
	const args = yargs(process.argv.slice(2))
		.options({
			wallet: {
				alias: "w",
				description: "Specify the wallet name",
				type: "string",
				demandOption: true, // This makes the argument required
			},
			"from-network": {
				alias: "fn",
				description: "Specify the network to send from",
				type: "string",
				demandOption: true,
				choices: Object.values(CHAINS),
			},
			amount: {
				alias: "fa",
				description:
					"Optional. Specify the amount of the token to send. Otherwise, random small value is used",
				type: "string",
				demandOption: false,
			},
			"to-network": {
				alias: "tn",
				description:
					"Specify the network to send to, or 'all' to send to all available networks in random order",
				type: "string",
				demandOption: true,
				choices: [...Object.values(CHAINS), "all" as const],
			},
		})
		.help()
		.alias("help", "h")
		.parseSync() as RefuelCLIArgs;

	return args;
}
