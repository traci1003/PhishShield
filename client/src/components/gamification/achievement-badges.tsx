import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, CheckCircle2, AlertTriangle, Lock, Eye, Brain, User } from 'lucide-react';
import { useAccessibility } from '@/contexts/accessibility-context';

interface AchievementProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'beginner' | 'intermediate' | 'advanced';
  date?: string;
}

const Achievement: React.FC<AchievementProps> = ({
  name,
  description,
  icon,
  progress,
  maxProgress,
  unlocked,
  date,
}) => {
  const { highContrast } = useAccessibility();
  const progressPercentage = Math.min(100, Math.round((progress / maxProgress) * 100));
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      unlocked 
        ? highContrast 
          ? 'bg-black text-white border-white border-2' 
          : 'border-primary border-l-4 shadow-md hover:shadow-lg'
        : highContrast 
          ? 'bg-gray-900 text-gray-400 border-gray-700 border-2 opacity-80' 
          : 'bg-gray-100 border-gray-200 opacity-80'
    }`}>
      {unlocked && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Badge className={highContrast ? 'bg-white text-black font-bold' : 'bg-primary-600'}>
            Unlocked
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2 flex flex-row items-center space-x-4">
        <div className={`p-2 rounded-full ${
          unlocked 
            ? highContrast 
              ? 'bg-white text-primary-600' 
              : 'bg-primary-100 text-primary-600'
            : highContrast 
              ? 'bg-gray-800 text-gray-500' 
              : 'bg-gray-200 text-gray-400'
        }`}>
          {icon}
        </div>
        <div>
          <CardTitle className={`text-lg ${
            unlocked 
              ? highContrast 
                ? 'text-white' 
                : 'text-gray-800' 
              : highContrast 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`}>
            {name}
          </CardTitle>
          <CardDescription className={`${
            highContrast ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${
              highContrast ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Progress
            </span>
            <span className={`text-sm font-medium ${
              unlocked 
                ? highContrast 
                  ? 'text-white' 
                  : 'text-primary-600' 
                : highContrast 
                  ? 'text-gray-400' 
                  : 'text-gray-500'
            }`}>
              {progress}/{maxProgress}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${
              unlocked 
                ? highContrast 
                  ? 'bg-gray-700' 
                  : 'bg-primary-100' 
                : highContrast 
                  ? 'bg-gray-800' 
                  : 'bg-gray-200'
            }`}
            indicatorClassName={
              unlocked 
                ? highContrast 
                  ? 'bg-white' 
                  : 'bg-primary-600' 
                : highContrast 
                  ? 'bg-gray-600' 
                  : 'bg-gray-400'
            }
          />
          
          {unlocked && date && (
            <div className="text-xs mt-1 text-right italic">
              <span className={highContrast ? 'text-gray-400' : 'text-gray-500'}>
                Achieved on {date}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const LearningPathBadges: React.FC = () => {
  const { highContrast } = useAccessibility();
  
  const achievements: AchievementProps[] = [
    {
      id: 'phish-spotter',
      name: 'Phish Spotter',
      description: 'Successfully identify 5 phishing attempts',
      icon: <Shield className="h-6 w-6" />,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      category: 'beginner'
    },
    {
      id: 'security-novice',
      name: 'Security Novice',
      description: 'Complete the basic security tutorial',
      icon: <CheckCircle2 className="h-6 w-6" />,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      date: 'April 5, 2025',
      category: 'beginner'
    },
    {
      id: 'vigilant-guardian',
      name: 'Vigilant Guardian',
      description: 'Use PhishShield for 7 consecutive days',
      icon: <Award className="h-6 w-6" />,
      progress: 4,
      maxProgress: 7,
      unlocked: false,
      category: 'intermediate'
    },
    {
      id: 'security-investigator',
      name: 'Security Investigator',
      description: 'Analyze 10 suspicious messages in detail',
      icon: <AlertTriangle className="h-6 w-6" />,
      progress: 10,
      maxProgress: 10,
      unlocked: true,
      date: 'April 6, 2025',
      category: 'intermediate'
    },
    {
      id: 'security-master',
      name: 'Security Master',
      description: 'Complete all intermediate tutorials',
      icon: <Lock className="h-6 w-6" />,
      progress: 0,
      maxProgress: 3,
      unlocked: false,
      category: 'advanced'
    },
    {
      id: 'url-detective',
      name: 'URL Detective',
      description: 'Identify 15 malicious URLs',
      icon: <Eye className="h-6 w-6" />,
      progress: 8,
      maxProgress: 15,
      unlocked: false,
      category: 'advanced'
    },
    {
      id: 'ai-collaborator',
      name: 'AI Collaborator',
      description: 'Use the virtual assistant for 10 security inquiries',
      icon: <Brain className="h-6 w-6" />,
      progress: 5,
      maxProgress: 10,
      unlocked: false,
      category: 'intermediate'
    },
    {
      id: 'security-mentor',
      name: 'Security Mentor',
      description: 'Invite 3 friends to PhishShield.AI.com',
      icon: <User className="h-6 w-6" />,
      progress: 1,
      maxProgress: 3,
      unlocked: false,
      category: 'beginner'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          Beginner Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements
            .filter(a => a.category === 'beginner')
            .map(achievement => (
              <Achievement key={achievement.id} {...achievement} />
            ))}
        </div>
      </div>
      
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          Intermediate Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements
            .filter(a => a.category === 'intermediate')
            .map(achievement => (
              <Achievement key={achievement.id} {...achievement} />
            ))}
        </div>
      </div>
      
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
          Advanced Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements
            .filter(a => a.category === 'advanced')
            .map(achievement => (
              <Achievement key={achievement.id} {...achievement} />
            ))}
        </div>
      </div>
    </div>
  );
};