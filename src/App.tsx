import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Heart, Send, Music, VolumeX } from 'lucide-react';
import { addGuest } from './api';

type Language = 'ru' | 'kk' | 'en';

const translations = {
  ru: {
    lang: "Рус",
    invite: "Приглашаем вас на нашу свадьбу",
    date: "22 Августа 2026",
    time: "Сбор гостей в 18:00",
    location: "Arai Hall",
    address: "г. Тараз, ул. Ташкентская 177",
    timerTitle: "До свадьбы осталось",
    days: "Дней",
    hours: "Часов",
    minutes: "Минут",
    seconds: "Секунд",
    rsvpTitle: "Подтвердите ваше присутствие",
    rsvpDesc: "Пожалуйста, ответьте до 1 августа 2026 года",
    namePlaceholder: "Ваше имя и фамилия",
    attendance: "Сможете ли вы прийти?",
    willAttend: "Да, с удовольствием!",
    willNotAttend: "К сожалению, не смогу",
    send: "Отправить",
    successMessage: "Спасибо за ваш ответ!",
    viewMap: "Посмотреть на карте",
    playMusic: "Включить музыку",
    pauseMusic: "Выключить музыку",
    poem1: "Сегодня традиция предков продолжается,",
    poem2: "Начинается первый благословенный шаг,",
    poem3: "Взявшись за руки, наша пара свила своё гнездо,",
    poem4: "И готова принять добрые благословения народа.",
    poemAddress: "Уважаемые родственники, братья, сваты, родня, кумы, двоюродные, друзья, коллеги и соседи!",
    poemInvite: "Приглашаем вас стать дорогими гостями на торжественный банкет",
    poemNames: "Арафат & Айданы",
    poemEnd: "С уважением, семья Ашировых",
    guestsLabel: "С кем придёте?",
    guestsPlaceholder: "С супругом(ой), семьёй..."
  },
  kk: {
    lang: "Қаз",
    invite: "Сіздерді үйлену тойымызға шақырамыз",
    date: "22 Тамыз 2026",
    time: "Қонақтардың жиналуы сағат 18:00",
    location: "Arai Hall",
    address: "Тараз қ., Ташкент көшесі, 177",
    timerTitle: "Тойға дейін қалды",
    days: "Күн",
    hours: "Сағат",
    minutes: "Минут",
    seconds: "Секунд",
    rsvpTitle: "Келетініңізді растауыңызды сұраймыз",
    rsvpDesc: "Жауабыңызды 2026 жылдың 1 тамызына дейін күтеміз",
    namePlaceholder: "Аты-жөніңіз",
    attendance: "Тойға келесіз бе?",
    willAttend: "Иә, қуана келемін!",
    willNotAttend: "Өкінішке орай, келе алмаймын",
    send: "Жіберу",
    successMessage: "Жауабыңызға рақмет!",
    viewMap: "Картадан көру",
    playMusic: "Әуен қосу",
    pauseMusic: "Әуенді тоқтату",
    poem1: "Бүгінде ата-дәстүр жалғасты,",
    poem2: "Басталмақшы құтты қадам алғашқы,",
    poem3: "Қол ұстасып отау тіккен қос ботам,",
    poem4: "Көпшіліктің ақ батасын алмақшы.",
    poemAddress: "Құрметті ағайын-туыс, бауырлар, құда-жекжат, нағашы-жиен, бөлелер, дос-жарандар, әріптестер мен көршілер!",
    poemInvite: "Некелесу тойына арналған мерекелік дастарқанымыздың қадірлі қонағы болуға шақырамыз!",
    poemNames: "Арафат & Айдана",
    poemEnd: "Құрметпен, Әшіровтар отбасы",
    guestsLabel: "Кіммен келесіз?",
    guestsPlaceholder: "Жұбаймен, отбасымен..."
  },
  en: {
    lang: "Eng",
    invite: "We invite you to our wedding",
    date: "August 22, 2026",
    time: "Reception at 18:00",
    location: "Arai Hall",
    address: "Taraz city, Tashkentskaya st. 177",
    timerTitle: "Time until the wedding",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    rsvpTitle: "Please RSVP",
    rsvpDesc: "Please respond by August 1, 2026",
    namePlaceholder: "Your full name",
    attendance: "Will you attend?",
    willAttend: "Yes, gladly!",
    willNotAttend: "Regretfully decline",
    send: "Send",
    successMessage: "Thank you for your response!",
    viewMap: "View on Map",
    playMusic: "Play Music",
    pauseMusic: "Pause Music",
    poem1: "Today the tradition of our ancestors continues,",
    poem2: "The first blessed step is about to begin,",
    poem3: "Hand in hand, our pair has built their home,",
    poem4: "And is ready to receive the good blessings of the people.",
    poemAddress: "Dear relatives, brothers, in-laws, godparents, cousins, friends, colleagues, and neighbors!",
    poemInvite: "We invite you to be honored guests at the wedding celebration",
    poemNames: "Arafat & Aidana",
    poemEnd: "With respect, The Ashirov Family",
    guestsLabel: "Who are you coming with?",
    guestsPlaceholder: "With spouse, family..."
  }
};

const TARGET_DATE = new Date('2026-08-22T18:00:00').getTime();

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const t = translations[lang];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    attending: 'yes',
    guests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          const handleInteraction = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
          };
          document.addEventListener('click', handleInteraction);
          document.addEventListener('touchstart', handleInteraction);
        });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGuest({
        name: rsvpForm.name,
        attending: rsvpForm.attending,
        guests: rsvpForm.guests,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error saving RSVP:", error);
      alert('Ошибка сохранения. Попробуйте ещё раз.');
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans selection:bg-[#C5A059] selection:text-white relative overflow-hidden">
      
      {/* Full-page background ornaments */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left side ornament - tall and elegant */}
        <img src="/bg-ornament.png" alt="" className="hidden sm:block absolute -left-4 top-0 h-full w-40 md:w-64 object-cover object-left opacity-[0.07]" />
        {/* Right side ornament - mirrored */}
        <img src="/bg-ornament.png" alt="" className="hidden sm:block absolute -right-4 top-0 h-full w-40 md:w-64 object-cover object-right opacity-[0.07] scale-x-[-1]" />
        {/* Central subtle watermark */}
        <img src="/bg-ornament.png" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[140vh] w-auto opacity-[0.03]" />
      </div>
      
      {/* Audio Element (User needs to add music.mp3 to public folder) */}
      <audio ref={audioRef} src="/toy-zhury.mp3" loop autoPlay playsInline />

      {/* Language Selector */}
      <div className="fixed top-3 right-3 z-50 flex gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-[#C5A059]/20">
        {(['kk', 'ru', 'en'] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`text-xs md:text-sm font-medium transition-colors ${lang === l ? 'text-[#C5A059]' : 'text-[#3E2723]/60 hover:text-[#3E2723]'}`}
          >
            {translations[l].lang}
          </button>
        ))}
      </div>

      {/* Music Toggle Button */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-md border border-[#C5A059]/30 rounded-full flex items-center justify-center shadow-lg text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all group"
      >
        {/* Play Music text circle image from user's upload */}
        <div className={`absolute inset-0 border-2 border-transparent rounded-full ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <img src="/text-circle.png" alt="" className="w-full h-full object-contain p-1 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        {isPlaying ? <VolumeX className="w-5 h-5 relative z-10" /> : <Music className="w-5 h-5 relative z-10" />}
      </button>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {/* Corner Ornaments */}
        <img src="/ornament-corner.png" alt="" className="absolute top-2 left-2 w-20 md:top-4 md:left-4 md:w-48 opacity-70" />
        <img src="/ornament-corner.png" alt="" className="absolute top-2 right-2 w-20 md:top-4 md:right-4 md:w-48 opacity-70 scale-x-[-1]" />
        
        {/* Branch / Leaves */}
        <motion.img 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          src="/leaves.png" 
          alt="" 
          className="w-32 md:w-64 mb-6 md:mb-8 opacity-90 object-contain" 
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center z-10 flex flex-col items-center px-2"
        >
          <h2 className="text-xs sm:text-sm md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#8A9A5B] mb-4 md:mb-6 font-semibold">
            {t.invite}
          </h2>
          
          <div className="relative flex items-center justify-center">
            {/* Circular Ornament Behind Names */}
            <img src="/ornament-circle.png" alt="" className="absolute w-[120%] h-[120%] max-w-none opacity-20 object-contain animate-[spin_60s_linear_infinite]" />
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-[#2C3E2D] leading-tight relative z-10">
              Арафат <br/>
              <span className="text-[#C5A059] text-4xl sm:text-5xl md:text-7xl italic my-2 md:my-4 block">&amp;</span>
              Айдана
            </h1>
          </div>
          
          <img src="/ornament-horizontal.png" alt="" className="w-48 md:w-96 my-6 md:my-10 opacity-60" />
          
          <p className="text-lg md:text-2xl font-light tracking-widest text-[#3E2723]">
            22 . 08 . 2026
          </p>
        </motion.div>
      </section>

      {/* Invitation Poem Section */}
      <section className="py-14 sm:py-20 px-4 bg-[#FDFBF7] relative overflow-hidden">
        <img src="/ornament-horizontal-thin.png" alt="" className="w-40 md:w-64 mx-auto mb-8 md:mb-12 opacity-30" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#2C3E2D]/80 leading-relaxed space-y-2">
            <span className="block">{t.poem1}</span>
            <span className="block">{t.poem2}</span>
            <span className="block">{t.poem3}</span>
            <span className="block">{t.poem4}</span>
          </p>

          <div className="my-8 md:my-10 flex items-center justify-center gap-3 md:gap-4">
            <div className="h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent to-[#C5A059]/40" />
            <img src="/leaves.png" alt="" className="w-8 md:w-10 opacity-40" />
            <div className="h-[1px] w-12 md:w-16 bg-gradient-to-l from-transparent to-[#C5A059]/40" />
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#3E2723]/70 leading-relaxed mb-6 md:mb-8 px-2">
            {t.poemAddress}
          </p>

          <p className="text-sm md:text-lg text-[#3E2723]/80 mb-4 px-2">
            {t.poemInvite}
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2C3E2D] my-4 md:my-6" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            {t.poemNames}
          </h2>

          {t.poemEnd && (
            <p className="text-sm md:text-lg text-[#3E2723]/80">
              {t.poemEnd}
            </p>
          )}
        </motion.div>

        <img src="/ornament-horizontal-thin.png" alt="" className="w-40 md:w-64 mx-auto mt-8 md:mt-12 opacity-30 rotate-180" />
      </section>

      {/* Details Section */}
      <section className="py-16 sm:py-24 px-4 bg-white relative overflow-hidden">
        {/* Vertical borders for desktop */}
        <img src="/ornament-vertical.png" alt="" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 h-full w-28 lg:w-40 object-contain opacity-40" />
        <img src="/ornament-vertical.png" alt="" className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-full w-28 lg:w-40 object-contain opacity-40 scale-x-[-1]" />
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            {/* Image Placeholder */}
            <div className="aspect-[3/4] bg-[#FDFBF7] rounded-t-full rounded-b-md p-3 border border-[#C5A059]/30 relative overflow-hidden shadow-xl mx-auto w-full max-w-[220px] sm:max-w-xs">
              <img 
                src="/photo-1.jpg" 
                alt="Wedding" 
                className="w-full h-full object-cover rounded-t-full rounded-b-sm"
              />
              <div className="absolute inset-0 rounded-t-full rounded-b-md border-2 border-white mix-blend-overlay pointer-events-none"></div>
            </div>

            <div className="flex flex-col gap-6 sm:gap-10 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5">
                <div className="p-3 md:p-4 bg-[#FDFBF7] rounded-full text-[#8A9A5B] shadow-sm border border-[#8A9A5B]/20 shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-1 md:mb-2 text-[#2C3E2D]">{t.date}</h3>
                  <p className="text-[#3E2723]/70 text-base md:text-lg">{t.time}</p>
                </div>
              </div>
              
              <img src="/ornament-horizontal-thin.png" alt="" className="w-1/2 md:w-3/4 mx-auto md:mx-0 opacity-40" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5">
                <div className="p-3 md:p-4 bg-[#FDFBF7] rounded-full text-[#8A9A5B] shadow-sm border border-[#8A9A5B]/20 shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-1 md:mb-2 text-[#2C3E2D]">{t.location}</h3>
                  <p className="text-[#3E2723]/70 mb-3 md:mb-4 text-base md:text-lg">{t.address}</p>
                  <a 
                    href="https://go.2gis.com/miaQn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs sm:text-sm font-medium text-white bg-[#8A9A5B] px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-[#728247] shadow-lg shadow-[#8A9A5B]/20 transition-all"
                  >
                    {t.viewMap}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timer Section */}
      <section className="py-16 sm:py-28 px-3 sm:px-4 relative overflow-hidden bg-gradient-to-b from-[#1a2a1b] via-[#2C3E2D] to-[#1a2a1b]">
        {/* Animated background ornaments */}
        <div className="absolute inset-0 opacity-5">
           <img src="/ornament-circle.png" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] object-contain animate-[spin_120s_linear_infinite]" />
        </div>
        <div className="absolute inset-0 opacity-5">
           <img src="/ornament-circle.png" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] object-contain animate-[spin_80s_linear_infinite_reverse]" />
        </div>

        {/* Corner ornaments */}
        <img src="/ornament-corner.png" alt="" className="absolute top-4 left-4 w-14 md:top-6 md:left-6 md:w-28 opacity-15" />
        <img src="/ornament-corner.png" alt="" className="absolute top-4 right-4 w-14 md:top-6 md:right-6 md:w-28 opacity-15 scale-x-[-1]" />
        <img src="/ornament-corner.png" alt="" className="absolute bottom-4 left-4 w-14 md:bottom-6 md:left-6 md:w-28 opacity-15 scale-y-[-1]" />
        <img src="/ornament-corner.png" alt="" className="absolute bottom-4 right-4 w-14 md:bottom-6 md:right-6 md:w-28 opacity-15 scale-x-[-1] scale-y-[-1]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Top ornament line */}
          <img src="/ornament-horizontal-thin.png" alt="" className="w-36 md:w-72 mx-auto mb-6 md:mb-10 opacity-30" />
          
          <h2 className="text-xl sm:text-2xl md:text-4xl font-serif mb-3 md:mb-4 text-[#FDFBF7]/90 tracking-wider">{t.timerTitle}</h2>
          <p className="text-[#C5A059]/60 text-xs sm:text-sm md:text-base tracking-[0.3em] md:tracking-[0.4em] uppercase mb-8 md:mb-14 font-light">22 . 08 . 2026</p>
          
          <div className="flex justify-center items-center gap-1.5 sm:gap-3 md:gap-6">
            {[
              { label: t.days, value: timeLeft.days },
              { label: t.hours, value: timeLeft.hours },
              { label: t.minutes, value: timeLeft.minutes },
              { label: t.seconds, value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-3 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-[#C5A059]/20 to-transparent rounded-2xl blur-sm group-hover:from-[#C5A059]/30 transition-all duration-500" />
                    {/* Card */}
                    <div className="relative w-[4rem] h-[5rem] sm:w-[4.5rem] sm:h-[5.5rem] md:w-32 md:h-40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-t-[1.5rem] md:rounded-t-[2rem] rounded-b-lg md:rounded-b-xl border border-[#C5A059]/20 flex items-center justify-center mb-3 md:mb-5 shadow-2xl shadow-black/30 overflow-hidden">
                      {/* Inner shine */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent rounded-t-[1.5rem] md:rounded-t-[2rem]" />
                      {/* Number with key for animation */}
                      <span key={item.value} className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#C5A059] relative z-10 tabular-nums drop-shadow-lg animate-[pulse_0.6s_ease-out]" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                        {item.value.toString().padStart(2, '0')}
                      </span>
                      {/* Bottom line accent */}
                      <div className="absolute bottom-0 inset-x-3 md:inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
                      {/* Top shine line that sweeps */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.25em] text-[#FDFBF7]/50 font-medium">
                    {item.label}
                  </span>
                </div>
                {/* Separator colon with pulse */}
                {idx < 3 && (
                  <div className="flex flex-col gap-1.5 md:gap-2 mb-6 md:mb-8 opacity-40 animate-[pulse_2s_ease-in-out_infinite]">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-[#C5A059]" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full bg-[#C5A059]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom ornament line */}
          <img src="/ornament-horizontal-thin.png" alt="" className="w-36 md:w-72 mx-auto mt-8 md:mt-14 opacity-30 rotate-180" />
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 sm:py-24 px-4 bg-[#FDFBF7] relative overflow-hidden">
        <img src="/ornament-horizontal.png" alt="" className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-96 opacity-40 -translate-y-1/2" />
        <img src="/ornament-vertical.png" alt="" className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 h-full w-28 lg:w-40 object-contain opacity-40" />
        <img src="/ornament-vertical.png" alt="" className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-full w-28 lg:w-40 object-contain opacity-40 scale-x-[-1]" />
        
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-8 md:mb-12 text-[#2C3E2D] leading-tight">{t.rsvpTitle}</h2>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleRsvpSubmit}
                className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-xl shadow-[#8A9A5B]/5 border border-[#8A9A5B]/10 text-left relative overflow-hidden"
              >
                <img src="/leaves.png" alt="" className="absolute -top-10 -right-10 w-24 md:w-32 opacity-20 rotate-45 pointer-events-none" />

                <div className="mb-5 md:mb-6 relative z-10">
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#2C3E2D] uppercase tracking-wider">
                    {t.namePlaceholder}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-[#FDFBF7] border border-[#8A9A5B]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/50 transition-all text-[#3E2723] text-sm sm:text-base"
                    placeholder="Аскар Аскаров"
                  />
                </div>

                <div className="mb-8 md:mb-10 relative z-10">
                  <label className="block text-xs sm:text-sm font-medium mb-3 md:mb-4 text-[#2C3E2D] uppercase tracking-wider">
                    {t.attendance}
                  </label>
                  <div className="space-y-2 md:space-y-3">
                    <label className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-[#FDFBF7] border border-[#8A9A5B]/20 rounded-xl cursor-pointer hover:border-[#8A9A5B] hover:bg-[#8A9A5B]/5 transition-all">
                      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rsvpForm.attending === 'yes' ? 'border-[#8A9A5B]' : 'border-gray-300'}`}>
                        {rsvpForm.attending === 'yes' && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#8A9A5B] rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={rsvpForm.attending === 'yes'}
                        onChange={(e) => setRsvpForm(prev => ({ ...prev, attending: e.target.value }))}
                        className="hidden"
                      />
                      <span className="text-[#3E2723] font-medium text-sm md:text-lg">{t.willAttend}</span>
                    </label>
                    <label className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-[#FDFBF7] border border-[#8A9A5B]/20 rounded-xl cursor-pointer hover:border-[#8A9A5B] hover:bg-[#8A9A5B]/5 transition-all">
                      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rsvpForm.attending === 'no' ? 'border-[#8A9A5B]' : 'border-gray-300'}`}>
                        {rsvpForm.attending === 'no' && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#8A9A5B] rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={rsvpForm.attending === 'no'}
                        onChange={(e) => setRsvpForm(prev => ({ ...prev, attending: e.target.value }))}
                        className="hidden"
                      />
                      <span className="text-[#3E2723] font-medium text-sm md:text-lg">{t.willNotAttend}</span>
                    </label>
                  </div>
                </div>

                {rsvpForm.attending === 'yes' && (
                  <div className="mb-8 md:mb-10 relative z-10">
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-[#2C3E2D] uppercase tracking-wider">
                      {t.guestsLabel}
                    </label>
                    <input
                      type="text"
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, guests: e.target.value }))}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-[#FDFBF7] border border-[#8A9A5B]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/50 transition-all text-[#3E2723] text-sm sm:text-base"
                      placeholder={t.guestsPlaceholder}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#8A9A5B] text-white py-3 md:py-4 rounded-xl font-medium tracking-widest uppercase hover:bg-[#728247] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8A9A5B]/20 relative z-10 text-sm md:text-base"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  {t.send}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 sm:p-12 rounded-2xl md:rounded-3xl shadow-xl shadow-[#8A9A5B]/5 border border-[#8A9A5B]/10 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#8A9A5B]/10 rounded-full flex items-center justify-center mb-4 md:mb-6 text-[#8A9A5B]">
                  <Heart className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-[#2C3E2D] mb-2 md:mb-3">{t.successMessage}</h3>
                <p className="text-[#3E2723]/70 text-base md:text-lg">
                  {rsvpForm.attending === 'yes' ? 'С нетерпением ждем вас!' : 'Нам будет вас не хватать.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}

