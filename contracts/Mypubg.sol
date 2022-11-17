// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Mypubg is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Card {
        uint256 index;
        address owner;
        uint price;
        bool onSale;
    }

    mapping(uint => Card) private cards;

    mapping(uint => bool) private burnt;

    modifier onlyCardOwner(uint tokenId) {
        require(cards[tokenId].owner == msg.sender, "not card owner");
        _;
    }

    modifier onlyOnSale(uint tokenId) {
        require(cards[tokenId].onSale, "not on sale");
        _;
    }

    modifier onlyNotOnSale(uint tokenId) {
        require(!cards[tokenId].onSale, "on sale");
        _;
    }

    constructor() ERC721("Mypubg", "PP") {}

    // mint NTF
    function mintCard(string memory uri, uint _price) public {
        require(_price >= 1 ether, "price too low");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        Card storage newCard = cards[tokenId];
        newCard.index = tokenId;
        newCard.owner = msg.sender;
        newCard.price = _price;
        newCard.onSale = false;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // buy a NFT
    function buyCard(uint tokenId) external payable onlyOnSale(tokenId) {
        require(cards[tokenId].owner != msg.sender, "card owner can't buy");
        require(msg.value == cards[tokenId].price, "Amount sent too low");
        address owner = cards[tokenId].owner;
        cards[tokenId].owner = msg.sender;
        cards[tokenId].onSale = false;
        _transfer(address(this), msg.sender, tokenId);
        (bool transfer, ) = payable(owner).call{value: msg.value}("");
        require(transfer, "Transfer failed");
    }

    // sell a NFT
    function sellCard(uint tokenId, uint _price)
        public
        onlyCardOwner(tokenId)
        onlyNotOnSale(tokenId)
    {
        cards[tokenId].onSale = true;
        cards[tokenId].price = _price;
        _transfer(msg.sender, address(this), tokenId);
    }

    // delete a NFT
    function deleteCard(uint tokenId)
        public
        onlyCardOwner(tokenId)
        onlyNotOnSale(tokenId)
    {
        delete cards[tokenId];
        burnt[tokenId] = true;
        _burn(tokenId);
    }

    // unlist a NFT
    function unlistCard(uint tokenId)
        public
        onlyCardOwner(tokenId)
        onlyOnSale(tokenId)
    {
        cards[tokenId].onSale = false;
        _transfer(address(this), msg.sender, tokenId);
    }

    function getCards() public view returns (Card[] memory) {
        uint amountCards = _tokenIdCounter.current();
        Card[] memory allCards = new Card[](amountCards);
        uint index;
        for (uint i = 0; i < amountCards; i++) {
            if (burnt[i]) {
                continue;
            } else {
                allCards[index] = cards[i];
                index++;
            }
        }
        return allCards;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}