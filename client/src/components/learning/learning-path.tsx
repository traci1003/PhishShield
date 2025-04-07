import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Book, Check, CheckCircle, Lock, Medal, ShieldCheck, Trophy, Video } from 'lucide-react';
import { useAccessibility } from '@/contexts/accessibility-context';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  locked: boolean;
  points: number;
  badge?: {
    name: string;
    icon: React.ReactNode;
    description: string;
  };
  modules: {
    id: string;
    type: 'video' | 'quiz' | 'article';
    title: string;
    completed: boolean;
    duration: string;
  }[];
}

export const LearningPath: React.FC = () => {
  const { highContrast } = useAccessibility();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  // Modules data
  const learningModules: LearningModule[] = [
    {
      id: 'basics',
      title: 'Phishing Basics',
      description: 'Learn to identify common phishing tactics',
      icon: <ShieldCheck className="h-5 w-5" />,
      completed: true,
      locked: false,
      points: 100,
      badge: {
        name: 'Phishing Spotter',
        icon: <Award className="h-5 w-5 text-yellow-500" />,
        description: 'Successfully completed the Phishing Basics course'
      },
      modules: [
        { 
          id: 'basics-1', 
          type: 'video', 
          title: 'Introduction to Phishing', 
          completed: true,
          duration: '5 min'
        },
        { 
          id: 'basics-2', 
          type: 'article', 
          title: 'Common Phishing Red Flags', 
          completed: true,
          duration: '10 min'
        },
        { 
          id: 'basics-3', 
          type: 'quiz', 
          title: 'Test Your Knowledge', 
          completed: true,
          duration: '5 min'
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Techniques',
      description: 'Master sophisticated anti-phishing strategies',
      icon: <Medal className="h-5 w-5" />,
      completed: false,
      locked: false,
      points: 250,
      badge: {
        name: 'Security Guardian',
        icon: <Trophy className="h-5 w-5 text-amber-500" />,
        description: 'Mastered advanced phishing protection techniques'
      },
      modules: [
        { 
          id: 'advanced-1', 
          type: 'video', 
          title: 'Spear Phishing Deep Dive', 
          completed: false,
          duration: '8 min'
        },
        { 
          id: 'advanced-2', 
          type: 'article', 
          title: 'Social Engineering Tactics', 
          completed: false,
          duration: '12 min'
        },
        { 
          id: 'advanced-3', 
          type: 'quiz', 
          title: 'Advanced Threat Assessment', 
          completed: false,
          duration: '10 min'
        }
      ]
    },
    {
      id: 'expert',
      title: 'Expert Level Protection',
      description: 'Enterprise-grade security knowledge',
      icon: <Trophy className="h-5 w-5" />,
      completed: false,
      locked: true,
      points: 500,
      modules: [
        { 
          id: 'expert-1', 
          type: 'video', 
          title: 'Enterprise Security Policies', 
          completed: false,
          duration: '15 min'
        },
        { 
          id: 'expert-2', 
          type: 'article', 
          title: 'Advanced Threat Intelligence', 
          completed: false,
          duration: '20 min'
        },
        { 
          id: 'expert-3', 
          type: 'quiz', 
          title: 'Security Expert Certification', 
          completed: false,
          duration: '30 min'
        }
      ]
    }
  ];
  
  // Calculate overall progress
  const totalModules = learningModules.reduce((acc, module) => 
    acc + module.modules.length, 0);
  const completedModules = learningModules.reduce((acc, module) => 
    acc + module.modules.filter(m => m.completed).length, 0);
  const progressPercentage = (completedModules / totalModules) * 100;
  
  // Calculate total points earned
  const totalPoints = learningModules.reduce((acc, module) => 
    module.completed ? acc + module.points : acc, 0);
  
  // Handle module selection
  const handleSelectModule = (moduleId: string) => {
    setSelectedModule(selectedModule === moduleId ? null : moduleId);
  };
  
  return (
    <div className="space-y-6">
      <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Security Learning Path</span>
            <Badge variant="outline" className={`ml-2 ${highContrast ? 'border-white text-white' : ''}`}>
              {totalPoints} XP
            </Badge>
          </CardTitle>
          <CardDescription className={highContrast ? 'text-gray-300' : ''}>
            Learn and earn achievements with PhishShield.AI.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={highContrast ? 'text-white' : 'text-gray-700'}>Progress</span>
              <span className={`text-sm font-medium ${highContrast ? 'text-white' : 'text-gray-500'}`}>
                {completedModules}/{totalModules} modules
              </span>
            </div>
            <Progress value={progressPercentage} className={highContrast ? 'bg-gray-800' : ''} />
          </div>
          
          <div className="mt-6 space-y-4">
            {learningModules.map((module) => (
              <div key={module.id}>
                <Card 
                  className={`hover:shadow-md transition-all cursor-pointer ${
                    module.locked ? 'opacity-60' : ''
                  } ${
                    selectedModule === module.id ? 'ring-2 ring-primary' : ''
                  } ${highContrast ? 'bg-gray-900 text-white border-gray-700' : ''}`}
                  onClick={() => !module.locked && handleSelectModule(module.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          module.completed 
                            ? 'bg-green-100 text-green-600' 
                            : module.locked 
                              ? 'bg-gray-100 text-gray-400' 
                              : 'bg-blue-100 text-blue-600'
                        } ${highContrast ? 'bg-gray-800' : ''}`}>
                          {module.completed ? (
                            <CheckCircle className={`h-5 w-5 ${highContrast ? 'text-green-400' : ''}`} />
                          ) : module.locked ? (
                            <Lock className={`h-5 w-5 ${highContrast ? 'text-gray-400' : ''}`} />
                          ) : (
                            module.icon
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{module.title}</CardTitle>
                          <CardDescription className={highContrast ? 'text-gray-400' : ''}>
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div>
                        <Badge variant={module.completed ? "default" : "outline"}>
                          {module.points} XP
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                
                {selectedModule === module.id && (
                  <div className={`mt-2 p-4 rounded-md ${
                    highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50'
                  }`}>
                    <h4 className={`font-medium mb-3 ${highContrast ? 'text-white' : ''}`}>Module Contents</h4>
                    <ul className="space-y-2">
                      {module.modules.map((subModule) => (
                        <li key={subModule.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {subModule.type === 'video' && <Video className="h-4 w-4 mr-2 text-blue-500" />}
                            {subModule.type === 'article' && <Book className="h-4 w-4 mr-2 text-purple-500" />}
                            {subModule.type === 'quiz' && <Award className="h-4 w-4 mr-2 text-amber-500" />}
                            <span className={highContrast ? 'text-gray-300' : 'text-gray-700'}>
                              {subModule.title}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-xs mr-3 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                              {subModule.duration}
                            </span>
                            {subModule.completed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                                Start
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {module.badge && module.completed && (
                      <div className={`mt-4 p-3 rounded-md ${
                        highContrast ? 'bg-gray-800 border border-gray-700' : 'bg-amber-50 border border-amber-100'
                      }`}>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            highContrast ? 'bg-gray-700' : 'bg-amber-100'
                          }`}>
                            {module.badge.icon}
                          </div>
                          <div>
                            <h5 className={`font-medium ${highContrast ? 'text-amber-300' : 'text-amber-800'}`}>
                              {module.badge.name} Badge Earned!
                            </h5>
                            <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-amber-700'}`}>
                              {module.badge.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className={`flex justify-between ${highContrast ? 'border-t border-gray-800' : 'border-t'} pt-4`}>
          <span className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
            Complete courses to earn badges and points
          </span>
          <Button variant="outline" size="sm">View All Achievements</Button>
        </CardFooter>
      </Card>
    </div>
  );
};