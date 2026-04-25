import Link from 'next/link';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-[70vh] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
      <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-500 mb-8 animate-bounce">
        <i className="fa-solid fa-person-digging text-4xl"></i>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
        We are working hard to bring you a premium {title} experience. This feature will be available very soon!
      </p>
      <div className="flex gap-4">
        <Link href="/" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20">
          Back to Home
        </Link>
        <Link href="/prayer-times" className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
          Prayer Times
        </Link>
      </div>
      
      {/* Decorative dots */}
      <div className="mt-16 flex gap-2">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-primary-100 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
}
