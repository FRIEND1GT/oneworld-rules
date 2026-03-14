import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shield, Menu, X, AlertTriangle, ChevronRight, Gavel, MessageSquare, Sun, Moon, Copy, Check, Lock, Unlock, Settings, Users, Database, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { rulesData, Section, Rule } from './data/rules';
import { discordRulesData } from './data/discordRules';

const Background = () => (
  <div className="fixed inset-0 -z-10 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
    <motion.div
      animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-300/40 dark:bg-emerald-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
    />
    <motion.div
      animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-300/40 dark:bg-teal-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
    />
    <motion.div
      animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-300/40 dark:bg-blue-900/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
    />
    <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.15)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'discord'>('minecraft');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // New state for copy and admin
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAdminText, setCopiedAdminText] = useState<number | null>(null);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const currentRulesData = activeTab === 'minecraft' ? rulesData : discordRulesData;
  const [activeSection, setActiveSection] = useState<string>(currentRulesData[0]?.title || '');

  const adminTemplates = [
    "Это проверка на читы. У тебя есть 5 минут, чтобы скинуть AnyDesk или Discord.",
    "Вы подозреваетесь в использовании стороннего ПО. Ждем вас в голосовом канале 'Проверка' в Discord.",
    "Отказ от проверки или выход с сервера во время проверки приведет к перманентной блокировке.",
    "Пожалуйста, скачайте программу AnyDesk с официального сайта (anydesk.com) и сообщите ваш рабочий адрес."
  ];

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset active section when tab changes
  useEffect(() => {
    setActiveSection(currentRulesData[0]?.title || '');
  }, [activeTab, currentRulesData]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentRulesData;
    
    const query = searchQuery.toLowerCase();
    return currentRulesData.map(section => {
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
  }, [searchQuery, currentRulesData]);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleCopyRule = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAdminText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAdminText(index);
    setTimeout(() => setCopiedAdminText(null), 2000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'O_M_G_YT228') {
      setIsAdmin(true);
      setIsAdminAuthOpen(false);
      setIsAdminPanelOpen(true);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Неверный пароль');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsAdminPanelOpen(false);
  };

  if (isLoading) {
    return (
      <div className={theme}>
        <Background />
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center selection:bg-emerald-500/30 transition-colors duration-500">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 relative"
          >
            {/* Decorative background glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-3xl -z-10"
            />
            
            <motion.div
              animate={{ 
                boxShadow: ["0px 0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 40px 10px rgba(16, 185, 129, 0.2)", "0px 0px 0px 0px rgba(16, 185, 129, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none"
            >
              <Shield className="text-emerald-500" size={64} />
            </motion.div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-widest uppercase">OneWorld</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm tracking-widest uppercase">Загрузка правил...</p>
            </div>
            <div className="w-48 h-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden mt-4">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme}>
      <Background />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-transparent text-zinc-600 dark:text-zinc-300 font-sans selection:bg-emerald-500/30 transition-colors duration-500 relative"
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-500 shadow-sm dark:shadow-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <button
                  onClick={() => isAdmin ? setIsAdminPanelOpen(true) : setIsAdminAuthOpen(true)}
                  className="p-2 -ml-2 lg:ml-0 text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  title="Панель администратора"
                >
                  {isAdmin ? <Unlock size={20} /> : <Lock size={20} />}
                </button>
                <div className="flex items-center gap-2">
                  <Shield className="text-emerald-500" size={28} />
                  <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">OneWorld</span>
                </div>
                
                {/* Desktop Tabs */}
                <div className="hidden lg:flex items-center gap-1 ml-8 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/50 relative">
                  <button
                    onClick={() => setActiveTab('minecraft')}
                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors z-10 ${
                      activeTab === 'minecraft' 
                        ? 'text-zinc-900 dark:text-white' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {activeTab === 'minecraft' && (
                      <motion.div layoutId="activeTabDesktop" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-md -z-10 shadow-sm" />
                    )}
                    <Shield size={16} />
                    Minecraft
                  </button>
                  <button
                    onClick={() => setActiveTab('discord')}
                    className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors z-10 ${
                      activeTab === 'discord' 
                        ? 'text-zinc-900 dark:text-white' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {activeTab === 'discord' && (
                      <motion.div layoutId="activeTabDesktop" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-md -z-10 shadow-sm" />
                    )}
                    <MessageSquare size={16} />
                    Discord
                  </button>
                </div>
              </div>
              
              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                <div className="flex-1 max-w-md hidden sm:block">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="text"
                      placeholder="Поиск по правилам..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm dark:shadow-none"
                    />
                  </div>
                </div>
                
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0, rotate: -90 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: 20, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            
            {/* Mobile Search & Tabs */}
            <div className="sm:hidden pb-4 space-y-4">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800/50 relative">
                <button
                  onClick={() => setActiveTab('minecraft')}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors z-10 ${
                    activeTab === 'minecraft' 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {activeTab === 'minecraft' && (
                    <motion.div layoutId="activeTabMobile" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-md -z-10 shadow-sm" />
                  )}
                  <Shield size={16} />
                  Minecraft
                </button>
                <button
                  onClick={() => setActiveTab('discord')}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors z-10 ${
                    activeTab === 'discord' 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {activeTab === 'discord' && (
                    <motion.div layoutId="activeTabMobile" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-md -z-10 shadow-sm" />
                  )}
                  <MessageSquare size={16} />
                  Discord
                </button>
              </div>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm dark:shadow-none transition-all"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className={`lg:w-72 shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block relative z-10`}>
              <motion.div 
                className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 shadow-xl shadow-zinc-200/20 dark:shadow-none transition-colors duration-500"
              >
                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6 px-4">
                  Оглавление
                </h3>
                <nav className="relative space-y-1.5 border-l-2 border-zinc-100 dark:border-zinc-800/50 ml-4 pl-4">
                  {currentRulesData.map((section) => {
                    const isActive = activeSection === section.title;
                    return (
                      <button
                        key={section.title}
                        onClick={() => scrollToSection(section.title)}
                        className={`relative w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors text-left group ${
                          isActive 
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="toc-elevator"
                            className="absolute -left-[18px] w-[4px] h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                          />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="toc-bg"
                            className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-xl -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                          />
                        )}
                        <span className="truncate relative z-10">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {filteredData.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="text-center py-20 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm rounded-3xl border border-zinc-200 dark:border-zinc-800/50"
                  >
                    <AlertTriangle className="mx-auto text-zinc-400 dark:text-zinc-600 mb-4" size={48} />
                    <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-2">Ничего не найдено</h2>
                    <p className="text-zinc-500">Попробуйте изменить поисковый запрос</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={activeTab + searchQuery}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-16"
                  >
                    {filteredData.map((section) => {
                      const isSecretSection = section.title === "Секретный раздел";
                      
                      return (
                      <section key={section.title} id={section.title} className="scroll-mt-32">
                        <motion.h2 
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className={`text-3xl font-extrabold mb-8 flex items-center gap-4 tracking-tight ${isSecretSection ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400' : 'text-zinc-900 dark:text-white'}`}
                        >
                          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${isSecretSection ? 'bg-gradient-to-br from-purple-400 to-pink-600 shadow-pink-500/25' : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'}`}>
                            <Gavel size={24} />
                          </span>
                          {section.title}
                        </motion.h2>
                        
                        <div className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-xl transition-colors duration-500 ${isSecretSection ? 'bg-white/40 dark:bg-zinc-900/40 border-pink-200/50 dark:border-pink-800/30 shadow-pink-500/10' : 'bg-white/60 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 shadow-zinc-200/20 dark:shadow-none'}`}>
                          <motion.div 
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                              hidden: { opacity: 0 },
                              show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                              }
                            }}
                            className={`divide-y ${isSecretSection ? 'divide-pink-100/50 dark:divide-pink-900/20' : 'divide-zinc-100 dark:divide-zinc-800/50'}`}
                          >
                            {section.rules.map((rule) => {
                              const isSecretRule = rule.id === '99.99';
                              
                              return (
                              <motion.div 
                                variants={{
                                  hidden: { opacity: 0, y: 20, scale: 0.98 },
                                  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                }}
                                whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(39, 39, 42, 0.4)' : 'rgba(250, 250, 250, 0.8)' }}
                                key={rule.id} 
                                onClick={() => handleCopyRule(rule.id)}
                                className={`p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:gap-8 group relative cursor-pointer overflow-hidden ${isSecretRule ? 'bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-pink-500/5' : ''}`}
                              >
                                {isSecretRule && (
                                  <motion.div 
                                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(236,72,153,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] pointer-events-none"
                                  />
                                )}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top ${isSecretRule ? 'bg-gradient-to-b from-purple-500 via-fuchsia-500 to-pink-500' : 'bg-emerald-500'}`} />
                                
                                <div className="shrink-0 pt-1 relative z-10">
                                  <span className={`inline-flex items-center gap-2 justify-center px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all duration-300 shadow-sm ${
                                    isSecretRule 
                                      ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400 group-hover:from-purple-500/20 group-hover:to-pink-500/20' 
                                      : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10'
                                  }`}>
                                    {copiedId === rule.id ? (
                                      <Check size={14} className={isSecretRule ? "text-pink-500" : "text-emerald-500"} />
                                    ) : (
                                      <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity absolute -ml-6" />
                                    )}
                                    {rule.id}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                  <p className={`text-base sm:text-lg leading-relaxed font-medium ${isSecretRule ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                    {rule.text}
                                  </p>
                                  {rule.punishment && (
                                    <div className="mt-4 flex items-start">
                                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm font-semibold text-red-600 dark:text-red-400 shadow-sm dark:shadow-none">
                                        <AlertTriangle size={14} />
                                        {rule.punishment}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )})}
                          </motion.div>
                        </div>
                      </section>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800/50 text-center text-sm text-zinc-500 pb-12 transition-colors duration-500">
                <p>OneWorld Minecraft Server &copy; {new Date().getFullYear()}</p>
                <p className="mt-2">Незнание правил не освобождает от ответственности.</p>
              </footer>
            </main>
          </div>
        </div>

        {/* Admin Auth Modal */}
        <AnimatePresence>
          {isAdminAuthOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Lock size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Вход для админов</h2>
                  </div>
                  <button onClick={() => setIsAdminAuthOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Пароль</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      placeholder="Введите пароль..."
                      autoFocus
                    />
                    {adminError && <p className="mt-2 text-sm text-red-500">{adminError}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors"
                  >
                    Войти
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel Modal */}
        <AnimatePresence>
          {isAdminPanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Панель управления</h2>
                      <p className="text-xs text-zinc-500">OneWorld Admin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleAdminLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <LogOut size={16} />
                      Выйти
                    </button>
                    <button onClick={() => setIsAdminPanelOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Шаблоны сообщений для проверок</h3>
                  <div className="space-y-3">
                    {adminTemplates.map((text, index) => (
                      <motion.div 
                        whileHover={{ scale: 1.01, y: -2 }}
                        key={index} 
                        className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                      >
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">{text}</p>
                        <button
                          onClick={() => handleCopyAdminText(text, index)}
                          className="shrink-0 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all duration-300"
                          title="Скопировать текст"
                        >
                          {copiedAdminText === index ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
