import React, { useState, useEffect } from 'react';
import { Smartphone, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: [], type: '' });
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if app is already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Check if iOS device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        setModalContent({
          title: "Install on iPhone / iPad",
          message: [
            "Open this site in Safari browser.",
            "Tap the 'Share' icon (📤) in the browser toolbar.",
            "Scroll down the share sheet menu.",
            "Tap 'Add to Home Screen' (➕) and click 'Add'!"
          ],
          type: "ios"
        });
      } else {
        setModalContent({
          title: "Installation Helper",
          message: [
            "Tap the three-dots menu (⋮ or ⋯) in your browser's top-right corner.",
            "Select 'Install app' or 'Add to Home screen' from the menu.",
            "Confirm the prompt to pin Sangam Player to your desktop or device launcher!"
          ],
          type: "generic"
        });
      }
      setShowModal(true);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <footer className="w-full bg-[#1A0005]/80 backdrop-blur-md border-t border-gold/15 py-10 px-6 relative z-30 mt-16 pb-28">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Social Links */}
        <div className="flex items-center gap-4 order-2 md:order-1">
          <a 
            href="https://github.com/sreeramgopalL" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-beige-light/80 transition-all border border-white/5 hover:border-gold/30 hover:-translate-y-0.5 shadow-md"
            title="GitHub"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-beige-light/80 transition-all border border-white/5 hover:border-gold/30 hover:-translate-y-0.5 shadow-md"
            title="LinkedIn"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-beige-light/80 transition-all border border-white/5 hover:border-gold/30 hover:-translate-y-0.5 shadow-md"
            title="Instagram"
          >
            <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="mailto:sreeramgopal@example.com" 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-beige-light/80 transition-all border border-white/5 hover:border-gold/30 hover:-translate-y-0.5 shadow-md"
            title="Email"
          >
            <Mail size={18} />
          </a>
        </div>

        {/* Creator Credit with Glitter Effect */}
        <div className="text-center order-1 md:order-2">
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-1">Created By</p>
          <h3 className="text-lg font-bold tracking-wide relative inline-block group">
            <span className="bg-gradient-to-r from-gold via-beige to-gold bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              Sreeram Gopal
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-beige transition-all duration-300 group-hover:w-full" />
          </h3>
          <p className="text-[10px] text-white/30 mt-1 flex items-center justify-center gap-1">
            Made with <Heart size={8} className="text-red-400 fill-red-400 animate-pulse" /> for pure vibes
          </p>
        </div>

        {/* PWA / Install Link */}
        <div className="order-3">
          {!isInstalled ? (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-[#B8860B] text-burgundy-deep font-semibold text-sm hover:scale-[1.03] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] border border-gold/40 cursor-pointer active:scale-95"
            >
              <Smartphone size={16} className="animate-bounce" />
              <span>Get it on Homescreen</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-semibold">
              <Smartphone size={14} className="text-gold" />
              <span>App Installed on Device</span>
            </div>
          )}
        </div>

      </div>

      {/* Premium Glassmorphic PWA Install Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0A0002]/85 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-md rounded-2xl border border-gold/30 p-6 shadow-[0_0_50px_rgba(212,175,55,0.25)] backdrop-blur-xl overflow-hidden animate-[scaleUp_0.3s_ease-out]"
            style={{
              background: 'linear-gradient(135deg, #2D0810 0%, #1A0005 100%)',
            }}
          >
            {/* Ambient gold blur */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-gold/10 blur-[50px] pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-4 relative z-10">
              <h4 className="font-bold text-lg text-gold flex items-center gap-2">
                <Smartphone size={20} className="text-gold animate-pulse" />
                {modalContent.title}
              </h4>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-gold/20 text-white/50 hover:text-gold transition-colors border border-white/5 cursor-pointer active:scale-90"
              >
                ✕
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-4 relative z-10">
              {modalContent.message.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#B8860B] text-burgundy-deep font-bold text-xs shadow-md">
                    {idx + 1}
                  </div>
                  <p className="text-beige-light/90 text-sm leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Close Button */}
            <div className="mt-6 flex justify-end relative z-10 border-t border-gold/10 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold text-beige-light/80 border border-white/10 hover:border-gold/30 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer active:scale-95"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
