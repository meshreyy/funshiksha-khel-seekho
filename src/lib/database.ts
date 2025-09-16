// FUNSHIKSHA IndexedDB Database for Offline Storage
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema interfaces
export interface UserProfile {
  id: string;
  name: string;
  class: string;
  school?: string;
  preferredLanguage: 'en' | 'hi' | 'or';
  createdAt: Date;
  lastActive: Date;
}

export interface QuizQuestion {
  id: string;
  subject: 'math' | 'science' | 'technology' | 'engineering';
  difficulty: 'easy' | 'medium' | 'hard';
  question: {
    en: string;
    hi: string;
    or: string;
  };
  options: {
    en: string[];
    hi: string[];
    or: string[];
  };
  correctAnswer: number; // Index of correct option
  explanation?: {
    en: string;
    hi: string;
    or: string;
  };
  tags: string[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attemptedAt: Date;
  language: 'en' | 'hi' | 'or';
}

export interface UserProgress {
  id: string;
  userId: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  streakDays: number;
  totalTimeSpent: number;
  lastUpdated: Date;
  achievements: string[];
}

export interface OfflineQueue {
  id: string;
  type: 'quiz_attempt' | 'progress_update' | 'user_update';
  data: any;
  createdAt: Date;
  retryCount: number;
}

// Database schema definition
interface FunshikshaDB extends DBSchema {
  users: {
    key: string;
    value: UserProfile;
    indexes: {
      'by-name': string;
      'by-last-active': Date;
    };
  };
  
  questions: {
    key: string;
    value: QuizQuestion;
    indexes: {
      'by-subject': string;
      'by-difficulty': string;
      'by-subject-difficulty': [string, string];
    };
  };
  
  attempts: {
    key: string;
    value: QuizAttempt;
    indexes: {
      'by-user': string;
      'by-question': string;
      'by-user-question': [string, string];
      'by-date': Date;
    };
  };
  
  progress: {
    key: string;
    value: UserProgress;
    indexes: {
      'by-user': string;
      'by-subject': string;
      'by-user-subject': [string, string];
    };
  };
  
  offline_queue: {
    key: string;
    value: OfflineQueue;
    indexes: {
      'by-type': string;
      'by-created-at': Date;
    };
  };
}

class FunshikshaDatabase {
  private db: IDBPDatabase<FunshikshaDB> | null = null;
  private readonly DB_NAME = 'funshiksha-db';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<FunshikshaDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Users store
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-name', 'name');
        userStore.createIndex('by-last-active', 'lastActive');

        // Questions store
        const questionsStore = db.createObjectStore('questions', { keyPath: 'id' });
        questionsStore.createIndex('by-subject', 'subject');
        questionsStore.createIndex('by-difficulty', 'difficulty');
        questionsStore.createIndex('by-subject-difficulty', ['subject', 'difficulty']);

        // Quiz attempts store
        const attemptsStore = db.createObjectStore('attempts', { keyPath: 'id' });
        attemptsStore.createIndex('by-user', 'userId');
        attemptsStore.createIndex('by-question', 'questionId');
        attemptsStore.createIndex('by-user-question', ['userId', 'questionId']);
        attemptsStore.createIndex('by-date', 'attemptedAt');

        // User progress store
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('by-user', 'userId');
        progressStore.createIndex('by-subject', 'subject');
        progressStore.createIndex('by-user-subject', ['userId', 'subject']);

        // Offline queue store
        const queueStore = db.createObjectStore('offline_queue', { keyPath: 'id' });
        queueStore.createIndex('by-type', 'type');
        queueStore.createIndex('by-created-at', 'createdAt');

        console.log('FUNSHIKSHA Database initialized with all stores');
      },
    });
  }

  // User management
  async createUser(user: Omit<UserProfile, 'id' | 'createdAt' | 'lastActive'>): Promise<string> {
    await this.init();
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: UserProfile = {
      ...user,
      id: userId,
      createdAt: new Date(),
      lastActive: new Date(),
    };

    await this.db!.add('users', newUser);
    return userId;
  }

  async getUser(userId: string): Promise<UserProfile | undefined> {
    await this.init();
    return this.db!.get('users', userId);
  }

  async updateUserActivity(userId: string): Promise<void> {
    await this.init();
    const user = await this.getUser(userId);
    if (user) {
      user.lastActive = new Date();
      await this.db!.put('users', user);
    }
  }

  // Quiz questions management
  async addQuestions(questions: QuizQuestion[]): Promise<void> {
    await this.init();
    const tx = this.db!.transaction('questions', 'readwrite');
    
    for (const question of questions) {
      await tx.store.put(question);
    }
    
    await tx.done;
  }

  async getQuestionsBySubject(
    subject: string, 
    difficulty?: string, 
    limit: number = 10
  ): Promise<QuizQuestion[]> {
    await this.init();
    
    if (difficulty) {
      return this.db!.getAllFromIndex(
        'questions', 
        'by-subject-difficulty', 
        [subject, difficulty],
        limit
      );
    }
    
    return this.db!.getAllFromIndex('questions', 'by-subject', subject, limit);
  }

  // Quiz attempts
  async recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'attemptedAt'>): Promise<string> {
    await this.init();
    
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: attemptId,
      attemptedAt: new Date(),
    };

    await this.db!.add('attempts', newAttempt);
    
    // Update user progress
    await this.updateUserProgress(attempt.userId, attempt.questionId, attempt.isCorrect);
    
    return attemptId;
  }

  async getUserAttempts(userId: string, limit: number = 50): Promise<QuizAttempt[]> {
    await this.init();
    return this.db!.getAllFromIndex('attempts', 'by-user', userId, limit);
  }

  // Progress tracking
  async updateUserProgress(userId: string, questionId: string, isCorrect: boolean): Promise<void> {
    await this.init();
    
    // Get question to determine subject
    const question = await this.db!.get('questions', questionId);
    if (!question) return;

    const progressId = `${userId}_${question.subject}`;
    let progress = await this.db!.get('progress', progressId);

    if (!progress) {
      progress = {
        id: progressId,
        userId,
        subject: question.subject,
        totalQuestions: 0,
        correctAnswers: 0,
        streakDays: 0,
        totalTimeSpent: 0,
        lastUpdated: new Date(),
        achievements: [],
      };
    }

    progress.totalQuestions += 1;
    if (isCorrect) {
      progress.correctAnswers += 1;
    }
    progress.lastUpdated = new Date();

    await this.db!.put('progress', progress);
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    await this.init();
    return this.db!.getAllFromIndex('progress', 'by-user', userId);
  }

  // Offline queue management
  async addToOfflineQueue(type: OfflineQueue['type'], data: any): Promise<void> {
    await this.init();
    
    const queueItem: OfflineQueue = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      createdAt: new Date(),
      retryCount: 0,
    };

    await this.db!.add('offline_queue', queueItem);
  }

  async getOfflineQueue(): Promise<OfflineQueue[]> {
    await this.init();
    return this.db!.getAll('offline_queue');
  }

  async removeFromOfflineQueue(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('offline_queue', id);
  }

  // Data seeding for initial content
  async seedInitialData(): Promise<void> {
    await this.init();
    
    // Check if we already have questions
    const existingQuestions = await this.db!.count('questions');
    if (existingQuestions > 0) {
      console.log('Database already seeded with questions');
      return;
    }

    // Seed sample STEM questions
    const sampleQuestions: QuizQuestion[] = [
      {
        id: 'math_001',
        subject: 'math',
        difficulty: 'easy',
        question: {
          en: 'What is 15 + 27?',
          hi: '15 + 27 का योग क्या है?',
          or: '15 + 27 ର ଯୋଗଫଳ କେତେ?'
        },
        options: {
          en: ['40', '42', '43', '45'],
          hi: ['40', '42', '43', '45'],
          or: ['40', '42', '43', '45']
        },
        correctAnswer: 1,
        explanation: {
          en: '15 + 27 = 42. Add the numbers step by step: 15 + 20 = 35, then 35 + 7 = 42.',
          hi: '15 + 27 = 42। संख्याओं को चरणबद्ध तरीके से जोड़ें: 15 + 20 = 35, फिर 35 + 7 = 42।',
          or: '15 + 27 = 42। ସଂଖ୍ୟାଗୁଡ଼ିକୁ ଧାପେ ଧାପେ ଯୋଗ କରନ୍ତୁ: 15 + 20 = 35, ତାପରେ 35 + 7 = 42।'
        },
        tags: ['addition', 'basic-math']
      },
      {
        id: 'science_001',
        subject: 'science',
        difficulty: 'easy',
        question: {
          en: 'Which part of the plant absorbs water?',
          hi: 'पौधे का कौन सा भाग पानी सोखता है?',
          or: 'ଉଦ୍ଭିଦର କେଉଁ ଅଂଶ ପାଣି ଶୋଷିତ କରେ?'
        },
        options: {
          en: ['Leaves', 'Roots', 'Flowers', 'Stem'],
          hi: ['पत्ते', 'जड़ें', 'फूल', 'तना'],
          or: ['ପତ୍ର', 'ମୂଳ', 'ଫୁଲ', 'କାଣ୍ଡ']
        },
        correctAnswer: 1,
        explanation: {
          en: 'Roots absorb water and nutrients from the soil to feed the plant.',
          hi: 'जड़ें मिट्टी से पानी और पोषक तत्वों को सोखती हैं और पौधे को भोजन प्रदान करती हैं।',
          or: 'ମୂଳ ମାଟିରୁ ପାଣି ଏବଂ ପୋଷକ ତତ୍ତ୍ୱ ଶୋଷିତ କରି ଉଦ୍ଭିଦକୁ ଖାଦ୍ୟ ଯୋଗାଇଥାଏ।'
        },
        tags: ['plants', 'biology', 'nature']
      }
    ];

    await this.addQuestions(sampleQuestions);
    console.log('Database seeded with sample STEM questions');
  }
}

// Export singleton instance
export const funshikshaDB = new FunshikshaDatabase();