import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Building } from "lucide-react";

export default function EnhancedLeadCaptureForm() {
  return (
    <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">
          Get Started with Harmony
        </CardTitle>
        <CardDescription className="text-gray-300 text-center">
          Tell us about your business needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Business Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="company"
                placeholder="Your Company"
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="needs" className="text-white">Automation Needs</Label>
            <Textarea
              id="needs"
              placeholder="What processes would you like to automate?"
              rows={3}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          <Button className="w-full bg-harmony-gold hover:bg-harmony-gold/80 text-black font-semibold py-3">
            Request Demo Call
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}