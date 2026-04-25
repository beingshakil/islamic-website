"use client";
import { useState } from 'react';
import Link from 'next/link';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* 1. HERO SECTION - PRAYER TIMES */}
      <section id="prayer" className="relative py-12 lg:py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs + Dates Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center text-center sm:text-left gap-4 mb-10">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-500 dark:text-primary-400 text-sm font-medium">
              <i className="fa-solid fa-location-dot"></i>
              <span className="hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer transition-colors">Bangladesh</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-primary-300 dark:text-primary-600"></i>
              <span className="text-charcoal dark:text-white font-bold">Dhaka</span>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="ml-3 w-7 h-7 bg-white dark:bg-[#0A2B20] shadow-sm border border-gray-100 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 rounded-full flex items-center justify-center transition-all text-softgray dark:text-gray-400" 
                title="Change location"
              >
                <i className="fa-solid fa-pen-to-square text-[11px]"></i>
              </button>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-5 text-[11px] sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-softgray dark:text-gray-400">
                <i className="fa-regular fa-calendar text-primary-400"></i>
                <span className="font-medium text-charcoal dark:text-gray-200">Saturday, April 25, 2026</span>
              </div>
              <span className="text-gray-300 dark:text-primary-800">|</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-softgray dark:text-gray-400">
                <i className="fa-regular fa-moon text-primary-400"></i>
                <span className="font-medium text-charcoal dark:text-gray-200">27 Shawwal, 1447 AH</span>
              </div>
            </div>
          </div>

          {/* Main Hero Grid: Countdown + Schedule */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Current/Next Prayer Card */}
            <div className="lg:col-span-1 h-full">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 border border-gray-100 dark:border-primary-800/50 h-full flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                {/* Subtle decorative gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 dark:bg-primary-900/30 rounded-full blur-3xl opacity-60 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors duration-500 pointer-events-none"></div>
                
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">Current Prayer</span>
                </div>
                
                <p className="font-bold text-5xl mb-2 text-charcoal dark:text-white tracking-tight">Dhuhr</p>
                <p className="text-softgray dark:text-gray-400 text-sm mb-8 font-medium">Dhaka, Bangladesh · Local time 12:04 PM</p>
                
                <div className="bg-background dark:bg-[#061C14] rounded-2xl p-6 border border-gray-100/50 dark:border-primary-900/50 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50/30 dark:to-primary-900/20"></div>
                  <p className="text-xs text-softgray dark:text-gray-400 mb-2 uppercase tracking-widest font-bold relative z-10">Remaining Until Asr</p>
                  <p className="font-sans text-4xl font-bold tracking-tight text-charcoal dark:text-white relative z-10">03:28<span className="text-2xl text-softgray dark:text-gray-500 ml-1">:15</span></p>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-softgray dark:text-gray-400 font-medium">Next: <span className="text-charcoal dark:text-white font-bold">Asr</span></span>
                  <span className="text-softgray dark:text-gray-400 font-medium">at <span className="text-charcoal dark:text-white font-bold">3:32 PM</span></span>
                </div>
              </div>
            </div>

            {/* Daily Prayer Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 border border-gray-100 dark:border-primary-800/50 h-full flex flex-col justify-between hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-2xl text-charcoal dark:text-white tracking-tight">Today's Prayer Schedule</h2>
                  <span className="text-xs text-softgray dark:text-gray-400 font-semibold bg-gray-50 dark:bg-[#061C14] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-primary-900">Dhaka · Hanafi Method</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                  {/* Fajr */}
                  <Link href="/prayer-times/fajr" className="bg-white dark:bg-[#061C14] border border-gray-100 dark:border-primary-900 shadow-sm dark:shadow-none rounded-2xl p-4 text-center cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      <i className="fa-regular fa-moon text-lg"></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 mb-1 transition-colors">Fajr</p>
                    <p className="text-charcoal dark:text-white font-bold text-base">4:57 AM</p>
                  </Link>
                  {/* Sunrise */}
                  <div className="bg-white dark:bg-[#061C14] border border-gray-100 dark:border-primary-900 shadow-sm dark:shadow-none rounded-2xl p-4 text-center cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-accent group-hover:bg-accent-light/30 dark:group-hover:bg-accent/10 group-hover:text-accent-dark dark:group-hover:text-accent transition-colors">
                      <i className="fa-regular fa-sun text-lg"></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-accent-dark dark:group-hover:text-accent mb-1 transition-colors">Sunrise</p>
                    <p className="text-charcoal dark:text-white font-bold text-base">6:18 AM</p>
                  </div>
                  {/* Dhuhr (ACTIVE) */}
                  <Link href="/prayer-times/dhuhr" className="rounded-2xl p-4 text-center cursor-pointer bg-primary-700 dark:bg-primary-600 shadow-lg shadow-primary-700/20 transform scale-105 block relative z-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                      <i className="fa-solid fa-cloud-sun text-lg"></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-1 text-primary-200">Dhuhr</p>
                    <p className="font-bold text-base text-white">12:04 PM</p>
                    <span className="absolute -top-2.5 -right-2.5 bg-accent text-primary-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">NOW</span>
                  </Link>
                  {/* Asr */}
                  <Link href="/prayer-times/asr" className="bg-white dark:bg-[#061C14] border border-gray-100 dark:border-primary-900 shadow-sm dark:shadow-none rounded-2xl p-4 text-center cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      <i className="fa-regular fa-sun text-lg" style={{ transform: 'rotate(-20deg)' }}></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 mb-1 transition-colors">Asr</p>
                    <p className="text-charcoal dark:text-white font-bold text-base">3:32 PM</p>
                  </Link>
                  {/* Maghrib */}
                  <Link href="/prayer-times/maghrib" className="bg-white dark:bg-[#061C14] border border-gray-100 dark:border-primary-900 shadow-sm dark:shadow-none rounded-2xl p-4 text-center cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      <i className="fa-solid fa-cloud-sun-rain text-lg"></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 mb-1 transition-colors">Maghrib</p>
                    <p className="text-charcoal dark:text-white font-bold text-base">6:31 PM</p>
                  </Link>
                  {/* Isha */}
                  <Link href="/prayer-times/isha" className="bg-white dark:bg-[#061C14] border border-gray-100 dark:border-primary-900 shadow-sm dark:shadow-none rounded-2xl p-4 text-center cursor-pointer hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      <i className="fa-solid fa-star-and-crescent text-lg"></i>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 mb-1 transition-colors">Isha</p>
                    <p className="text-charcoal dark:text-white font-bold text-base">7:52 PM</p>
                  </Link>
                </div>
                
                {/* Day progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-softgray dark:text-gray-400 mb-2.5 font-semibold">
                    <span>Fajr 4:57 AM</span>
                    <span className="text-charcoal dark:text-white font-bold">Dhuhr &larr; <span className="text-primary-600 dark:text-primary-400 ml-1">Now</span></span>
                    <span>Isha 7:52 PM</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-primary-900/50 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(61,119,96,0.5)]" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE RESOURCES GRID (Slightly different background to distinguish section) */}
      <section className="py-16 relative bg-white/60 dark:bg-[#061C14]/50 border-y border-white/50 dark:border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-charcoal dark:text-white tracking-tight mb-2">Explore Resources</h2>
              <p className="text-softgray dark:text-gray-400 text-base">Comprehensive tools for your daily spiritual journey.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/quran" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-book-quran"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Read Quran</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Translations & Audio</p>
                </div>
              </div>
            </Link>

            <Link href="/hadith" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-scroll"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Hadith Collection</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Major Sunnah Books</p>
                </div>
              </div>
            </Link>

            <Link href="/duas" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-hands-praying"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Dua Library</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Supplications for daily life</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/calendar" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-calendar-days"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Islamic Calendar</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Hijri dates & Events</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/99-names" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-gem"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">99 Names of Allah</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Asma ul Husna & Meanings</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/qibla" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-compass"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Qibla Direction</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Accurate compass & map</p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. DAILY INSPIRATION — HADITH OF THE DAY (Distinguished background) */}
      <section className="py-20 relative bg-primary-50/20 dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <i className="fa-solid fa-star-and-crescent text-[10px]"></i> Daily Inspiration
            </span>
            <h2 className="font-bold text-3xl lg:text-4xl text-charcoal dark:text-white tracking-tight">Hadith of the Day</h2>
            <div className="w-24 h-1 bg-accent/40 dark:bg-accent/60 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-[#0A2B20] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 lg:p-12 relative border border-gray-100 dark:border-primary-800/50 overflow-hidden group">
            
            {/* Minimal Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 dark:bg-primary-900/20 rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-4 py-1.5 rounded-full border border-primary-100 dark:border-primary-800">
                <i className="fa-regular fa-bookmark"></i> Hadith
              </span>
              <span className="text-softgray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                Sahih Bukhari
              </span>
            </div>
            
            <div className="relative mb-8 pb-8 border-b border-gray-100 dark:border-primary-800/50 z-10">
              <p dir="rtl" lang="ar" className="font-arabic text-4xl lg:text-5xl leading-tight text-charcoal dark:text-white text-center">
                إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
              </p>
            </div>
            
            <blockquote className="text-xl lg:text-2xl text-charcoal dark:text-gray-200 leading-relaxed mb-8 font-medium italic text-center z-10 relative">
              "Actions are judged by intentions, and every person will have what they intended."
            </blockquote>
            
            <p className="text-softgray dark:text-gray-400 text-base leading-relaxed mb-10 text-center max-w-2xl mx-auto z-10 relative">
              This foundational hadith teaches that the validity and reward of any action depends entirely upon the sincerity of one's intention. A seemingly righteous act done for worldly reasons holds no spiritual weight, while even ordinary actions done for Allah's sake become acts of worship.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-2 z-10 relative">
              <div>
                <p className="text-base font-bold text-charcoal dark:text-white">Sahih Al-Bukhari</p>
                <p className="text-sm text-softgray dark:text-gray-400 mt-1">Book 1, Hadith 1 · Narrated by Umar ibn Al-Khattab (RA)</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" title="Copy">
                  <i className="fa-regular fa-copy"></i>
                </button>
                <button className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" title="Share">
                  <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                </button>
                <Link href="/hadith" className="flex items-center gap-2 bg-charcoal dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md dark:shadow-none">
                  Read More
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white dark:bg-[#0A2B20] rounded-2xl border border-gray-100 dark:border-primary-800/50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] transition-all">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center shrink-0">
              <i className="fa-solid fa-hands-praying text-primary-600 dark:text-primary-400 text-lg"></i>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Dua of the Day</p>
              <p dir="rtl" lang="ar" className="font-arabic text-2xl text-charcoal dark:text-white leading-relaxed mb-1">اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ</p>
              <p className="text-base text-softgray dark:text-gray-400 italic">"O Allah, I ask You for good health."</p>
            </div>
            <Link href="/duas" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-bold shrink-0 mt-2 sm:mt-0 px-4 py-2 bg-primary-50 dark:bg-primary-900/50 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-full transition-colors">
              View All
            </Link>
          </div>
          
        </div>
      </section>
    </>
  );
}
