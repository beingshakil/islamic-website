import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-dark-green-gradient pt-20 pb-10 border-t-4 border-accent overflow-hidden">
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('/pattern.svg')] bg-repeat z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Block */}
        <div className="bg-[#0B2A20] rounded-xl p-8 lg:p-10 mb-20 flex flex-col lg:flex-row items-center justify-between gap-10 border border-accent/40 shadow-2xl relative overflow-hidden">
          
          {/* Left section: Icon + Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 lg:w-[55%] relative z-10">
            
            {/* Geometric Icon */}
            <div className="relative flex-shrink-0 w-[72px] h-[72px] flex items-center justify-center group mt-1">
              <div className="absolute w-[60px] h-[60px] border-[1.5px] border-accent/90 rotate-45 transition-transform duration-700 group-hover:rotate-90"></div>
              <div className="absolute w-[60px] h-[60px] border-[1.5px] border-accent/90 transition-transform duration-700 group-hover:rotate-45"></div>
              <div className="absolute w-[46px] h-[46px] bg-[#EBE5D9] flex items-center justify-center z-10 shadow-sm border border-accent/30 rounded-sm">
                 <i className="fa-regular fa-envelope text-[24px] text-[#0B2A20]"></i>
              </div>
            </div>

            <div className="pt-1">
              <h3 className="text-[28px] sm:text-[32px] font-arabic text-white mb-1.5 tracking-wide leading-tight">Stay Up To Date</h3>
              <p className="text-[#EBE5D9]/80 text-sm sm:text-sm leading-relaxed max-w-md font-medium">
                Join our newsletter to receive weekly Islamic insights, Friday reminders, and app updates.
              </p>
            </div>
          </div>
          
          {/* Right section: Input + Button */}
          <div className="w-full lg:w-[45%] relative z-10">
            <form className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-5 py-3.5 bg-[#061612] border border-gray-700/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm shadow-inner" 
                required 
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-3.5 bg-[#347458] hover:bg-[#2A6048] border border-[#448C6F]/50 text-white font-medium rounded-lg transition-all shadow-md text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-accent group-hover:text-primary-900 transition-colors">
                <i className="fa-solid fa-moon text-sm"></i>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Prayer<span className="text-accent">Times</span></span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed mb-6">
              A comprehensive digital companion for Muslims worldwide. Experience accurate prayer times, read the Quran, and explore essential Islamic resources in a modern, serene interface.
            </p>
          </div>

          {/* Col 1 */}
          <div className="md:col-start-2">
            <h4 className="text-white font-bold tracking-wider uppercase text-xs mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/prayer-times" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Prayer Times Today</Link></li>
              <li><Link href="/prayer-times/monthly" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Monthly Timetable</Link></li>
              <li><Link href="/tools/calendar" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Islamic Calendar</Link></li>
              <li><Link href="/tools/zakat-calculator" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Zakat Calculator</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs mb-6 text-accent">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/quran" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Al-Quran Online</Link></li>
              <li><Link href="/hadith" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Hadith Collection</Link></li>
              <li><Link href="/duas" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Dua Library</Link></li>
              <li><Link href="/tools/99-names" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">99 Names of Allah</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs mb-6 text-accent">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link href="#" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Contact Support</Link></li>
              <li><Link href="#" className="text-primary-100 hover:text-white hover:translate-x-1 inline-block transition-all">Mobile Apps</Link></li>
              <li><Link href="#" className="text-accent font-bold hover:text-white hover:translate-x-1 inline-block transition-all">Donate / Support Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Socials */}
        <div className="border-t border-primary-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <p className="text-sm text-primary-300 text-center md:text-left">
            &copy; 2026 PrayerTimes Portal. All rights reserved. 
            <span className="mx-3 opacity-50">|</span> 
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link> 
            <span className="mx-3 opacity-50">|</span> 
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </p>

          <div className="flex space-x-3">
            <Link href="#" className="w-10 h-10 rounded-full bg-primary-800/50 border border-primary-700 flex items-center justify-center text-primary-200 hover:bg-accent hover:text-primary-900 hover:border-accent transition-all duration-300">
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-primary-800/50 border border-primary-700 flex items-center justify-center text-primary-200 hover:bg-accent hover:text-primary-900 hover:border-accent transition-all duration-300">
              <i className="fa-brands fa-twitter text-sm"></i>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-primary-800/50 border border-primary-700 flex items-center justify-center text-primary-200 hover:bg-accent hover:text-primary-900 hover:border-accent transition-all duration-300">
              <i className="fa-brands fa-instagram text-sm"></i>
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-primary-800/50 border border-primary-700 flex items-center justify-center text-primary-200 hover:bg-accent hover:text-primary-900 hover:border-accent transition-all duration-300">
              <i className="fa-brands fa-youtube text-sm"></i>
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
