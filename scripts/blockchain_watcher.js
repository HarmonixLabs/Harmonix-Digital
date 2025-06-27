#!/usr/bin/env node

/**
 * HARMONIX Blockchain Event Watcher Service
 * Monitors AgentNFT contract events and ensures reliable deployment confirmation
 */

const { ethers } = require('ethers');
const WebSocket = require('ws');
const axios = require('axios');

class BlockchainEventWatcher {
    constructor(config) {
        this.config = config;
        this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        this.contract = new ethers.Contract(
            config.contractAddress,
            config.contractABI,
            this.provider
        );
        this.pendingMints = new Map();
        this.retryQueue = [];
        this.isRunning = false;
    }

    async start() {
        console.log('🚀 Starting HARMONIX Blockchain Event Watcher...');
        this.isRunning = true;

        // Listen for Transfer events (minting)
        this.contract.on('Transfer', async (from, to, tokenId, event) => {
            if (from === ethers.constants.AddressZero) {
                // This is a mint event
                await this.handleMintEvent(to, tokenId, event);
            }
        });

        // Start retry processor
        this.startRetryProcessor();

        // Health check endpoint
        this.startHealthServer();

        console.log('✅ Blockchain Event Watcher is running');
    }

    async handleMintEvent(to, tokenId, event) {
        const txHash = event.transactionHash;
        const blockNumber = event.blockNumber;

        console.log(`🎯 Mint event detected: Token ${tokenId} to ${to} (tx: ${txHash})`);

        try {
            // Wait for confirmations
            const receipt = await this.waitForConfirmations(txHash, 2);
            
            if (receipt.status === 1) {
                // Success - update database
                await this.updateMintStatus(tokenId, txHash, 'confirmed');
                await this.notifySuccess(tokenId, txHash, to);
                
                // Remove from pending if exists
                this.pendingMints.delete(txHash);
            } else {
                // Transaction failed
                await this.handleMintFailure(tokenId, txHash, 'Transaction reverted');
            }
        } catch (error) {
            console.error(`❌ Error processing mint event: ${error.message}`);
            await this.handleMintFailure(tokenId, txHash, error.message);
        }
    }

    async waitForConfirmations(txHash, confirmations = 2) {
        console.log(`⏳ Waiting for ${confirmations} confirmations for tx: ${txHash}`);
        
        const receipt = await this.provider.waitForTransaction(txHash, confirmations, 300000); // 5 min timeout
        
        if (!receipt) {
            throw new Error('Transaction confirmation timeout');
        }

        return receipt;
    }

    async updateMintStatus(tokenId, txHash, status) {
        try {
            await axios.post(`${this.config.apiBaseUrl}/api/blockchain/mint-status`, {
                tokenId: tokenId.toString(),
                txHash,
                status,
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`✅ Updated mint status: Token ${tokenId} - ${status}`);
        } catch (error) {
            console.error(`❌ Failed to update mint status: ${error.message}`);
            // Add to retry queue
            this.retryQueue.push({
                action: 'updateMintStatus',
                params: { tokenId, txHash, status },
                attempts: 0,
                maxAttempts: 3
            });
        }
    }

    async handleMintFailure(tokenId, txHash, error) {
        console.error(`❌ Mint failure: Token ${tokenId}, Error: ${error}`);
        
        // Update database with failure status
        await this.updateMintStatus(tokenId, txHash, 'failed');
        
        // Send alert
        await this.sendAlert({
            type: 'mint_failure',
            tokenId: tokenId.toString(),
            txHash,
            error,
            timestamp: new Date().toISOString()
        });

        // Add to retry queue if it's a network error
        if (error.includes('network') || error.includes('timeout')) {
            this.retryQueue.push({
                action: 'retryMint',
                params: { tokenId, txHash },
                attempts: 0,
                maxAttempts: 3
            });
        }
    }

    async notifySuccess(tokenId, txHash, owner) {
        console.log(`🎉 Mint confirmed: Token ${tokenId} successfully minted to ${owner}`);
        
        // Send success notification
        await this.sendAlert({
            type: 'mint_success',
            tokenId: tokenId.toString(),
            txHash,
            owner,
            timestamp: new Date().toISOString()
        });
    }

    async sendAlert(alert) {
        try {
            // Send to platform webhook
            if (this.config.webhookUrl) {
                await axios.post(this.config.webhookUrl, {
                    type: 'blockchain_alert',
                    data: alert
                });
            }

            // Log to console for monitoring
            console.log(`📢 Alert: ${JSON.stringify(alert)}`);
        } catch (error) {
            console.error(`❌ Failed to send alert: ${error.message}`);
        }
    }

    startRetryProcessor() {
        setInterval(async () => {
            if (this.retryQueue.length === 0) return;

            const item = this.retryQueue.shift();
            item.attempts++;

            try {
                if (item.action === 'updateMintStatus') {
                    await this.updateMintStatus(
                        item.params.tokenId,
                        item.params.txHash,
                        item.params.status
                    );
                } else if (item.action === 'retryMint') {
                    // Implement mint retry logic here
                    console.log(`🔄 Retrying mint for token ${item.params.tokenId}`);
                }
            } catch (error) {
                console.error(`❌ Retry failed: ${error.message}`);
                
                if (item.attempts < item.maxAttempts) {
                    // Add back to queue with exponential backoff
                    setTimeout(() => {
                        this.retryQueue.push(item);
                    }, Math.pow(2, item.attempts) * 1000);
                } else {
                    // Move to dead letter queue
                    console.error(`💀 Moving to dead letter queue: ${JSON.stringify(item)}`);
                    await this.sendAlert({
                        type: 'dead_letter',
                        item: JSON.stringify(item),
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }, 5000); // Check every 5 seconds
    }

    startHealthServer() {
        const express = require('express');
        const app = express();
        
        app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                isRunning: this.isRunning,
                pendingMints: this.pendingMints.size,
                retryQueueSize: this.retryQueue.length,
                lastCheck: new Date().toISOString()
            });
        });

        app.listen(this.config.healthPort || 3001, () => {
            console.log(`🏥 Health server running on port ${this.config.healthPort || 3001}`);
        });
    }

    async stop() {
        console.log('🛑 Stopping Blockchain Event Watcher...');
        this.isRunning = false;
        this.contract.removeAllListeners();
    }
}

// Configuration
const config = {
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    contractAddress: process.env.AGENT_NFT_CONTRACT_ADDRESS,
    contractABI: [], // Load from contract JSON
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    apiKey: process.env.API_KEY,
    webhookUrl: process.env.BLOCKCHAIN_WEBHOOK_URL,
    healthPort: process.env.HEALTH_PORT || 3001
};

// Start the watcher if run directly
if (require.main === module) {
    const watcher = new BlockchainEventWatcher(config);

    process.on('SIGINT', async () => {
        await watcher.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await watcher.stop();
        process.exit(0);
    });

    watcher.start().catch(console.error);
}

module.exports = BlockchainEventWatcher;