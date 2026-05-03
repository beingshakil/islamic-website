"use client";
import { useState } from 'react';
import Link from 'next/link';

const resources = [
  {
    href: '/quran',
    icon: 'fa-solid fa-book-quran',
    title: 'Read Quran',
    subtitle: 'Translations & Audio',
    color: 'primary'
  },
  {
    href: '/hadith',
    icon: 'fa-solid fa-scroll',
    title: 'Hadith Collection',
    subtitle: 'Major Sunnah Books',
    color: 'primary'
  },
  {
    href: '/duas',
    icon: 'fa-solid fa-hands-praying',
    title: 'Dua Library',
    subtitle: 'Supplications for daily life',
    color: 'primary'
  },
  {
    href: '/tools/calendar',
    icon: 'fa-regular fa-calendar-days',
    title: 'Islamic Calendar',
    subtitle: 'Hijri dates & Events',
    color: 'primary'
  },
  {
    href: '/tools/99-names',
    icon: 'fa-regular fa-gem',
    title: '99 Names of Allah',
    subtitle: 'Asma ul Husna & Meanings',
    color: 'primary'
  },
  {
    href: '/tools/qibla',
    icon: 'fa-regular fa-compass',
    title: 'Qibla Direction',
    subtitle: 'Accurate compass & map',
    color: 'primary'
  }
];

export default function ResourceGrid() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 relative bg-white/60 dark:bg-[#061C14]/50 border-y border-white/50 dark:border-primary-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-charcoal dark:text-white tracking-tight mb-2">Explore Resources</h2>
            <p className="text-softgray dark:text-gray-400 text-base">Comprehensive tools for your daily spiritual journey.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-primary-400"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search tools or resources..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#0A2B20] border border-gray-200 dark:border-primary-800 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-charcoal dark:text-white placeholder-softgray outline-none transition-all shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-softgray hover:text-charcoal dark:hover:text-white transition-colors"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredResources.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">{item.title}</h3>
                    <p className="text-sm text-softgray dark:text-gray-400 font-medium">{item.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#0A2B20] rounded-full flex items-center justify-center mx-auto mb-6 text-primary-300 dark:text-primary-800">
              <i className="fa-solid fa-magnifying-glass text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2">No results found</h3>
            <p className="text-softgray dark:text-gray-400">We couldn't find any resources matching "{searchTerm}".</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
