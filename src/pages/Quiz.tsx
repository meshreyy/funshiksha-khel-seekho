import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Brain, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { funshikshaDB, QuizQuestion } from '@/lib/database';
import { useOfflineSync } from '@/hooks/useOfflineSync';

const Quiz = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { addToQueue } = useOfflineSync();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [subject]);

  const loadQuestions = async () => {
    if (!subject) {
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      const loadedQuestions = await funshikshaDB.getQuestionsBySubject(subject, undefined, 5);
      
      if (loadedQuestions.length === 0) {
        // No questions available for this subject
        console.warn(`No questions found for subject: ${subject}`);
        setQuestions([]);
      } else {
        setQuestions(loadedQuestions);
      }
      
      setStartTime(new Date());
      setQuestionStartTime(new Date());
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000);

    // Record the attempt
    try {
      const userId = 'demo_user'; // In a real app, this would come from authentication
      await funshikshaDB.recordQuizAttempt({
        userId,
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeSpent,
        language: currentLanguage
      });

      // Add to offline sync queue
      await addToQueue('quiz_attempt', {
        userId,
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeSpent,
        language: currentLanguage,
        subject
      });
    } catch (error) {
      console.error('Failed to record quiz attempt:', error);
    }

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(new Date());
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
    setStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const getSubjectInfo = () => {
    const subjectMap: Record<string, { name: string; icon: string; color: string }> = {
      math: { name: t('math'), icon: '🔢', color: 'bg-gradient-primary' },
      science: { name: t('science'), icon: '🔬', color: 'bg-gradient-secondary' },
      technology: { name: t('technology'), icon: '💻', color: 'bg-gradient-success' },
      engineering: { name: t('engineering'), icon: '⚙️', color: 'bg-gradient-warm' }
    };
    return subjectMap[subject || ''] || { name: subject, icon: '📚', color: 'bg-primary' };
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>No Questions Available</CardTitle>
              <CardDescription>
                There are no quiz questions available for {getSubjectInfo().name} at the moment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subjectInfo = getSubjectInfo();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  if (quizComplete) {
    const totalTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-2xl ${subjectInfo.color} flex items-center justify-center text-2xl celebrate`}>
                  {subjectInfo.icon}
                </div>
              </div>
              <CardTitle className="text-2xl">{t('quizComplete')}</CardTitle>
              <CardDescription>
                Great job completing the {subjectInfo.name} quiz!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">{t('score')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">{t('totalQuestions')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">{t('accuracy')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">{totalTime}s</div>
                  <div className="text-sm text-muted-foreground">{t('timeSpent')}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRetakeQuiz} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/')} className="flex-1">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Back
          </Button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${subjectInfo.color} flex items-center justify-center text-sm`}>
              {subjectInfo.icon}
            </div>
            <span className="font-medium">{subjectInfo.name}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge variant="outline">
              <Brain className="h-3 w-3 mr-1" />
              {t('easy')}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question[currentLanguage]}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options[currentLanguage].map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${
                    selectedAnswer === index ? 'selected' : ''
                  } ${
                    showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'correct'
                        : selectedAnswer === index
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            {showResult && currentQuestion.explanation && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t('explanation')}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation[currentLanguage]}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!showResult ? (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1"
                >
                  {t('submitAnswer')}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="flex-1">
                  {currentQuestionIndex < questions.length - 1 
                    ? t('nextQuestion') 
                    : 'Complete Quiz'
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;