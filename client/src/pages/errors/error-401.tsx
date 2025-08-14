import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";

export default function Error401() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white font-serif mb-8">401 - Unauthorized</h1>
          <p className="text-gray-300">You need to authenticate to access this resource.</p>
        </div>
        <Footer />
      </div>
    </PageWrapper>
  );
}