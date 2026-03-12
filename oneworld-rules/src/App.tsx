import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shield, Menu, X, AlertTriangle, ChevronRight, Gavel } from 'lucide-react';
import { rulesData, Section, Rule } from './data/rules';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(rulesData[0]?.title || '');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rulesData;
    
    const query = searchQuery.toLowerCase();
    return rulesData.map(section => {
      const filteredRules = section.rules.filter(rule => 
        rule.text.toLowerCase().includes(query) || 
        rule.id.includes(query) ||
        (rule.punishment && rule.punishment.toLowerCase().includes(query))
      );
      
      if (section.title.toLowerCase().includes(query) || filteredRules.length > 0) {
        return {
          ...section,
          rules: filteredRules.length > 0 ? filteredRules : section.rules
        };
      }
      return null;
    }).filter(Boolean) as Section[];
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    filteredData.forEach((section) => {
      const element = document.getElementById(section.title);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [filteredData]);

  const scrollToSection = (title: string) => {
    setActiveSection(title);
    setIsSidebarOpen(false);
    const element = document.getElementById(title);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-2">
                <Shield className="text-emerald-500" size={28} />
                <span className="text-xl font-bold text-white tracking-tight">OneWorld</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-md ml-8 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text"
                  placeholder="Поиск по правилам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className={`lg:w-72 shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">
                Оглавление
              </h3>
              <nav className="space-y-1">
                {rulesData.map((section) => (
                  <button
                    key={section.title}
                    onClick={() => scrollToSection(section.title)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                      activeSection === section.title 
                        ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <ChevronRight size={14} className={`transition-transform ${activeSection === section.title ? 'rotate-90 text-emerald-500' : 'opacity-0'}`} />
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-20">
                <AlertTriangle className="mx-auto text-zinc-600 mb-4" size={48} />
                <h2 className="text-xl font-medium text-white mb-2">Ничего не найдено</h2>
                <p className="text-zinc-500">Попробуйте изменить поисковый запрос</p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredData.map((section) => (
                  <section key={section.title} id={section.title} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Gavel size={18} />
                      </span>
                      {section.title}
                    </h2>
                    
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                      <div className="divide-y divide-zinc-800/50">
                        {section.rules.map((rule) => (
                          <div 
                            key={rule.id} 
                            className="p-4 sm:p-5 hover:bg-zinc-800/20 transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4 group"
                          >
                            <div className="shrink-0 pt-0.5">
                              <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-zinc-800 text-xs font-mono font-medium text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                                {rule.id}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                                {rule.text}
                              </p>
                              {rule.punishment && (
                                <div className="mt-3 flex items-start">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
                                    <AlertTriangle size={12} />
                                    {rule.punishment}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}
            
            <footer className="mt-20 pt-8 border-t border-zinc-800/50 text-center text-sm text-zinc-500 pb-12">
              <p>OneWorld Minecraft Server &copy; {new Date().getFullYear()}</p>
              <p className="mt-2">Незнание правил не освобождает от ответственности.</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
