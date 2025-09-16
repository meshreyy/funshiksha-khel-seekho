import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, BookOpen, BarChart3, Plus, Download } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { funshikshaDB, UserProgress, QuizAttempt } from '@/lib/database';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [studentData, setStudentData] = useState<{
    progress: UserProgress[];
    attempts: QuizAttempt[];
  }>({ progress: [], attempts: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch data for all students in the teacher's class
      const userId = 'demo_user';
      
      const [progress, attempts] = await Promise.all([
        funshikshaDB.getUserProgress(userId),
        funshikshaDB.getUserAttempts(userId, 50)
      ]);

      setStudentData({ progress, attempts });
    } catch (error) {
      console.error('Failed to load teacher data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectInfo = (subject: string) => {
    const subjectMap: Record<string, { name: string; icon: string; color: string }> = {
      math: { name: t('math'), icon: '🔢', color: 'bg-primary/10 text-primary' },
      science: { name: t('science'), icon: '🔬', color: 'bg-secondary/10 text-secondary' },
      technology: { name: t('technology'), icon: '💻', color: 'bg-success/10 text-success' },
      engineering: { name: t('engineering'), icon: '⚙️', color: 'bg-warning/10 text-warning' }
    };
    return subjectMap[subject] || { name: subject, icon: '📚', color: 'bg-muted text-foreground' };
  };

  const getOverallStats = () => {
    const { progress, attempts } = studentData;
    
    const totalQuestions = progress.reduce((acc, p) => acc + p.totalQuestions, 0);
    const correctAnswers = progress.reduce((acc, p) => acc + p.correctAnswers, 0);
    const totalTime = progress.reduce((acc, p) => acc + p.totalTimeSpent, 0);
    
    const recentAttempts = attempts.filter(
      attempt => new Date(attempt.attemptedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    return {
      totalStudents: 1, // In a real app, this would be the actual student count
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      totalTime: Math.round(totalTime / 60),
      weeklyActivity: recentAttempts.length
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

  const stats = getOverallStats();

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
          
          <h1 className="text-2xl font-bold">{t('teacherDashboard')}</h1>
          
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('assignQuiz')}
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Students</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Questions</CardDescription>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Correct</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.correctAnswers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Accuracy</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.accuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>Time (min)</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalTime}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>This Week</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.weeklyActivity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Progress Overview</CardTitle>
                  <CardDescription>Recent learning activity and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentData.progress.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No student progress data yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Students need to complete quizzes to see progress here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentData.progress.map((prog) => {
                        const subjectInfo = getSubjectInfo(prog.subject);
                        const accuracy = prog.totalQuestions > 0 
                          ? Math.round((prog.correctAnswers / prog.totalQuestions) * 100) 
                          : 0;

                        return (
                          <div key={prog.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{subjectInfo.icon}</span>
                              <div>
                                <div className="font-medium">{subjectInfo.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {prog.correctAnswers}/{prog.totalQuestions} questions
                                </div>
                              </div>
                            </div>
                            <Badge className={subjectInfo.color}>
                              {accuracy}%
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest quiz attempts and submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentData.attempts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentData.attempts.slice(0, 8).map((attempt) => (
                        <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              attempt.isCorrect ? 'bg-success' : 'bg-destructive'
                            }`} />
                            <div>
                              <div className="font-medium text-sm">Demo Student</div>
                              <div className="text-xs text-muted-foreground">
                                {attempt.timeSpent}s • {new Date(attempt.attemptedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant={attempt.isCorrect ? "default" : "destructive"} className="text-xs">
                            {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>Manage students and view individual progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Student management coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This feature will allow you to add students, view individual progress, and assign specific quizzes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['math', 'science', 'technology', 'engineering'].map((subject) => {
                const subjectInfo = getSubjectInfo(subject);
                const subjectProgress = studentData.progress.find(p => p.subject === subject);
                
                return (
                  <Card key={subject}>
                    <CardHeader className="text-center">
                      <div className="text-3xl mb-2">{subjectInfo.icon}</div>
                      <CardTitle className="text-lg">{subjectInfo.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      {subjectProgress ? (
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round((subjectProgress.correctAnswers / subjectProgress.totalQuestions) * 100)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {subjectProgress.correctAnswers}/{subjectProgress.totalQuestions} questions
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No data yet</div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance Reports</CardTitle>
                    <CardDescription>Download detailed analytics and progress reports</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Detailed reporting coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate comprehensive reports on student performance, quiz analytics, and learning patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;