import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { MultiProviderAuth } from '@/components/auth/multi-provider-auth';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { Link } from 'wouter';

export default function SignInPage() {
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
                Welcome to Harmonix
              </h1>
              <p className="text-lg text-[#D8C9A9]/70 mb-8">
                Sign in to access your AI agent dashboard
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <MultiProviderAuth mode="signin" />
              
              <div className="text-center mt-6">
                <p className="text-[#D8C9A9]/60">
                  Don't have an account?{' '}
                  <Link 
                    href="/auth/signup" 
                    className="text-[#D8C9A9] hover:text-[#D8C9A9]/80 underline"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageWrapper>
  );
}