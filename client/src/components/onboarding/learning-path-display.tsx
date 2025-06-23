import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Play, BookOpen, Zap, Users } from "lucide-react";
import { SacredCard } from "@/components/ui/sacred-card";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn, StaggerContainer } from "@/components/ui/micro-animations";
import { AILearningAssistant } from "./ai-learning-assistant";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'interactive' | 'hands-on' | 'assessment';
  completed: boolean;
  locked: boolean;
}

interface LearningPathDisplayProps {
  pathTitle: string;
  pathDescription: string;
  totalDuration: string;
  difficulty: string;
  modules: LearningModule[];
  currentProgress: number;
  onStartModule: (moduleId: string) => void;
}

const moduleTypeIcons = {
  video: BookOpen,
  interactive: Zap,
  'hands-on': Users,
  assessment: CheckCircle
};

const moduleTypeColors = {
  video: 'bg-blue-500/20 text-blue-400',
  interactive: 'bg-purple-500/20 text-purple-400',
  'hands-on': 'bg-green-500/20 text-green-400',
  assessment: 'bg-orange-500/20 text-orange-400'
};

export function LearningPathDisplay({
  pathTitle,
  pathDescription,
  totalDuration,
  difficulty,
  modules,
  currentProgress,
  onStartModule
}: LearningPathDisplayProps) {
  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
      <FadeIn delay={0.2}>
        <SacredCard className="p-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="harmonix-header-font text-2xl text-white mb-2">
                  {pathTitle}
                </CardTitle>
                <p className="text-harmonix-sage text-lg">{pathDescription}</p>
              </div>
              <div className="text-right space-y-2">
                <Badge variant="outline" className="text-harmonix-gold border-harmonix-gold">
                  {difficulty}
                </Badge>
                <div className="flex items-center text-harmonix-sage">
                  <Clock className="h-4 w-4 mr-2" />
                  {totalDuration}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-harmonix-sage">Overall Progress</span>
                  <span className="text-white">{completedModules}/{totalModules} modules</span>
                </div>
                <Progress value={currentProgress} className="h-3 bg-harmonix-pine/30" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-harmonix-gold">{completedModules}</div>
                  <div className="text-harmonix-sage text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-harmonix-gold">{totalModules - completedModules}</div>
                  <div className="text-harmonix-sage text-sm">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-harmonix-gold">{Math.round(currentProgress)}%</div>
                  <div className="text-harmonix-sage text-sm">Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </SacredCard>
      </FadeIn>

      <StaggerContainer>
        <div className="grid gap-4">
          {modules.map((module, index) => {
            const IconComponent = moduleTypeIcons[module.type];
            const colorClass = moduleTypeColors[module.type];
            
            return (
              <FadeIn key={module.id} delay={0.1 * index}>
                <SacredCard className={`p-6 transition-all duration-300 hover:scale-[1.02] ${
                  module.locked ? 'opacity-50' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="harmonix-header-font text-lg text-white mb-1">
                          {module.title}
                        </h3>
                        <p className="text-harmonix-sage text-sm mb-2">
                          {module.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-xs">
                            {module.type}
                          </Badge>
                          <div className="flex items-center text-harmonix-sage text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {module.completed ? (
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="text-sm">Completed</span>
                        </div>
                      ) : module.locked ? (
                        <div className="text-harmonix-sage text-sm">
                          Complete previous modules
                        </div>
                      ) : (
                        <SacredButton
                          onClick={() => onStartModule(module.id)}
                          size="sm"
                          className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </SacredButton>
                      )}
                    </div>
                  </div>
                </SacredCard>
              </FadeIn>
            );
          })}
        </div>
      </StaggerContainer>

        </div>
        
        <div className="space-y-6">
          <AILearningAssistant 
            userContext={{
              role: "Professional",
              industry: "Technology",
              experience: "intermediate"
            }}
          />
          
          <FadeIn delay={0.5}>
            <SacredCard className="p-6 bg-gradient-to-r from-harmonix-gold/10 to-harmonix-sage/10 border-harmonix-gold/30">
              <div className="text-center space-y-4">
                <h3 className="harmonix-header-font text-xl text-white">
                  Progress Tracking
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Modules Completed</span>
                    <span className="text-white">{completedModules}/{totalModules}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Estimated Time Left</span>
                    <span className="text-white">{totalDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Skill Level</span>
                    <span className="text-white">{difficulty}</span>
                  </div>
                </div>
              </div>
            </SacredCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}