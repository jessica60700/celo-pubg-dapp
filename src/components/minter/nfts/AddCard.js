import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { uploadFileToWebStorage } from "../../../utils/minter";

const COLORS = ["Red", "Green", "Blue", "Cyan", "Yellow", "Purple"];
const SHAPES = ["Circle", "Square", "Triangle"];

const AddCard = ({ save }) => {
	const [name, setName] = useState("");
	const [ipfsImage, setIpfsImage] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [attributes, setAttributes] = useState([]);
	const [show, setShow] = useState(false);

	// check if all form data has been filled
	const isFormFilled = () =>
		name && ipfsImage && description && attributes.length > 2;

	// close the popup modal
	const handleClose = () => {
		setShow(false);
		setAttributes([]);
	};

	// display the popup modal
	const handleShow = () => setShow(true);

	// add an attribute to an NFT
	const setAttributesFunc = (e, trait_type) => {
		const { value } = e.target;
		const attributeObject = {
			trait_type,
			value,
		};
		const arr = attributes;

		// check if attribute already exists
		const index = arr.findIndex((el) => el.trait_type === trait_type);

		if (index >= 0) {
			// update the existing attribute
			arr[index] = {
				trait_type,
				value,
			};
			setAttributes(arr);
			return;
		}

		// add a new attribute
		setAttributes((oldArray) => [...oldArray, attributeObject]);
	};
	return (
		<>
			<Button
				onClick={handleShow}
				variant="dark"
				className="rounded-pill px-0"
				style={{ width: "38px" }}
			>
				<i className="bi bi-plus"></i>
			</Button>

			{/* Modal */}

			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>New pubgCard</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<FloatingLabel
							controlId="inputName"
							label="Pubg name"
							className="mb-3"
						>
							<Form.Control
								type="text"
								onChange={(e) => {
									setName(e.target.value);
								}}
								placeholder="Enter name of Pubg charater"
							/>
						</FloatingLabel>

						<FloatingLabel
							controlId="inputDescription"
							label="Description"
							className="mb-3"
						>
							<Form.Control
								as="textarea"
								placeholder="description"
								style={{ height: "80px" }}
								onChange={(e) => {
									setDescription(e.target.value);
								}}
							/>
						</FloatingLabel>

						<Form.Control
							type="file"
							className={"mb-3"}
							onChange={async (e) => {
								const imageUrl = await uploadFileToWebStorage(e);
								if (!imageUrl) {
									alert("failed to upload image");
									return;
								}
								setIpfsImage(imageUrl);
							}}
							placeholder="Product name"
						></Form.Control>

						<FloatingLabel
							controlId="inputPrice"
							label="Price"
							className="mb-3"
						>
							<Form.Control
								type="number"
								placeholder="Price"
								onChange={(e) => {
									setPrice(e.target.value);
								}}
							/>
						</FloatingLabel>
						<Form.Control
							as="select"
							className={"mb-3"}
							onChange={async (e) => {
								setAttributesFunc(e, "color");
							}}
							placeholder="NFT Color"
						>
							<option hidden>Color</option>
							{COLORS.map((color) => (
								<option
									key={`color-${color.toLowerCase()}`}
									value={color.toLowerCase()}
								>
									{color}
								</option>
							))}
						</Form.Control>

						<Form.Control
							as="select"
							className={"mb-3"}
							onChange={async (e) => {
								setAttributesFunc(e, "shape");
							}}
							placeholder="NFT Shape"
						>
							<option hidden>Shape</option>
							{SHAPES.map((shape) => (
								<option
									key={`shape-${shape.toLowerCase()}`}
									value={shape.toLowerCase()}
								>
									{shape}
								</option>
							))}
						</Form.Control>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="outline-secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="dark"
						disabled={!isFormFilled()}
						onClick={() => {
							save({
								name,
								ipfsImage,
								description,
								price,
								attributes,
							});
							handleClose();
						}}
					>
						Create NFT
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

AddCard.propTypes = {
	save: PropTypes.func.isRequired,
};

export default AddCard;