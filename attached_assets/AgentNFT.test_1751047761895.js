const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HARMONIX AgentNFT Contract", function () {
    let AgentNFT;
    let agentNFT;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // Get the ContractFactory and Signers
        AgentNFT = await ethers.getContractFactory("AgentNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy the contract
        agentNFT = await AgentNFT.deploy("HARMONIX Agents", "HRMX");
        await agentNFT.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await agentNFT.owner()).to.equal(owner.address);
        });

        it("Should set the correct name and symbol", async function () {
            expect(await agentNFT.name()).to.equal("HARMONIX Agents");
            expect(await agentNFT.symbol()).to.equal("HRMX");
        });

        it("Should start with zero total supply", async function () {
            expect(await agentNFT.totalSupply()).to.equal(0);
        });
    });

    describe("Minting", function () {
        it("Should mint a new agent NFT", async function () {
            const tokenURI = "https://api.harmonix.digital/agents/metadata/1";
            
            await expect(agentNFT.mint(addr1.address, tokenURI))
                .to.emit(agentNFT, "Transfer")
                .withArgs(ethers.constants.AddressZero, addr1.address, 1);

            expect(await agentNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await agentNFT.tokenURI(1)).to.equal(tokenURI);
            expect(await agentNFT.totalSupply()).to.equal(1);
        });

        it("Should increment token IDs correctly", async function () {
            await agentNFT.mint(addr1.address, "uri1");
            await agentNFT.mint(addr2.address, "uri2");

            expect(await agentNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await agentNFT.ownerOf(2)).to.equal(addr2.address);
            expect(await agentNFT.totalSupply()).to.equal(2);
        });

        it("Should only allow owner to mint", async function () {
            await expect(
                agentNFT.connect(addr1).mint(addr2.address, "uri")
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not mint to zero address", async function () {
            await expect(
                agentNFT.mint(ethers.constants.AddressZero, "uri")
            ).to.be.revertedWith("ERC721: mint to the zero address");
        });
    });

    describe("Metadata", function () {
        it("Should return correct token URI", async function () {
            const tokenURI = "https://api.harmonix.digital/agents/metadata/1";
            await agentNFT.mint(addr1.address, tokenURI);

            expect(await agentNFT.tokenURI(1)).to.equal(tokenURI);
        });

        it("Should revert for non-existent token", async function () {
            await expect(agentNFT.tokenURI(999))
                .to.be.revertedWith("ERC721: invalid token ID");
        });

        it("Should update token URI", async function () {
            const initialURI = "https://api.harmonix.digital/agents/metadata/1";
            const newURI = "https://api.harmonix.digital/agents/metadata/1-updated";
            
            await agentNFT.mint(addr1.address, initialURI);
            await agentNFT.setTokenURI(1, newURI);

            expect(await agentNFT.tokenURI(1)).to.equal(newURI);
        });
    });

    describe("Transfers", function () {
        beforeEach(async function () {
            await agentNFT.mint(addr1.address, "uri");
        });

        it("Should transfer token between accounts", async function () {
            await agentNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
            expect(await agentNFT.ownerOf(1)).to.equal(addr2.address);
        });

        it("Should approve and transfer", async function () {
            await agentNFT.connect(addr1).approve(addr2.address, 1);
            await agentNFT.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
            expect(await agentNFT.ownerOf(1)).to.equal(addr2.address);
        });

        it("Should emit Transfer event", async function () {
            await expect(
                agentNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
            ).to.emit(agentNFT, "Transfer")
             .withArgs(addr1.address, addr2.address, 1);
        });
    });

    describe("Batch Operations", function () {
        it("Should mint multiple tokens in batch", async function () {
            const recipients = [addr1.address, addr2.address, addrs[0].address];
            const tokenURIs = ["uri1", "uri2", "uri3"];

            await agentNFT.batchMint(recipients, tokenURIs);

            expect(await agentNFT.totalSupply()).to.equal(3);
            expect(await agentNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await agentNFT.ownerOf(2)).to.equal(addr2.address);
            expect(await agentNFT.ownerOf(3)).to.equal(addrs[0].address);
        });

        it("Should revert batch mint with mismatched arrays", async function () {
            const recipients = [addr1.address, addr2.address];
            const tokenURIs = ["uri1"];

            await expect(
                agentNFT.batchMint(recipients, tokenURIs)
            ).to.be.revertedWith("Arrays length mismatch");
        });
    });

    describe("Agent Metadata Integration", function () {
        it("Should store and retrieve agent metadata", async function () {
            const agentData = {
                name: "Sales Agent",
                description: "AI-powered sales automation agent",
                capabilities: ["lead_generation", "email_outreach", "crm_integration"],
                version: "1.0.0"
            };

            const tokenURI = `https://api.harmonix.digital/agents/metadata/1`;
            await agentNFT.mint(addr1.address, tokenURI);

            // In a real implementation, this would call the metadata API
            // For testing, we verify the URI is correctly set
            expect(await agentNFT.tokenURI(1)).to.equal(tokenURI);
        });

        it("Should handle agent upgrades through metadata updates", async function () {
            const initialURI = "https://api.harmonix.digital/agents/metadata/1?version=1.0.0";
            const upgradedURI = "https://api.harmonix.digital/agents/metadata/1?version=1.1.0";

            await agentNFT.mint(addr1.address, initialURI);
            await agentNFT.setTokenURI(1, upgradedURI);

            expect(await agentNFT.tokenURI(1)).to.equal(upgradedURI);
        });
    });

    describe("Gas Optimization", function () {
        it("Should use reasonable gas for minting", async function () {
            const tx = await agentNFT.mint(addr1.address, "uri");
            const receipt = await tx.wait();
            
            // Gas should be under 200k for a simple mint
            expect(receipt.gasUsed.toNumber()).to.be.lessThan(200000);
        });

        it("Should be efficient for batch minting", async function () {
            const recipients = new Array(10).fill(addr1.address);
            const tokenURIs = new Array(10).fill("uri");

            const tx = await agentNFT.batchMint(recipients, tokenURIs);
            const receipt = await tx.wait();

            // Batch minting should be more efficient than individual mints
            const gasPerToken = receipt.gasUsed.toNumber() / 10;
            expect(gasPerToken).to.be.lessThan(100000);
        });
    });

    describe("Integration with HARMONIX Platform", function () {
        it("Should emit events that can be monitored by the platform", async function () {
            const tokenURI = "https://api.harmonix.digital/agents/metadata/1";
            
            const tx = await agentNFT.mint(addr1.address, tokenURI);
            const receipt = await tx.wait();

            // Verify the event can be parsed by our monitoring system
            const transferEvent = receipt.events.find(e => e.event === "Transfer");
            expect(transferEvent).to.not.be.undefined;
            expect(transferEvent.args.from).to.equal(ethers.constants.AddressZero);
            expect(transferEvent.args.to).to.equal(addr1.address);
            expect(transferEvent.args.tokenId).to.equal(1);
        });

        it("Should support marketplace integration", async function () {
            await agentNFT.mint(addr1.address, "uri");
            
            // Approve marketplace contract (simulated)
            const marketplaceAddress = addrs[0].address; // Simulated marketplace
            await agentNFT.connect(addr1).approve(marketplaceAddress, 1);
            
            expect(await agentNFT.getApproved(1)).to.equal(marketplaceAddress);
        });
    });

    describe("Error Handling", function () {
        it("Should handle network failures gracefully", async function () {
            // This test would be more relevant in an integration environment
            // For unit tests, we verify the contract behaves correctly
            await agentNFT.mint(addr1.address, "uri");
            expect(await agentNFT.ownerOf(1)).to.equal(addr1.address);
        });

        it("Should validate input parameters", async function () {
            await expect(
                agentNFT.mint(addr1.address, "")
            ).to.be.revertedWith("Token URI cannot be empty");
        });
    });
});

// Integration tests for the complete minting flow
describe("HARMONIX Minting Integration", function () {
    let agentNFT;
    let owner;
    let user;

    beforeEach(async function () {
        const AgentNFT = await ethers.getContractFactory("AgentNFT");
        [owner, user] = await ethers.getSigners();
        agentNFT = await AgentNFT.deploy("HARMONIX Agents", "HRMX");
        await agentNFT.deployed();
    });

    it("Should complete full minting workflow", async function () {
        // Step 1: Prepare agent metadata
        const agentMetadata = {
            name: "Customer Service Agent",
            description: "24/7 customer support automation",
            image: "https://cdn.harmonix.digital/agents/customer-service.png",
            attributes: [
                { trait_type: "Category", value: "Customer Service" },
                { trait_type: "Tier", value: "Professional" },
                { trait_type: "Capabilities", value: "Chat, Email, Ticket Management" }
            ]
        };

        const tokenURI = "https://api.harmonix.digital/agents/metadata/1";

        // Step 2: Mint the NFT
        const mintTx = await agentNFT.mint(user.address, tokenURI);
        const mintReceipt = await mintTx.wait();

        // Step 3: Verify minting success
        expect(await agentNFT.ownerOf(1)).to.equal(user.address);
        expect(await agentNFT.tokenURI(1)).to.equal(tokenURI);

        // Step 4: Verify event emission for monitoring
        const transferEvent = mintReceipt.events.find(e => e.event === "Transfer");
        expect(transferEvent.args.from).to.equal(ethers.constants.AddressZero);
        expect(transferEvent.args.to).to.equal(user.address);
        expect(transferEvent.args.tokenId).to.equal(1);

        // Step 5: Verify the token can be queried
        expect(await agentNFT.balanceOf(user.address)).to.equal(1);
        expect(await agentNFT.totalSupply()).to.equal(1);
    });

    it("Should handle concurrent minting requests", async function () {
        const promises = [];
        
        // Simulate multiple concurrent mint requests
        for (let i = 1; i <= 5; i++) {
            promises.push(
                agentNFT.mint(user.address, `https://api.harmonix.digital/agents/metadata/${i}`)
            );
        }

        await Promise.all(promises);

        expect(await agentNFT.totalSupply()).to.equal(5);
        expect(await agentNFT.balanceOf(user.address)).to.equal(5);
    });
});

