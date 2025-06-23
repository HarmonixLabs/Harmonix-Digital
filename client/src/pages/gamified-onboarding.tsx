import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GamifiedOnboarding } from "@/components/gamification/gamified-onboarding";
import { AchievementBadges } from "@/components/gamification/achievement-badges";
import { GamifiedProgress } from "@/components/gamification/gamified-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  Star, 
  Zap, 
  Crown,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function GamifiedOnboardingPage() {
  const [activeTab, setActiveTab] = useState("journey");
  const [userProgress, setUserProgress] = useState({
    level: 3,
    xp: 1250,
    completedAchievements: 5,
    totalAchievements: 12
  });

  const handleOnboardingComplete = () => {
    // Handle completion - could redirect to dashboard or show celebration
    console.log("Onboarding completed!");
  };

  const handleAchievementUnlock = (achievement: any) => {
    console.log("Achievement unlocked:", achievement);
    // Handle achievement unlock - show notification, update XP, etc.
  };

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-harmonix-gold/20 border-2 border-harmonix-gold rounded-full mb-6">
              <Crown className="w-8 h-8 text-harmonix-gold" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-harmonix-gold mb-4">
              Welcome to Your Journey
            </h1>
            <p className="text-xl text-harmonix-sage max-w-3xl mx-auto">
              Master the Harmonix platform through gamified learning, unlock achievements, 
              and build your AI automation empire step by step.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-harmonix-night border-harmonix-cedar text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-harmonix-gold/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-harmonix-gold" />
                </div>
                <div className="text-2xl font-bold text-harmonix-gold mb-1">
                  Level {userProgress.level}
                </div>
                <p className="text-harmonix-sage text-sm">Current Level</p>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-harmonix-gold/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-harmonix-gold" />
                </div>
                <div className="text-2xl font-bold text-harmonix-gold mb-1">
                  {userProgress.xp.toLocaleString()}
                </div>
                <p className="text-harmonix-sage text-sm">Experience Points</p>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-harmonix-gold/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-harmonix-gold" />
                </div>
                <div className="text-2xl font-bold text-harmonix-gold mb-1">
                  {userProgress.completedAchievements}/{userProgress.totalAchievements}
                </div>
                <p className="text-harmonix-sage text-sm">Achievements</p>
              </CardContent>
            </Card>

            <Card className="bg-harmonix-night border-harmonix-cedar text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-harmonix-gold/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-harmonix-gold" />
                </div>
                <div className="text-2xl font-bold text-harmonix-gold mb-1">
                  {Math.round((userProgress.completedAchievements / userProgress.totalAchievements) * 100)}%
                </div>
                <p className="text-harmonix-sage text-sm">Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-harmonix-night border border-harmonix-cedar mb-8">
              <TabsTrigger 
                value="journey" 
                className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black"
              >
                <Target className="w-4 h-4 mr-2" />
                Onboarding Journey
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-harmonix-gold data-[state=active]:text-harmonix-black"
              >
                <Star className="w-4 h-4 mr-2" />
                Progress Tracking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journey" className="space-y-6">
              <GamifiedOnboarding 
                onComplete={handleOnboardingComplete}
              />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <AchievementBadges 
                onAchievementUnlock={handleAchievementUnlock}
              />
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <GamifiedProgress 
                onLevelUp={(newLevel) => console.log("Level up!", newLevel)}
                onMilestoneComplete={(milestone) => console.log("Milestone complete!", milestone)}
              />
            </TabsContent>
          </Tabs>

          {/* Quick Navigation */}
          <Card className="bg-gradient-to-r from-harmonix-night to-harmonix-cedar border-harmonix-gold mt-12">
            <CardHeader>
              <CardTitle className="text-harmonix-gold text-center">
                Ready to Start Your AI Journey?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/marketplace">
                  <Button className="w-full bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90">
                    <Zap className="w-4 h-4 mr-2" />
                    Browse Agents
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/sol-brain">
                  <Button 
                    variant="outline"
                    className="w-full border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Meet SŌL Brain
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button 
                    variant="outline"
                    className="w-full border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}