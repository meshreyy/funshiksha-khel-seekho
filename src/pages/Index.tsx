import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Play, BarChart3 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useLanguage } from '@/lib/i18n';
import { funshikshaDB } from '@/lib/database';
import { useOfflineSync } from '@/hooks/useOfflineSync';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isOnline, pendingItems } = useOfflineSync();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    subjects: 0
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database and seed initial data
      await funshikshaDB.init();
      await funshikshaDB.seedInitialData();
      
      // Load user stats if available
      // For now, we'll use sample data
      setUserStats({
        totalQuestions: 0,
        correctAnswers: 0,
        subjects: 4
      });
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = [
    {
      id: 'math',
      name: t('math'),
      icon: '🔢',
      color: 'bg-gradient-primary',
      description: 'Numbers, calculations, and problem solving'
    },
    {
      id: 'science',
      name: t('science'),
      icon: '🔬',
      color: 'bg-gradient-secondary',
      description: 'Explore the natural world around us'
    },
    {
      id: 'technology',
      name: t('technology'),
      icon: '💻',
      color: 'bg-gradient-success',
      description: 'Digital tools and computer systems'
    },
    {
      id: 'engineering',
      name: t('engineering'),
      icon: '⚙️',
      color: 'bg-gradient-warm',
      description: 'Design and build solutions'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">📚</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">{t('appName')}</h1>
              <p className="text-xs text-muted-foreground">{t('appTagline')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <OfflineIndicator />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-8">
        {/* Welcome Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{t('welcome')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('welcomeMessage')}
          </p>
          
          {pendingItems > 0 && (
            <Badge variant="outline" className="gap-1">
              <BarChart3 className="h-3 w-3" />
              {pendingItems} items waiting to sync
            </Badge>
          )}
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary">
                {userStats.totalQuestions}
              </CardTitle>
              <CardDescription>{t('totalQuestions')}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-success">
                {userStats.correctAnswers}
              </CardTitle>
              <CardDescription>{t('correctAnswers')}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-secondary">
                {Math.round((userStats.correctAnswers / Math.max(userStats.totalQuestions, 1)) * 100)}%
              </CardTitle>
              <CardDescription>{t('accuracy')}</CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Subject Cards */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Choose Your Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="group cursor-pointer transition-all hover:shadow-medium hover:scale-105"
                onClick={() => navigate(`/quiz/${subject.id}`)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    {subject.icon}
                  </div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full gap-2" 
                    size="sm"
                  >
                    <Play className="h-4 w-4" />
                    {t('startQuiz')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 gap-3"
              onClick={() => navigate('/progress')}
            >
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{t('progress')}</div>
                <div className="text-sm text-muted-foreground">View your learning journey</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 gap-3"
              onClick={() => navigate('/profile')}
            >
              <Users className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{t('profile')}</div>
                <div className="text-sm text-muted-foreground">Manage your account</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 gap-3"
              onClick={() => navigate('/teacher')}
            >
              <Award className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{t('teacherDashboard')}</div>
                <div className="text-sm text-muted-foreground">For educators</div>
              </div>
            </Button>
          </div>
        </section>
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
