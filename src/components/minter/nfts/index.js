import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddCard from "./AddCard";
import PubgCard from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
	getNfts,
	createNft,
	buyCard,
	sellCard,
	unlistCard,
	deleteCard,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const Cards = ({ minterContract, updateBalance, name }) => {
	
	const { performActions, address } = useContractKit();
	const [nfts, setNfts] = useState([]);
	const [loading, setLoading] = useState(false);

	const getAssets = useCallback(async () => {
		try {
			setLoading(true);

			const allNfts = await getNfts(minterContract);
			if (!allNfts) return;
			setNfts(allNfts);
		} catch (error) {
			console.log({ error });
		} finally {
			setLoading(false);
		}
	}, [minterContract]);

	const addNft = async (data) => {
		try {
			setLoading(true);

			await createNft(minterContract, performActions, data);
			toast(<NotificationSuccess text="pubg NFT added successfully." />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to add pubg NFT." />);
		} finally {
			setLoading(false);
		}
	};

	const buyNft = async (index, price) => {
		try {
			setLoading(true);
			await buyCard(minterContract, performActions, index, price);
			toast(<NotificationSuccess text="pubg NFT bought successfully" />);
			getAssets();
			updateBalance();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to purchase pubg NFT" />);
		} finally {
			setLoading(false);
		}
	};

	const sellNft = async (index, price) => {
		try {
			setLoading(true);
			await sellCard(minterContract, performActions, index, price);
			toast(<NotificationSuccess text="Buying card...." />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to buy card." />);
		} finally {
			setLoading(false);
		}
	};
	const unlistNft = async (index) => {
		try {
			setLoading(true);

			await unlistCard(minterContract, performActions, index);
			toast(<NotificationSuccess text="pubg NFT unlisted successfully" />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to unlist pubg NFT." />);
		} finally {
			setLoading(false);
		}
	};

	const burnNft = async (index) => {
		try {
			setLoading(true);

			await deleteCard(minterContract, performActions, index);
			toast(<NotificationSuccess text="pubg NFT removed successfully" />);
			getAssets();
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to remove pubg NFT." />);
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		try {
			if (address && minterContract) {
				getAssets();
			}
		} catch (error) {
			console.log({ error });
		}
	}, [minterContract, address, getAssets]);
	if (address) {
		return (
			<>
				{!loading ? (
					<>
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h1 className="fs-4 fw-bold mb-0">{name}</h1>
							<AddCard save={addNft} address={address} />
						</div>
						<Row
							xs={1}
							sm={2}
							lg={3}
							className="g-3  mb-5 g-xl-4 g-xxl-5"
						>
							{/* display all NFTs */}
							{nfts.map((_nft) => {
								// prevents empty cards(deleted cards) from breaking the app
								if(typeof _nft === "undefined"){
										return "";
								}else{
									return (
									<PubgCard
									key={_nft.tokenId}
									card={{
										..._nft,
									}}
									address={address}
									buyNft={buyNft}
									sellNft={sellNft}
									burnNft={burnNft}
									unlistNft={unlistNft}
									/>
									)
							}})}
						</Row>
					</>
				) : (
					<Loader />
				)}
			</>
		);
	}
	return null;
};

export default Cards;