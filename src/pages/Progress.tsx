import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { funshikshaDB, UserProgress, QuizAttempt } from '@/lib/database';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      const userId = 'demo_user'; // In a real app, this would come from authentication
      
      const [progress, attempts] = await Promise.all([
        funshikshaDB.getUserProgress(userId),
        funshikshaDB.getUserAttempts(userId, 10)
      ]);

      setUserProgress(progress);
      setRecentAttempts(attempts);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectInfo = (subject: string) => {
    const subjectMap: Record<string, { name: string; icon: string; color: string }> = {
      math: { name: t('math'), icon: '🔢', color: 'text-primary' },
      science: { name: t('science'), icon: '🔬', color: 'text-secondary' },
      technology: { name: t('technology'), icon: '💻', color: 'text-success' },
      engineering: { name: t('engineering'), icon: '⚙️', color: 'text-warning' }
    };
    return subjectMap[subject] || { name: subject, icon: '📚', color: 'text-foreground' };
  };

  const getTotalStats = () => {
    const totals = userProgress.reduce(
      (acc, prog) => ({
        totalQuestions: acc.totalQuestions + prog.totalQuestions,
        correctAnswers: acc.correctAnswers + prog.correctAnswers,
        timeSpent: acc.timeSpent + prog.totalTimeSpent
      }),
      { totalQuestions: 0, correctAnswers: 0, timeSpent: 0 }
    );

    return {
      ...totals,
      accuracy: totals.totalQuestions > 0 ? Math.round((totals.correctAnswers / totals.totalQuestions) * 100) : 0
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-2xl font-bold">{t('progress')}</h1>
          <div></div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{t('totalQuestions')}</CardDescription>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalStats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{t('correctAnswers')}</CardDescription>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalStats.correctAnswers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{t('accuracy')}</CardDescription>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{totalStats.accuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{t('timeSpent')}</CardDescription>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {Math.round(totalStats.timeSpent / 60)}m
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Subject Progress</h2>
            {userProgress.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No progress data yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start taking quizzes to see your progress here!
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/')}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userProgress.map((prog) => {
                  const subjectInfo = getSubjectInfo(prog.subject);
                  const accuracy = prog.totalQuestions > 0 
                    ? Math.round((prog.correctAnswers / prog.totalQuestions) * 100) 
                    : 0;

                  return (
                    <Card key={prog.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{subjectInfo.icon}</span>
                            <CardTitle className="text-lg">{subjectInfo.name}</CardTitle>
                          </div>
                          <Badge variant="outline">
                            {accuracy}% accuracy
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{prog.correctAnswers}/{prog.totalQuestions} correct</span>
                          </div>
                          <Progress value={accuracy} className="h-2" />
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>Questions: {prog.totalQuestions}</div>
                            <div>Time: {Math.round(prog.totalTimeSpent / 60)}m</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {recentAttempts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activity.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAttempts.slice(0, 5).map((attempt) => (
                  <Card key={attempt.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          attempt.isCorrect ? 'bg-success' : 'bg-destructive'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">Quiz Question</div>
                          <div className="text-xs text-muted-foreground">
                            {attempt.timeSpent}s • {new Date(attempt.attemptedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={attempt.isCorrect ? "default" : "destructive"} className="text-xs">
                        {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            Continue Learning
          </Button>
          <Button onClick={() => navigate('/teacher')}>
            View Teacher Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;