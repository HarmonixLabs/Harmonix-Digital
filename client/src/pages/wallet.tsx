import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WalletInterface } from '@/components/wallet/wallet-interface';

export default function Wallet() {
  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-harmonix-gold mb-2">Wallet</h1>
          <p className="text-harmonix-sage">Manage your tokens, NFTs, and agent royalties</p>
        </div>
        
        <WalletInterface />
      </div>
      <Footer />
    </div>
  );
}