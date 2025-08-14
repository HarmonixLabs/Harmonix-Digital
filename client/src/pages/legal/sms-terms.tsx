import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";

export default function SMSTermsPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold text-white font-serif mb-8">SMS Terms</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">SMS Terms content goes here...</p>
          </div>
        </div>
        <Footer />
      </div>
    </PageWrapper>
  );
}