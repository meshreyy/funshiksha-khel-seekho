// FUNSHIKSHA Internationalization Support
// Supporting English, Hindi, and Odia languages

export type Language = 'en' | 'hi' | 'or';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    or: string;
  };
}

// Core app translations
export const translations: Translations = {
  // App basics
  appName: {
    en: 'FUNSHIKSHA',
    hi: 'फनशिक्षा',
    or: 'ଫନଶିକ୍ଷା'
  },
  appTagline: {
    en: 'Learn STEM, Have Fun!',
    hi: 'STEM सीखें, मज़े करें!',
    or: 'STEM ଶିଖନ୍ତୁ, ମଜା କରନ୍ତୁ!'
  },
  
  // Navigation
  home: {
    en: 'Home',
    hi: 'होम',
    or: 'ହୋମ'
  },
  quiz: {
    en: 'Quiz',
    hi: 'प्रश्नोत्तरी',
    or: 'କୁଇଜ୍'
  },
  progress: {
    en: 'Progress',
    hi: 'प्रगति',
    or: 'ପ୍ରଗତି'
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
    or: 'ପ୍ରୋଫାଇଲ୍'
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    or: 'ଡ୍ୟାସବୋର୍ଡ'
  },

  // Subjects
  math: {
    en: 'Mathematics',
    hi: 'गणित',
    or: 'ଗଣିତ'
  },
  science: {
    en: 'Science',
    hi: 'विज्ञान',
    or: 'ବିଜ୍ଞାନ'
  },
  technology: {
    en: 'Technology',
    hi: 'प्रौद्योगिकी',
    or: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା'
  },
  engineering: {
    en: 'Engineering',
    hi: 'इंजीनियरिंग',
    or: 'ଇଞ୍ଜିନିୟରିଂ'
  },

  // Difficulty levels
  easy: {
    en: 'Easy',
    hi: 'आसान',
    or: 'ସହଜ'
  },
  medium: {
    en: 'Medium',
    hi: 'मध्यम',
    or: 'ମଧ୍ୟମ'
  },
  hard: {
    en: 'Hard',
    hi: 'कठिन',
    or: 'କଠିନ'
  },

  // Quiz interface
  startQuiz: {
    en: 'Start Quiz',
    hi: 'प्रश्नोत्तरी शुरू करें',
    or: 'କୁଇଜ୍ ଆରମ୍ଭ କରନ୍ତୁ'
  },
  nextQuestion: {
    en: 'Next Question',
    hi: 'अगला प्रश्न',
    or: 'ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ'
  },
  submitAnswer: {
    en: 'Submit Answer',
    hi: 'उत्तर जमा करें',
    or: 'ଉତ୍ତର ଦାଖଲ କରନ୍ତୁ'
  },
  correctAnswer: {
    en: 'Correct! Well done!',
    hi: 'सही! बहुत बढ़िया!',
    or: 'ଠିକ୍! ବହୁତ ଭଲ!'
  },
  incorrectAnswer: {
    en: 'Not quite right. Try again!',
    hi: 'बिल्कुल सही नहीं। फिर से कोशिश करें!',
    or: 'ପୂର୍ଣ୍ଣ ଠିକ୍ ନୁହେଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ!'
  },
  explanation: {
    en: 'Explanation:',
    hi: 'व्याख्या:',
    or: 'ବ୍ୟାଖ୍ୟା:'
  },
  quizComplete: {
    en: 'Quiz Complete!',
    hi: 'प्रश्नोत्तरी पूर्ण!',
    or: 'କୁଇଜ୍ ସମ୍ପୂର୍ଣ୍ଣ!'
  },
  score: {
    en: 'Score',
    hi: 'स्कोर',
    or: 'ସ୍କୋର'
  },
  outOf: {
    en: 'out of',
    hi: 'में से',
    or: 'ରୁ'
  },

  // Progress tracking
  totalQuestions: {
    en: 'Total Questions',
    hi: 'कुल प्रश्न',
    or: 'ମୋଟ ପ୍ରଶ୍ନ'
  },
  correctAnswers: {
    en: 'Correct Answers',
    hi: 'सही उत्तर',
    or: 'ସଠିକ୍ ଉତ୍ତର'
  },
  accuracy: {
    en: 'Accuracy',
    hi: 'सटीकता',
    or: 'ସଠିକତା'
  },
  streak: {
    en: 'Day Streak',
    hi: 'दिनों की लकीर',
    or: 'ଦିନ ଧାରା'
  },
  timeSpent: {
    en: 'Time Spent',
    hi: 'समय व्यतीत',
    or: 'ସମୟ ବିତାଇଛନ୍ତି'
  },

  // User interface
  selectLanguage: {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    or: 'ଭାଷା ବାଛନ୍ତୁ'
  },
  english: {
    en: 'English',
    hi: 'अंग्रेजी',
    or: 'ଇଂରାଜୀ'
  },
  hindi: {
    en: 'Hindi',
    hi: 'हिंदी',
    or: 'ହିନ୍ଦୀ'
  },
  odia: {
    en: 'Odia',
    hi: 'ओड़िया',
    or: 'ଓଡ଼ିଆ'
  },
  loading: {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    or: 'ଲୋଡ୍ ହେଉଛି...'
  },
  offline: {
    en: 'Offline Mode',
    hi: 'ऑफ़लाइन मोड',
    or: 'ଅଫଲାଇନ୍ ମୋଡ୍'
  },
  online: {
    en: 'Online',
    hi: 'ऑनलाइन',
    or: 'ଅନଲାଇନ୍'
  },
  
  // Welcome and onboarding
  welcome: {
    en: 'Welcome to FUNSHIKSHA!',
    hi: 'फनशिक्षा में आपका स्वागत है!',
    or: 'ଫନଶିକ୍ଷାରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ!'
  },
  welcomeMessage: {
    en: 'Learn STEM subjects through fun, interactive quizzes designed for rural students.',
    hi: 'ग्रामीण छात्रों के लिए डिज़ाइन किए गए मज़ेदार, इंटरैक्टिव प्रश्नोत्तरी के माध्यम से STEM विषयों को सीखें।',
    or: 'ଗ୍ରାମୀଣ ଛାତ୍ରମାନଙ୍କ ପାଇଁ ପରିକଳ୍ପିତ ମଜାଦାର, ଇଣ୍ଟରାକ୍ଟିଭ୍ କୁଇଜ୍ ମାଧ୍ୟମରେ STEM ବିଷୟଗୁଡ଼ିକ ଶିଖନ୍ତୁ।'
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
    or: 'ଆରମ୍ଭ କରନ୍ତୁ'
  },

  // Teacher dashboard
  teacherDashboard: {
    en: 'Teacher Dashboard',
    hi: 'शिक्षक डैशबोर्ड',
    or: 'ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ'
  },
  studentProgress: {
    en: 'Student Progress',
    hi: 'छात्र प्रगति',
    or: 'ଛାତ୍ର ପ୍ରଗତି'
  },
  assignQuiz: {
    en: 'Assign Quiz',
    hi: 'प्रश्नोत्तरी असाइन करें',
    or: 'କୁଇଜ୍ ଆସାଇନ୍ କରନ୍ତୁ'
  },
  viewReports: {
    en: 'View Reports',
    hi: 'रिपोर्ट देखें',
    or: 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ'
  },

  // Error messages
  errorLoading: {
    en: 'Error loading content. Please try again.',
    hi: 'सामग्री लोड करने में त्रुटि। कृपया पुनः प्रयास करें।',
    or: 'ବିଷୟବସ୍ତୁ ଲୋଡ୍ କରିବାରେ ତ୍ରୁଟି। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।'
  },
  noInternet: {
    en: 'No internet connection. Working in offline mode.',
    hi: 'कोई इंटरनेट कनेक्शन नहीं। ऑफ़लाइन मोड में काम कर रहा है।',
    or: 'କୌଣସି ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ନାହିଁ। ଅଫଲାଇନ୍ ମୋଡ୍ ରେ କାମ କରୁଛି।'
  }
};

// Language management hook
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Get translation for a key
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][currentLanguage];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  // Get translations for all languages (useful for quiz questions)
  const tAll = (key: string): { en: string; hi: string; or: string } | undefined => {
    return translations[key];
  };

  // Change language
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('funshiksha_language', language);
    
    // Update HTML document language
    document.documentElement.lang = language;
    
    // Apply appropriate font class
    document.body.className = language === 'hi' || language === 'or' 
      ? 'font-hindi' 
      : 'font-inter';
  };

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('funshiksha_language') as Language;
    
    if (savedLanguage && ['en', 'hi', 'or'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      changeLanguage(savedLanguage);
    } else {
      // Try to detect language from browser
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('hi')) {
        changeLanguage('hi');
      } else if (browserLang.startsWith('or')) {
        changeLanguage('or');
      } else {
        changeLanguage('en');
      }
    }
  }, []);

  return {
    currentLanguage,
    changeLanguage,
    t,
    tAll,
    isRTL: false, // None of our supported languages are RTL
  };
};

// Language detection utility
export const detectUserLanguage = (): Language => {
  // Check localStorage first
  const saved = localStorage.getItem('funshiksha_language') as Language;
  if (saved && ['en', 'hi', 'or'].includes(saved)) {
    return saved;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('hi')) return 'hi';
  if (browserLang.startsWith('or')) return 'or';
  
  return 'en'; // Default to English
};

// React hook import
import { useState, useEffect } from 'react';