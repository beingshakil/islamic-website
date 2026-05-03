import Link from 'next/link';

interface DailyInspirationProps {
  hadithData: any;
  duaData: any;
  loading: boolean;
}

export default function DailyInspiration({ hadithData, duaData, loading }: DailyInspirationProps) {
  return (
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
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 dark:bg-primary-900/20 rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-4 py-1.5 rounded-full border border-primary-100 dark:border-primary-800">
              <i className="fa-regular fa-bookmark"></i> Hadith
            </span>
            <span className="text-softgray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
              {hadithData?.collection || 'Sahih Bukhari'}
            </span>
          </div>
          
          <div className="relative mb-8 pb-8 border-b border-gray-100 dark:border-primary-800/50 z-10">
            <p dir="rtl" lang="ar" className="font-arabic text-4xl lg:text-5xl leading-tight text-charcoal dark:text-white text-center">
              {hadithData?.arabic || 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى'}
            </p>
          </div>
          
          <blockquote className="text-xl lg:text-2xl text-charcoal dark:text-gray-200 leading-relaxed mb-8 font-medium italic text-center z-10 relative">
            "{hadithData?.translation || 'Actions are judged by intentions, and every person will have what they intended.'}"
          </blockquote>
          
          <p className="text-softgray dark:text-gray-400 text-base leading-relaxed mb-10 text-center max-w-2xl mx-auto z-10 relative">
            {hadithData?.explanation || 'This foundational hadith teaches that the validity and reward of any action depends entirely upon the sincerity of one\'s intention. A seemingly righteous act done for worldly reasons holds no spiritual weight, while even ordinary actions done for Allah\'s sake become acts of worship.'}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-2 z-10 relative">
            <div>
              <p className="text-base font-bold text-charcoal dark:text-white">{hadithData?.collection || 'Sahih Al-Bukhari'}</p>
              <p className="text-sm text-softgray dark:text-gray-400 mt-1">{hadithData?.book || 'Book 1, Hadith 1'} · Narrated by {hadithData?.narrator || 'Umar ibn Al-Khattab (RA)'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${hadithData?.arabic}\n\n${hadithData?.translation}\n\n- ${hadithData?.narrator} (${hadithData?.collection})`);
                  alert('Hadith copied to clipboard!');
                }}
                className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" 
                title="Copy"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Hadith of the Day',
                      text: `${hadithData?.narrator}: ${hadithData?.translation}`,
                      url: window.location.href
                    });
                  } else {
                    alert('Share not supported on this browser');
                  }
                }}
                className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" 
                title="Share"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
              </button>
              <Link href="/hadith" className="flex items-center gap-2 bg-charcoal dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md dark:shadow-none">
                Read More
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Hadith Mini Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0A2B20] rounded-3xl p-8 border border-gray-100 dark:border-primary-800/50 shadow-sm h-full hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <i className="fa-solid fa-book-quran"></i>
                </div>
                <h3 className="font-bold text-lg text-charcoal dark:text-white">Hadith of the Day</h3>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-1/2 mt-6"></div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic mb-6">
                    "{hadithData?.text || 'He who follows a path in search of knowledge, Allah will make easy for him a path to Paradise.'}"
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">{hadithData?.source || 'Sahih Muslim'}</span>
                    <button className="text-softgray dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <i className="fa-solid fa-share-nodes"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Daily Dua Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0A2B20] rounded-3xl p-8 border border-gray-100 dark:border-primary-800/50 shadow-sm h-full hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/10 flex items-center justify-center text-accent-600 dark:text-accent-400">
                  <i className="fa-solid fa-hands-praying"></i>
                </div>
                <h3 className="font-bold text-lg text-charcoal dark:text-white">Daily Dua</h3>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-1/2 mt-6"></div>
                </div>
              ) : (
                <>
                  <p className="text-2xl text-right mb-4 font-arabic text-charcoal dark:text-white leading-loose">
                    {duaData?.arabic || 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {duaData?.translation || 'Our Lord, give us in this world that which is good and in the Hereafter that which is good.'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-widest">{duaData?.reference || 'Surah Al-Baqarah 201'}</span>
                    <button className="text-softgray dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                      <i className="fa-solid fa-play"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
