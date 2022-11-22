import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import BigNumber from "bignumber.js";
import { ERC20_DECIMALS } from "./constants";

const projectId = '2Hg4SbgdyjXFLmFIANyGlVQhYCV';
const projectSecret = '702ab90817e45dcd762fe53ee9c22475';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  'base64',
)}`;

const client = ipfsHttpClient({
	host: "ipfs.infura.io",
	port: 5001,
	protocol: "https",
	apiPath: "/api/v0",
	headers: {
		authorization: auth,
	},
});

// mint an NFT
export const createNft = async (
	minterContract,
	performActions,
	{ name, description, image, price }
) => {
	await performActions(async (kit) => {
		if (!name || !description || !image) return;
		const { defaultAccount } = kit;

		// convert NFT metadata to JSON format
		const data = JSON.stringify({
			name,
			description,
			image,
		});
		try {
			price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();

			// save NFT metadata to IPFS
			const added = await client.add(data);

			// IPFS url for uploaded metadata
			const url = `https://pugb.infura-ipfs.io/ipfs/${added.path}`;

			// mint the NFT and save the IPFS url to the blockchain
			let transaction = await minterContract.methods
				.mintCard(url, price)
				.send({ from: defaultAccount });

			return transaction;
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	});
};

// function to upload a file to IPFS
export const uploadToIpfs = async (e) => {
	const file = e.target.files[0];
	if (!file) return;
	try {
		const added = await client.add(file, {
			progress: (prog) => console.log(`received: ${prog}`),
		});
		return `https://pugb.infura-ipfs.io/ipfs/${added.path}`;
	} catch (error) {
		console.log("Error uploading file: ", error);
	}
};

// fetch all NFTs on the smart contract
export const getNfts = async (minterContract) => {
	try {
		const _nfts = await minterContract.methods.getCards().call();
		const nfts = await Promise.all(
			_nfts.map(async (card) => {
				// prevents retrieval of data for deleted cards
				if (
					card.owner === "0x0000000000000000000000000000000000000000"
				) {
					return;
				}
				const tokenUri = await minterContract.methods
					.tokenURI(card.index)
					.call();
				const meta = await fetchNftMeta(tokenUri);
				return {
					tokenId: Number(card.index),
					price: new BigNumber(card.price),
					owner: card.owner,
					onSale: card.onSale,
					name: meta.data.name,
					description: meta.data.description,
					image: meta.data.image,
				};
			})
		);
		return nfts;
	} catch (e) {
		console.log({ e });
	}
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
	try {
		if (!ipfsUrl) return null;
		const meta = await axios.get(ipfsUrl);
		return meta;
	} catch (e) {
		console.log({ e });
	}
};

export const buyCard = async (minterContract, performActions, index, price) => {
	try {
		await performActions(async (kit) => {
			const { defaultAccount } = kit;
			await minterContract.methods
				.buyCard(index)
				.send({ from: defaultAccount, value: price });
		});
	} catch (error) {
		console.error({ error });
	}
};

export const sellCard = async (
	minterContract,
	performActions,
	index,
	price
) => {
	try {
		price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();
		await performActions(async (kit) => {
			const { defaultAccount } = kit;
			await minterContract.methods
				.sellCard(index, price)
				.send({ from: defaultAccount });
		});
	} catch (error) {
		console.error({ error });
	}
};

export const unlistCard = async (minterContract, performActions, index) => {
	try {
		await performActions(async (kit) => {
			const { defaultAccount } = kit;
			await minterContract.methods
				.unlistCard(index)
				.send({ from: defaultAccount });
		});
	} catch (error) {
		console.error({ error });
	}
};

export const deleteCard = async (minterContract, performActions, index) => {
	try {
		await performActions(async (kit) => {
			const { defaultAccount } = kit;
			await minterContract.methods
				.deleteCard(index)
				.send({ from: defaultAccount });
		});
	} catch (error) {
		console.error({ error });
	}
};
