import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccessibility } from '@/contexts/accessibility-context';
import { Award, Crown, Eye, Lock, Medal, Shield, ShieldCheck, Star, Trophy, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: string;
  category: 'protection' | 'learning' | 'engagement' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
}

export const AchievementBadges: React.FC = () => {
  const { highContrast } = useAccessibility();
  
  const achievements: Achievement[] = [
    // Protection Achievements
    {
      id: 'first-scan',
      name: 'First Defender',
      description: 'Complete your first scan with PhishShield.AI.com',
      icon: <ShieldCheck className="h-6 w-6" />,
      unlocked: true,
      date: '2 days ago',
      category: 'protection',
      rarity: 'common'
    },
    {
      id: 'phish-catcher',
      name: 'Phish Catcher',
      description: 'Successfully identify 5 phishing attempts',
      icon: <Shield className="h-6 w-6" />,
      unlocked: true,
      date: '1 day ago',
      category: 'protection',
      rarity: 'common'
    },
    {
      id: 'vigilant-guardian',
      name: 'Vigilant Guardian',
      description: 'Use the app consistently for 7 days',
      icon: <Eye className="h-6 w-6" />,
      unlocked: false,
      category: 'protection',
      rarity: 'rare',
      progress: 70
    },
    {
      id: 'master-defender',
      name: 'Master Defender',
      description: 'Identify 50 phishing threats',
      icon: <Crown className="h-6 w-6" />,
      unlocked: false,
      category: 'protection',
      rarity: 'legendary',
      progress: 30
    },
    
    // Learning Achievements
    {
      id: 'basics-graduate',
      name: 'Phishing Basics Graduate',
      description: 'Complete the Phishing Basics learning path',
      icon: <Award className="h-6 w-6" />,
      unlocked: true,
      date: '2 days ago',
      category: 'learning',
      rarity: 'common'
    },
    {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 5 learning modules',
      icon: <Star className="h-6 w-6" />,
      unlocked: true,
      date: '1 day ago',
      category: 'learning',
      rarity: 'rare'
    },
    {
      id: 'security-scholar',
      name: 'Security Scholar',
      description: 'Pass 3 security quizzes with a perfect score',
      icon: <Medal className="h-6 w-6" />,
      unlocked: false,
      category: 'learning',
      rarity: 'epic',
      progress: 66
    },
    
    // Engagement Achievements
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Join PhishShield.AI.com in its first month',
      icon: <Zap className="h-6 w-6" />,
      unlocked: true,
      date: '2 days ago',
      category: 'engagement',
      rarity: 'rare'
    },
    {
      id: 'feedback-provider',
      name: 'Feedback Provider',
      description: 'Provide feedback on a security analysis',
      icon: <Star className="h-6 w-6" />,
      unlocked: false,
      category: 'engagement',
      rarity: 'common',
      progress: 0
    },
    
    // Mastery Achievements
    {
      id: 'security-expert',
      name: 'Security Expert',
      description: 'Complete all learning paths and pass certification',
      icon: <Trophy className="h-6 w-6" />,
      unlocked: false,
      category: 'mastery',
      rarity: 'legendary',
      progress: 10
    }
  ];
  
  // Get the rarity color
  const getRarityColor = (rarity: string, isHighContrast: boolean = false) => {
    if (isHighContrast) {
      switch (rarity) {
        case 'common': return 'bg-blue-900 text-blue-300 border-blue-700';
        case 'rare': return 'bg-purple-900 text-purple-300 border-purple-700';
        case 'epic': return 'bg-amber-900 text-amber-300 border-amber-700';
        case 'legendary': return 'bg-red-900 text-red-300 border-red-700';
        default: return 'bg-gray-900 text-gray-300 border-gray-700';
      }
    }
    
    switch (rarity) {
      case 'common': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rare': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'epic': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'legendary': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Filter achievements by category
  const filterAchievements = (category: string) => {
    return achievements.filter(a => a.category === category);
  };
  
  // Calculate progress stats
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const progressPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);
  
  return (
    <div className="space-y-6">
      <Card className={highContrast ? 'bg-black text-white border-white border-2' : ''}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Achievement Badges</CardTitle>
              <CardDescription className={highContrast ? 'text-gray-300' : ''}>
                Track your security journey through achievements
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${highContrast ? 'text-white' : 'text-primary'}`}>
                {unlockedAchievements}/{totalAchievements}
              </div>
              <div className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                {progressPercentage}% Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="protection">Protection</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} highContrast={highContrast} getRarityColor={getRarityColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="protection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterAchievements('protection').map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} highContrast={highContrast} getRarityColor={getRarityColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="learning" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterAchievements('learning').map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} highContrast={highContrast} getRarityColor={getRarityColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterAchievements('engagement').map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} highContrast={highContrast} getRarityColor={getRarityColor} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  highContrast: boolean;
  getRarityColor: (rarity: string, isHighContrast?: boolean) => string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, highContrast, getRarityColor }) => {
  const rarityColors = getRarityColor(achievement.rarity, highContrast);
  
  return (
    <Card className={`overflow-hidden ${achievement.unlocked ? '' : 'opacity-70'} ${highContrast ? 'bg-gray-900 border-gray-800 text-white' : ''}`}>
      <div className={`p-4 flex items-start gap-4 ${achievement.unlocked ? '' : 'filter grayscale'}`}>
        <div className={`p-3 rounded-lg ${rarityColors}`}>
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <Lock className="h-6 w-6" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={`font-semibold ${highContrast ? 'text-white' : ''}`}>{achievement.name}</h3>
            <Badge variant="outline" className={`${highContrast ? 'border-gray-700 text-gray-300' : ''} capitalize`}>
              {achievement.rarity}
            </Badge>
          </div>
          <p className={`text-sm mt-1 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
            {achievement.description}
          </p>
          
          {achievement.unlocked ? (
            <div className={`text-xs mt-2 ${highContrast ? 'text-gray-500' : 'text-gray-500'}`}>
              Unlocked {achievement.date}
            </div>
          ) : achievement.progress !== undefined ? (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={highContrast ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                <span className={highContrast ? 'text-gray-400' : 'text-gray-600'}>{achievement.progress}%</span>
              </div>
              <div className={`h-1.5 w-full rounded-full overflow-hidden ${highContrast ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full ${highContrast ? 'bg-blue-600' : 'bg-blue-500'}`} 
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className={`text-xs mt-2 ${highContrast ? 'text-gray-500' : 'text-gray-500'}`}>
              Not yet unlocked
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};