const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("pubgCard", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function() {
      // This is executed before each test
      // Deploying the smart contract
      const MyNFT = await ethers.getContractFactory("Mypubg");
      [owner, acc1, acc2] = await ethers.getSigners();

      myNFT = await MyNFT.deploy();
  })

  it("Should set the right owner", async function () {
      expect(await myNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function() {
      expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
      const price = ethers.utils.parseUnits("1");
      
      const tokenURI = "https://example.com/1"
      const tx = await myNFT.connect(acc1).mintCard(tokenURI, price);
      await tx.wait();

      expect(await myNFT.balanceOf(acc1.address)).to.equal(1);
  })

  it("Should set the correct tokenURI", async function() {
      const tokenURI_1 = "https://example.com/1"
      const tokenURI_2 = "https://example.com/2"
      const price = ethers.utils.parseUnits("1");

      const tx1 = await myNFT.connect(acc1).mintCard(tokenURI_1, price);
      await tx1.wait();
      const tx2 = await myNFT.connect(acc2).mintCard(tokenURI_2, price);
      await tx2.wait();

      expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
      expect(await myNFT.tokenURI(1)).to.equal(tokenURI_2);
  })

  it("Should set list and unlist card", async function() {
    const tokenURI = "https://example.com/1";
    const index = 0;
    const price = ethers.utils.parseUnits("1");
    const tx1 = await myNFT.connect(acc1).mintCard(tokenURI, price);
    await tx1.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(1);

    const tx2 = await myNFT.connect(acc1).sellCard(index, price);
    await tx2.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
    
    const tx3 = await myNFT.connect(acc1).unlistCard(index);
    await tx3.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(1);
})

it("Should set buy and delete card", async function() {
    const tokenURI = "https://example.com/1";
    const index = 0;
    const price = ethers.utils.parseUnits("1");
    const tx1 = await myNFT.connect(acc1).mintCard(tokenURI, price);
    await tx1.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(1);

    const tx2 = await myNFT.connect(acc1).sellCard(index, price);
    await tx2.wait();

    expect(await myNFT.balanceOf(acc1.address)).to.equal(0);
    
    const tx3 = await myNFT.connect(acc2).buyCard(index, {value: price});
    await tx3.wait();
    expect(await myNFT.balanceOf(acc2.address)).to.equal(1);

    const tx4 = await myNFT.connect(acc2).deleteCard(index);
    await tx4.wait();
    
    expect(await myNFT.balanceOf(acc2.address)).to.equal(0);
    
})

});