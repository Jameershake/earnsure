import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaGlobe />
        <span>{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="language-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
              >
                <span className="flag">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          <div 
            className="language-overlay" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
