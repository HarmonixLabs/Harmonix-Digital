import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SMSTerms() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="harmonix-container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-harmonix-regal-gold font-serif mb-6">
              SMS Terms & Conditions
            </h1>
            <p className="text-lg text-harmonix-sage-fade">
              Terms governing SMS and text message communications from Harmonix
            </p>
          </div>

          <Card className="harmonix-card-enhanced">
            <CardHeader>
              <CardTitle className="text-harmonix-regal-gold">SMS Communication Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-harmonix-sage-fade">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Consent to Receive SMS Messages</h3>
                <p>
                  By providing your mobile phone number to Harmonix, you expressly consent to receive SMS text messages from us regarding:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Account notifications and security alerts</li>
                  <li>Service updates and platform announcements</li>
                  <li>Appointment reminders and confirmations</li>
                  <li>Marketing and promotional offers (optional)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Message Frequency</h3>
                <p>
                  Message frequency varies based on your account activity and preferences. You may receive up to 10 messages per month for essential account communications, and additional promotional messages if you opt-in.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Standard Messaging Rates</h3>
                <p>
                  Standard message and data rates may apply. Harmonix does not charge for SMS messages, but your mobile carrier's standard messaging rates will apply.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Opt-Out Instructions</h3>
                <p>
                  You may opt-out of SMS communications at any time by:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Replying "STOP" to any SMS message</li>
                  <li>Updating your preferences in your account settings</li>
                  <li>Contacting our support team at support@harmonix.digital</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Help and Support</h3>
                <p>
                  For help with SMS messages, reply "HELP" to any message or contact us at support@harmonix.digital.
                </p>
              </div>

              <div className="pt-6 border-t border-harmonix-cedar-mist">
                <p className="text-sm">
                  Last updated: January 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}