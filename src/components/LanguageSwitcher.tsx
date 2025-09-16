import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language, translations } from '@/lib/i18n';

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
  ];

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
    setIsOpen(false);
    
    // Announce language change for accessibility
    const announcement = `Language changed to ${languages.find(l => l.code === language)?.nativeName}`;
    // Create temporary announcement for screen readers
    const announceElement = document.createElement('div');
    announceElement.setAttribute('aria-live', 'polite');
    announceElement.setAttribute('aria-atomic', 'true');
    announceElement.className = 'sr-only';
    announceElement.textContent = announcement;
    document.body.appendChild(announceElement);
    setTimeout(() => document.body.removeChild(announceElement), 1000);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 lang-transition"
          aria-label={t('selectLanguage')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === currentLanguage)?.nativeName}
          </span>
          <span className="sm:hidden">
            {currentLanguage.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-sm text-muted-foreground">{language.name}</span>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};