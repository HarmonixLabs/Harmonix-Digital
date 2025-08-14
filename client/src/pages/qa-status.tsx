import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { PlatformQAStatus } from '@/components/platform-qa-status';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';

export default function QAStatusPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <HarmonixLogo size="large" />
              </div>
              <h1 className="text-4xl font-bold text-[#D8C9A9] mb-4">
                Platform Launch Readiness
              </h1>
              <p className="text-lg text-[#D8C9A9]/70">
                Comprehensive QA verification for Harmonix AI Agent Platform
              </p>
            </div>
            
            <PlatformQAStatus />

            <div className="mt-12 text-center">
              <p className="text-[#D8C9A9]/60">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageWrapper>
  );
}