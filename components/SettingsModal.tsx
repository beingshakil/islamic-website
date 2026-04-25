"use client";
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'location' | 'method'>('location');
  const [locationType, setLocationType] = useState<'auto' | 'manual'>('auto');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');
  const [isTimeAdjustmentOn, setIsTimeAdjustmentOn] = useState(false);

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Oman');
  const [selectedCity, setSelectedCity] = useState('Hayma');

  const countries = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Bangladesh', 'Oman', 'United Kingdom', 'United States'];
  const cities = ['Hayma', 'Dhaka', 'Chittagong', 'Siddhirganj', 'London', 'New York'];

  const filteredCountries = countries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
  const filteredCities = cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[32px] flex flex-col md:flex-row min-h-[500px] border border-transparent dark:border-gray-800 transition-colors duration-300 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#f8f9f8] dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col rounded-t-[32px] md:rounded-l-[32px] md:rounded-tr-none z-10 relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
              <i className="fa-solid fa-gear text-sm"></i>
            </div>
            <h2 className="font-bold text-gray-800 dark:text-white">Prayer Settings</h2>
          </div>

          <nav className="space-y-2 flex-grow">
            <button 
              onClick={() => setActiveTab('location')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'location' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <i className="fa-solid fa-location-dot"></i>
              Set Location
            </button>
            <button 
              onClick={() => setActiveTab('method')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'method' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <i className="fa-solid fa-stopwatch"></i>
              Time Method
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col p-8 md:p-10 relative bg-white dark:bg-gray-900 rounded-b-[32px] md:rounded-r-[32px] md:rounded-bl-none z-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
            {activeTab === 'location' ? 'Set Location' : 'Time Method'}
          </h3>

          <div className="flex-grow">
            {activeTab === 'location' ? (
              <div className="space-y-6">
                {/* Auto Location */}
                <label className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <input 
                    type="radio" 
                    name="locationType" 
                    checked={locationType === 'auto'} 
                    onChange={() => setLocationType('auto')}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-700 focus:ring-primary-500 bg-transparent" 
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 dark:text-gray-200">Auto Location</span>
                      <i className="fa-solid fa-crosshairs text-gray-400 dark:text-gray-600"></i>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hayma', Oman</p>
                  </div>
                </label>

                {/* Manual Location */}
                <div className={`p-4 rounded-2xl border transition-colors ${locationType === 'manual' ? 'border-primary-100 dark:border-primary-800/50 bg-gray-50/50 dark:bg-gray-800/20' : 'border-gray-100 dark:border-gray-800'}`}>
                  <label className="flex items-start gap-4 cursor-pointer mb-2">
                    <input 
                      type="radio" 
                      name="locationType" 
                      checked={locationType === 'manual'} 
                      onChange={() => setLocationType('manual')}
                      className="mt-1 w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-700 focus:ring-primary-500 bg-transparent" 
                    />
                    <span className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">Manual Location</span>
                  </label>
                  
                  {locationType === 'manual' && (
                    <div className="mt-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 pl-9">
                      {/* Searchable Country Dropdown */}
                      <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Select Country</label>
                        <button 
                          type="button"
                          onClick={() => { setIsCountryOpen(!isCountryOpen); setIsCityOpen(false); }}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <span>{selectedCountry}</span>
                          <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {isCountryOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                              <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                  type="text" 
                                  placeholder="Search..." 
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500 dark:text-gray-200"
                                />
                              </div>
                            </div>
                            <ul className="max-h-48 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                              {filteredCountries.map(country => (
                                <li 
                                  key={country}
                                  onClick={() => { setSelectedCountry(country); setIsCountryOpen(false); }}
                                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedCountry === country ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                  {country}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Searchable City Dropdown */}
                      <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Select City</label>
                        <button 
                          type="button"
                          onClick={() => { setIsCityOpen(!isCityOpen); setIsCountryOpen(false); }}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <span>{selectedCity}</span>
                          <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${isCityOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {isCityOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                              <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                  type="text" 
                                  placeholder="Search..." 
                                  value={citySearch}
                                  onChange={(e) => setCitySearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500 dark:text-gray-200"
                                />
                              </div>
                            </div>
                            <ul className="max-h-48 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                              {filteredCities.map(city => (
                                <li 
                                  key={city}
                                  onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedCity === city ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                                >
                                  {city}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Juristic Method</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                      <option>Standard (Shafi, Maliki, Hambali)</option>
                      <option>Hanafi</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Calculation Method</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                      <option>Karachi</option>
                      <option>University of Islamic Sciences, Karachi</option>
                      <option>Islamic Society of North America (ISNA)</option>
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Adjustment</span>
                  <button 
                    onClick={() => setIsTimeAdjustmentOn(!isTimeAdjustmentOn)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${isTimeAdjustmentOn ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isTimeAdjustmentOn ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Format</span>
                  <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full flex gap-1">
                    <button 
                      onClick={() => setTimeFormat('12')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timeFormat === '12' ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      12 Hours
                    </button>
                    <button 
                      onClick={() => setTimeFormat('24')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timeFormat === '24' ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      24 Hours
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800/50 min-w-[140px]"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-primary-700 dark:bg-primary-600 text-white font-bold hover:bg-primary-800 dark:hover:bg-primary-700 transition-shadow shadow-lg shadow-primary-700/20 dark:shadow-primary-900/40 min-w-[140px]"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
