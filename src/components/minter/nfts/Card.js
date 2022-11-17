import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button, Form } from "react-bootstrap";
import { formatBigNumber, truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";

const PubgCard = ({ card, buyNft, sellNft, unlistNft, burnNft, address }) => {
	const { tokenId, price, name, description, onSale, image, owner } = card;
	const [newPrice, setNewPrice] = useState("");

	const getAction = () => {
		if (address === owner) {
			if (!onSale) {
				return (
					<Stack direction="vertical" gap={2}>
						<Form.Control
							type="text"
							placeholder="Enter price"
							value={newPrice}
							onChange={(e) => setNewPrice(e.target.value)}
						/>
						<Button onClick={() => sellNft(tokenId, newPrice)} variant="outline-success">
							Sell
						</Button>
						<Button onClick={() => burnNft(tokenId)} variant="outline-danger">
							Delete
						</Button>
					</Stack>
				);
			} else {
				return (
					<Button onClick={() => unlistNft(tokenId)} variant="outline-warning">
						Unlist
					</Button>
				);
			}
		} else {
			if (onSale) {
				return (
					<Button onClick={() => buyNft(tokenId, price)} variant="outline-dark">
						Buy for {formatBigNumber(price)} CELO
					</Button>
				);
			} else {
				return "";
			}
		}
	};
	return (
		<Col>
			<Card className=" h-100">
				<Card.Header>
					<Stack direction="horizontal" gap={2}>
						<Identicon address={owner} size={28} />
						<span className="font-monospace text-secondary">
							{truncateAddress(owner)}
						</span>
						<Badge bg="secondary" className="ms-auto">
							{tokenId} ID
						</Badge>
					</Stack>
				</Card.Header>
				<div className=" ratio ratio-4x3">
					<img
						src={image}
						alt={name}
						style={{ objectFit: "cover" }}
					/>
				</div>
				<Card.Body className="d-flex  flex-column text-center">
					<Card.Title>{name}</Card.Title>
					<Card.Text className="flex-grow-1 ">
						{description}
					</Card.Text>
					{getAction()}
				</Card.Body>
			</Card>
		</Col>
	);
};

PubgCard.propTypes = {
	card: PropTypes.instanceOf(Object).isRequired,
	buyNft: PropTypes.func.isRequired,
};

export default PubgCard;