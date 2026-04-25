"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-primary-700 dark:bg-primary-600 flex items-center justify-center shadow-sm group-hover:bg-primary-600 dark:group-hover:bg-primary-500 transition-colors">
              <i className="fa-solid fa-moon text-white text-sm"></i>
            </div>
            <span className="font-bold text-xl text-charcoal dark:text-white tracking-tight leading-none">
              Prayer<span className="text-primary-500">Times</span>
            </span>
          </Link>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selection */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="hidden sm:flex items-center gap-1.5 text-sm text-softgray dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all" 
                title="Language"
              >
                <i className="fa-solid fa-globe text-base"></i>
                <span className="text-sm font-medium">{lang}</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isLangOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { setLang('EN'); setIsLangOpen(false); }}
                    className="w-full text-center px-4 py-3 text-sm font-semibold text-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    English
                  </button>
                  <button 
                    onClick={() => { setLang('BN'); setIsLangOpen(false); }}
                    className="w-full text-center px-4 py-3 text-sm font-semibold text-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    বাংলা (BN)
                  </button>
                </div>
              )}
            </div>
            
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-full text-softgray dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300" 
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-base animate-in zoom-in duration-300`}></i>
            </button>
            
            {/* Donate button */}
            <Link href="#" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white bg-primary-700 dark:bg-primary-600 px-5 py-2.5 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:shadow-[0_4px_20px_rgba(15,61,46,0.2)] dark:hover:shadow-none transition-all duration-300 transform hover:-translate-y-0.5">
              <i className="fa-regular fa-heart text-sm"></i>
              Support Us
            </Link>
            
            {/* Mega Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-charcoal hover:text-primary-700 hover:border-primary-300 hover:bg-white transition-all focus:outline-none shadow-sm bg-background" 
                title="Menu"
              >
                <i className="fa-solid fa-bars-staggered text-lg"></i>
              </button>

              {/* Mega Menu Content */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-[600px] max-w-[90vw] bg-white dark:bg-[#0A2B20] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-primary-800 z-50 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                  {/* Close Button */}
                  <div className="absolute top-5 right-5 z-10">
                    <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-softgray dark:text-gray-400 hover:text-charcoal dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#061C14] transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                  </div>
                  
                  <div className="p-10 bg-cream-gradient dark:bg-none relative">
                     {/* Subtle Pattern */}
                     <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[url('/pattern.png')] bg-repeat z-0 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
                     
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                      {/* Column 1 */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xs font-bold text-accent uppercase tracking-[0.15em] mb-5">Prayer Times</h3>
                          <ul className="space-y-4">
                            <li><Link href="/prayer-times" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-clock text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Prayer Times</Link></li>
                            <li><Link href="/prayer-times/monthly" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-calendar text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Monthly Calendar</Link></li>
                            <li><Link href="/prayer-times/yearly" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-calendar-days text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Yearly Schedule</Link></li>
                          </ul>
                        </div>
                        
                        <div className="border-t border-gray-200/60 dark:border-primary-900/60 pt-8">
                          <h3 className="text-xs font-bold text-accent uppercase tracking-[0.15em] mb-5">Resources</h3>
                          <ul className="space-y-4">
                            <li><Link href="/quran" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-solid fa-book-quran text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Al-Quran</Link></li>
                            <li><Link href="/hadith" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-solid fa-scroll text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Hadith</Link></li>
                            <li><Link href="/duas" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-solid fa-hands-praying text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Dua Collection</Link></li>
                          </ul>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xs font-bold text-accent uppercase tracking-[0.15em] mb-5">Tools</h3>
                          <ul className="space-y-4">
                            <li><Link href="/tools/qibla" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-solid fa-compass text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Qibla Direction</Link></li>
                            <li><Link href="/tools/zakat-calculator" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-solid fa-calculator text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Zakat Calculator</Link></li>
                            <li><Link href="/tools/99-names" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-gem text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> 99 Names of Allah</Link></li>
                            <li><Link href="/tools/calendar" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-calendar-check text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Islamic Calendar</Link></li>
                          </ul>
                        </div>

                        <div className="border-t border-gray-200/60 dark:border-primary-900/60 pt-8">
                          <h3 className="text-xs font-bold text-accent uppercase tracking-[0.15em] mb-5">Support</h3>
                          <ul className="space-y-4">
                            <li><Link href="#" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-envelope text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Contact Us</Link></li>
                            <li><Link href="#" className="text-base font-medium text-charcoal dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-3 transition-colors group"><i className="fa-regular fa-heart text-primary-300 dark:text-primary-700 group-hover:text-primary-500 dark:group-hover:text-primary-500 w-4"></i> Donate</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
