import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link as RouterLink, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

// Komponen Link Pintar (Smart Link)
// Menghindari eror "Cannot destructure property 'basename'" ketika dijalankan di luar konteks Router (Preview Mandiri)
const Link = ({ to, children, className, style, ...props }) => {
  const routerContext = useContext(NavigationContext);
  const isInsideRouter = !!routerContext;
  const isAnchor = typeof to === 'string' && to.startsWith('#');

  const handleAnchorClick = (e) => {
    if (isAnchor) {
      e.preventDefault();
      const targetId = to.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (isInsideRouter) {
    return (
      <RouterLink to={to} className={className} style={style} onClick={isAnchor ? handleAnchorClick : undefined} {...props}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={to} className={className} style={style} onClick={handleAnchorClick} {...props}>
      {children}
    </a>
  );
};

export default function App() {
  // State navigasi dan scroll tracker
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State interaktif Modal Detail & Penyewaan Produk
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bookingDays, setBookingDays] = useState(1);
  const [startDate, setStartDate] = useState('2026-06-03');

  // State penyaringan kategori produk
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State Toast Notifikasi
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // State obrolan dengan pemilik barang
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([
    {
      owner: 'Arif Rent',
      productName: 'Kamera Sony A6400 Mirrorless Kit',
      messages: [
        { id: 1, sender: 'owner', text: 'Halo! Selamat datang di Arif Rent. Ada yang bisa kami bantu mengenai sewa Kamera Sony A6400?', time: '10:30' }
      ],
      unread: true
    }
  ]);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const products = [
    {
      id: 1,
      name: 'Kamera Sony A6400 Mirrorless Kit',
      category: 'Fotografi',
      price: 150000,
      rating: 4.9,
      reviews: 48,
      location: 'Bandung',
      owner: 'Arif Rent',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
      badge: 'Terlaris',
      desc: 'Sony A6400 Mirrorless Camera dengan Lensa Kit 16-50mm. Kondisi sensor bersih, autofokus sangat cepat, cocok untuk vlog maupun videografi semi-pro.'
    },
    {
      id: 2,
      name: 'Tenda Camping Dome 4 Orang',
      category: 'Camping',
      price: 45000,
      rating: 4.8,
      reviews: 120,
      location: 'Yogyakarta',
      owner: 'Merapi Adventure',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600',
      badge: 'Rekomendasi',
      desc: 'Tenda dome double layer tahan air (waterproof). Kapasitas 4 orang dewasa, frame fiber kokoh, pasak baja lengkap, sangat mudah didirikan.'
    },
    {
      id: 3,
      name: 'Drone DJI Mini 2 Fly More Combo',
      category: 'Drone',
      price: 250000,
      rating: 4.9,
      reviews: 32,
      location: 'Jakarta',
      owner: 'SkyView Rental',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
      badge: 'Premium',
      desc: 'Drone ultra ringan 249 gram. Mampu merekam video 4K, kestabilan gimbal 3-axis, jangkauan terbang jauh, baterai cadangan lengkap.'
    },
    {
      id: 4,
      name: 'PlayStation 5 Slim 1TB SSD',
      category: 'Gaming',
      price: 150000,
      rating: 4.7,
      reviews: 19,
      location: 'Surabaya',
      owner: 'GameStation',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600',
      badge: 'Terlaris',
      desc: 'Konsol game PlayStation 5 versi Slim terbaru dengan kapasitas penyimpanan 1TB SSD. Dilengkapi 2 controller DualSense Wireless asli.'
    },
    {
      id: 5,
      name: 'Gitar Akustik Yamaha FS800',
      category: 'Musik',
      price: 60000,
      rating: 4.8,
      reviews: 25,
      location: 'Tangerang',
      owner: 'Melodi Rent',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600',
      badge: 'Baru',
      desc: 'Gitar akustik dengan bodi kayu spruce solid. Suara sangat nyaring dan garing, jarak senar rendah sehingga nyaman di jari.'
    },
    {
      id: 6,
      name: 'Sepeda Gunung Polygon Cascade 4',
      category: 'Olahraga',
      price: 75000,
      rating: 4.7,
      reviews: 42,
      location: 'Malang',
      owner: 'GoPedal Store',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600',
      badge: 'Terlaris',
      desc: 'Sepeda gunung tangguh dengan bodi alloy ringan. Dilengkapi shifter Shimano 21-speed dan suspensi depan empuk untuk medan semi-offroad.'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Deteksi section aktif sederhana
      const sections = ['home', 'kategori', 'produk', 'cara-kerja', 'tentang'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memfilter produk berdasarkan pilihan kategori (tanpa useMemo)
  const filteredProducts = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Helper pemicu notifikasi tiruan
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
    setTimeout(() => {
      setShowNotificationToast(false);
    }, 4000);
  };

  // Handler simulasi submit transaksi sewa
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const totalPrice = selectedProduct.price * bookingDays;
    setSelectedProduct(null);
    triggerToast(`Sewa berhasil! Pengajuan peminjaman "${selectedProduct.name}" selama ${bookingDays} hari dengan total ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)} sedang diproses oleh pemilik.`);
  };

  // Meluncurkan obrolan baru dengan mitra pemilik barang
  const startChatWithOwner = (product) => {
    // Cari apakah sesi obrolan dengan pemilik ini sudah ada
    const existingIndex = chatSessions.findIndex(s => s.owner === product.owner);
    
    if (existingIndex !== -1) {
      setActiveSessionIndex(existingIndex);
      // Update info produk aktif
      const updated = [...chatSessions];
      updated[existingIndex].productName = product.name;
      setChatSessions(updated);
    } else {
      const newSession = {
        owner: product.owner,
        productName: product.name,
        messages: [
          { id: 1, sender: 'owner', text: `Halo! Saya dari ${product.owner}. Terima kasih sudah tertarik dengan ${product.name}. Ada yang bisa kami bantu?`, time: 'Baru saja' }
        ],
        unread: false
      };
      setChatSessions(prev => [newSession, ...prev]);
      setActiveSessionIndex(0);
    }
    
    setSelectedProduct(null); // Tutup modal detail produk
    setIsChatOpen(true); // Buka panel chat mengambang
    triggerToast(`Membuka ruang percakapan dengan ${product.owner}...`);
  };

  // Mengirim pesan di panel obrolan
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentSession = chatSessions[activeSessionIndex];
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSessions = [...chatSessions];
    updatedSessions[activeSessionIndex].messages.push(userMsg);
    setChatSessions(updatedSessions);
    const sentText = chatInput;
    setChatInput('');

    // Auto-scroll ke pesan terbaru
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Simulasi jawaban bot dari pemilik barang setelah 1.5 detik
    setTimeout(() => {
      let replyText = `Halo kak! Tentu, untuk ${currentSession.productName} di ${currentSession.owner} saat ini dalam kondisi prima dan siap pakai. Apakah mau sewa dari tanggal ${startDate} ini?`;
      
      // Kustomisasi reply berdasarkan nama mitra
      if (currentSession.owner === 'Arif Rent') {
        replyText = `Halo kak! Lensa dan sensor kamera dijamin bersih, autofokus tajam. Untuk penyewaan tanggal tersebut unitnya masih ready. Mau disewa berapa hari kak?`;
      } else if (currentSession.owner === 'Merapi Adventure') {
        replyText = `Halo petualang! Tenda sudah kami bersihkan dan double-check frame-nya, aman tahan badai. Mau sekalian disewakan sleeping bag atau nesting juga?`;
      } else if (currentSession.owner === 'GameStation') {
        replyText = `Ready kak! PS5 kami sudah terisi game-game seru (FC 26, GTA V, dll). Dapat 2 controller wireless. Silakan diajukan sewanya ya biar kami keep unitnya!`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'owner',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalSessions = [...chatSessions];
      finalSessions[activeSessionIndex].messages.push(botMsg);
      finalSessions[activeSessionIndex].unread = true;
      setChatSessions(finalSessions);

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  return (
    <>
      {/* CDN Bootstrap 5 & Bootstrap Icons */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet" />
      
      {/* Google Fonts (Plus Jakarta Sans & Inter) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* STYLING CUSTOM - PREMIUM DARK MODE HOBIRENT */}
      <style>{`
        :root {
          --primary: #F97316;
          --primary-hover: #EA580C;
          --accent: #FB923C;
          --accent-hover: #FDBA74;
          --bg-main: #0F172A;
          --bg-secondary: #111827;
          --bg-card: #1E293B;
          --hover-surface: #334155;
          --slate-900: #F8FAFC; /* Primary Text */
          --slate-800: #CBD5E1; /* Secondary Text */
          --slate-400: #94A3B8; /* Muted Text */
          --border-color: rgba(249, 115, 22, 0.15);
          --font-jakarta: 'Plus Jakarta Sans', sans-serif;
          --font-inter: 'Inter', sans-serif;
        }

        body {
          font-family: var(--font-inter);
          color: var(--slate-800);
          background-color: var(--bg-main);
          overflow-x: hidden;
        }

        h1, h2, h3, h4, .font-heading {
          font-family: var(--font-jakarta);
          color: var(--slate-900);
        }

        /* Glassmorphism Navbar (No white) */
        .navbar-hobi {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: transparent;
        }
        .navbar-hobi.scrolled {
          background-color: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid var(--border-color);
          padding: 12px 0;
        }

        /* Active Nav Link Marker */
        .nav-link-hobi {
          position: relative;
          font-weight: 600;
          color: var(--slate-800);
          transition: color 0.3s ease;
          font-family: var(--font-jakarta);
        }
        .nav-link-hobi:hover, .nav-link-hobi.active {
          color: var(--primary);
        }
        .nav-link-hobi::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--primary);
          transition: width 0.3s ease;
        }
        .nav-link-hobi:hover::after, .nav-link-hobi.active::after {
          width: 100%;
        }

        /* Tombol Premium Orange */
        .btn-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: var(--slate-900);
          border: none;
          font-weight: 700;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.5);
          color: var(--slate-900);
        }
        .btn-outline-custom {
          border: 2px solid var(--border-color);
          background-color: transparent;
          color: var(--slate-800);
          font-weight: 700;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .btn-outline-custom:hover {
          background-color: var(--hover-surface);
          color: var(--slate-900);
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        /* Animasi Mengambang (Floating Graphic) */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        /* Glass Card Effect Premium Dark */
        .card-glass {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-glass:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(249, 115, 22, 0.15);
          border-color: var(--primary);
        }

        /* Kategori Card */
        .category-card {
          border-radius: 20px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.1);
        }
        .category-icon {
          font-size: 2.5rem;
          display: inline-block;
          margin-bottom: 1.25rem;
          transition: transform 0.3s ease;
        }
        .category-card:hover .category-icon {
          transform: scale(1.15) rotate(5deg);
        }

        /* Timeline Cara Kerja */
        .timeline-step {
          position: relative;
        }
        .timeline-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: var(--slate-900);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
          z-index: 2;
          position: relative;
        }

        /* Custom Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }
        .modal-container {
          background: var(--bg-card);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          width: 100%;
          max-width: 440px;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Custom Dark Mode Footer & Classes */
        .bg-dark-custom {
          background-color: var(--bg-secondary) !important;
        }
        .text-slate-100 {
          color: var(--slate-900) !important;
        }
        .text-slate-300 {
          color: var(--slate-800) !important;
        }
        .text-slate-400 {
          color: var(--slate-400) !important;
        }
        .text-orange-custom {
          color: var(--primary) !important;
        }
        .bg-orange-subtle-dark {
          background-color: rgba(249, 115, 22, 0.1) !important;
          border: 1px solid var(--border-color);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* --- STYLING SISTEM CHAT PREMIUM --- */
        .chat-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: var(--slate-900);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(249, 115, 22, 0.4);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .chat-toggle-btn:hover {
          transform: scale(1.1) rotate(10deg);
        }
        .chat-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: #EF4444;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-main);
        }
        .chat-window {
          width: 380px;
          height: 520px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          animation: slideUpChat 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUpChat {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .chat-header {
          background-color: var(--bg-secondary);
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: justify;
        }
        .chat-sidebar {
          width: 80px;
          border-right: 1px solid var(--border-color);
          background-color: rgba(17, 24, 39, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          gap: 12px;
          overflow-y: auto;
        }
        .chat-avatar-tab {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--hover-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          font-size: 13px;
          color: var(--slate-800);
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
        }
        .chat-avatar-tab.active {
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.2);
        }
        .chat-body-area {
          flex-grow: 1;
          display: flex;
          overflow: hidden;
        }
        .chat-feed {
          flex-grow: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: rgba(15, 23, 42, 0.6);
        }
        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .chat-bubble.owner {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--slate-900);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .chat-bubble.user {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: var(--slate-900);
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        .chat-input-bar {
          padding: 12px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }
      `}</style>

      {/* 1. NAVBAR TRANSPARAN FIXED */}
      <nav className={`navbar navbar-expand-lg fixed-top navbar-hobi py-3 ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          
          {/* Logo Brand */}
          <Link to="#home" className="navbar-brand d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3 shadow-sm" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}>
              <i className="bi bi-rocket-takeoff-fill fs-5"></i>
            </div>
            <span className="fw-black text-slate-100 fs-3 tracking-tight" style={{ fontWeight: 850 }}>
              Hobi<span className="text-orange-custom">Rent</span>
            </span>
          </Link>

          {/* Toggle Menu Mobile */}
          <button 
            className="navbar-toggler border-0 p-2 text-slate-100" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="navbarNav" 
            aria-expanded={isMobileMenuOpen} 
            aria-label="Toggle navigation"
          >
            <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-justify'} fs-2`}></i>
          </button>

          {/* Menu Links */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto my-3 my-lg-0 gap-1 gap-lg-3 text-center">
              <li className="nav-item">
                <Link 
                  to="#home" 
                  className={`nav-link nav-link-hobi px-3 ${activeSection === 'home' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="#kategori" 
                  className={`nav-link nav-link-hobi px-3 ${activeSection === 'kategori' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kategori
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="#produk" 
                  className={`nav-link nav-link-hobi px-3 ${activeSection === 'produk' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produk
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="#cara-kerja" 
                  className={`nav-link nav-link-hobi px-3 ${activeSection === 'cara-kerja' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cara Kerja
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="#tentang" 
                  className={`nav-link nav-link-hobi px-3 ${activeSection === 'tentang' ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tentang
                </Link>
              </li>
            </ul>

            {/* Auth Actions */}
            <div className="d-flex justify-content-center gap-2 pt-2 pt-lg-0">
              <Link
                to="/login"
                className="btn btn-outline-custom px-4 py-2.5 rounded-3 border-0 text-slate-300 font-bold text-decoration-none"
              >
                Login Admin
              </Link>
              <button 
                onClick={() => triggerToast('Terima kasih atas antusiasme Anda! Sistem registrasi saat ini sedang dimigrasikan ke production.')} 
                className="btn btn-gradient px-4 py-2.5 shadow-sm rounded-3 fw-bold"
              >
                Daftar
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* 2. HERO SECTION FULL SCREEN */}
      <section id="home" className="min-vh-100 d-flex align-items-center relative pt-5 overflow-hidden" style={{ background: 'radial-gradient(100% 100% at 50% 0%, rgba(249, 115, 22, 0.08) 0%, rgba(15, 23, 42, 0) 80%)' }}>
        <div className="container py-5 mt-4 mt-lg-0">
          <div className="row align-items-center g-5">
            
            {/* Teks Deskripsi Kiri */}
            <div className="col-lg-6 text-center text-lg-start space-y-4">
              <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill bg-dark-custom border shadow-sm mb-3" style={{ borderColor: 'var(--border-color)' }}>
                <span className="badge bg-primary rounded-pill px-2.5 py-1.5" style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: '#0F172A' }}>Update 2026</span>
                <span className="text-slate-300 fw-bold" style={{ fontSize: '0.85rem' }}>Sewa Hobi, Lebih Mudah & Fleksibel</span>
              </div>
              
              <h1 className="display-4 fw-black text-slate-100 mb-4 tracking-tight" style={{ fontWeight: 850, lineHeight: 1.15 }}>
                Hobi Tanpa Batas, <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}>Sewa Peralatan Favoritmu</span> Dengan Mudah
              </h1>
              
              <p className="lead text-slate-300 mb-5" style={{ fontSize: '1.15rem', lineHeight: '1.8' }}>
                HobiRent membantu Anda menyewa perlengkapan fotografi, camping, gaming, olahraga, dan berbagai kebutuhan hobi lainnya dengan cepat, hemat, dan terjamin aman.
              </p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                <Link to="#produk" className="btn btn-gradient btn-lg px-5 py-3.5 d-flex align-items-center justify-content-center gap-2.5">
                  <span>Mulai Menyewa</span>
                  <i className="bi bi-arrow-right-short fs-4"></i>
                </Link>
                <Link to="#kategori" className="btn btn-outline-custom btn-lg px-5 py-3.5 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-grid-fill text-orange-custom"></i>
                  <span>Lihat Kategori</span>
                </Link>
              </div>

              {/* Tag Aktivitas Populer */}
              <div className="mt-5 pt-4 border-top border-secondary border-opacity-25 d-none d-sm-block">
                <p className="text-uppercase text-slate-400 fw-bold mb-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>Fokus Perlengkapan & Komunitas</p>
                <div className="d-flex flex-wrap gap-3 text-slate-300 opacity-75">
                  <span className="d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '13.5px' }}>
                    <i className="bi bi-camera text-orange-custom"></i> Fotografi
                  </span>
                  <span className="d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '13.5px' }}>
                    <i className="bi bi-signpost-2 text-orange-custom"></i> Camping
                  </span>
                  <span className="d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '13.5px' }}>
                    <i className="bi bi-controller text-orange-custom"></i> Gaming
                  </span>
                  <span className="d-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '13.5px' }}>
                    <i className="bi bi-bicycle text-orange-custom"></i> Bersepeda
                  </span>
                </div>
              </div>
            </div>

            {/* Ilustrasi Dashboard Kanan */}
            <div className="col-lg-6 hero-img-wrapper">
              <div className="position-relative animate-float">
                {/* Float Card 1 - Camera DSLR */}
                <div className="position-absolute bg-dark-custom p-3 rounded-4 shadow-lg border d-flex align-items-center gap-3" style={{ top: '15%', left: '-10%', zIndex: 10, borderColor: 'var(--border-color)' }}>
                  <div className="bg-orange-subtle-dark text-orange-custom p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-camera-fill fs-5"></i>
                  </div>
                  <div>
                    <small className="text-slate-400 d-block" style={{ fontSize: '10px' }}>Kamera DSLR</small>
                    <strong className="text-slate-100" style={{ fontSize: '13px' }}>Sony A7 IV Ready</strong>
                  </div>
                </div>

                {/* Float Card 2 - Tent Camping */}
                <div className="position-absolute bg-dark-custom p-3 rounded-4 shadow-lg border d-flex align-items-center gap-3" style={{ bottom: '15%', right: '-8%', zIndex: 10, borderColor: 'var(--border-color)' }}>
                  <div className="bg-orange-subtle-dark text-orange-custom p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-tree-fill fs-5"></i>
                  </div>
                  <div>
                    <small className="text-slate-400 d-block" style={{ fontSize: '10px' }}>Alat Camping</small>
                    <strong className="text-slate-100" style={{ fontSize: '13px' }}>Tenda Kapasitas 4</strong>
                  </div>
                </div>

                {/* Main 3D Mockup Box */}
                <div className="p-3 bg-dark-custom rounded-5 shadow-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="rounded-4 overflow-hidden position-relative" style={{ height: '400px', backgroundColor: '#1e293b' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800" 
                      alt="[Ilustrasi perlengkapan hobi modern]" 
                      className="w-100 h-100 object-cover opacity-75" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 d-flex align-items-end" style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                      <div className="text-white">
                        <span className="badge bg-warning text-dark mb-2">Terpopuler</span>
                        <h4 className="text-white fw-bold m-0">Koleksi Alat Hobi 2026</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATISTIK */}
      <section className="py-5 bg-dark-custom border-y border-secondary border-opacity-15 position-relative">
        <div className="container">
          <div className="row g-4 justify-content-center">
            
            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 bg-dark bg-opacity-50 text-center border border-secondary border-opacity-10 hover-lift">
                <div className="display-6 fw-extrabold text-orange-custom" style={{ fontWeight: 800 }}>5.000+</div>
                <div className="text-slate-400 text-uppercase fw-bold mt-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Produk Rental</div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 bg-dark bg-opacity-50 text-center border border-secondary border-opacity-10 hover-lift">
                <div className="display-6 fw-extrabold text-orange-custom" style={{ fontWeight: 800 }}>1.200+</div>
                <div className="text-slate-400 text-uppercase fw-bold mt-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Pengguna Aktif</div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 bg-dark bg-opacity-50 text-center border border-secondary border-opacity-10 hover-lift">
                <div className="display-6 fw-extrabold text-orange-custom" style={{ fontWeight: 800 }}>250+</div>
                <div className="text-slate-400 text-uppercase fw-bold mt-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Mitra Rental</div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="p-4 rounded-4 bg-dark bg-opacity-50 text-center border border-secondary border-opacity-10 hover-lift">
                <div className="display-6 fw-extrabold text-orange-custom" style={{ fontWeight: 800 }}>98%</div>
                <div className="text-slate-400 text-uppercase fw-bold mt-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Kepuasan Pelanggan</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. KATEGORI POPULER */}
      <section id="kategori" className="py-16 sm:py-24" style={{ background: 'radial-gradient(ellipse at bottom, rgba(249, 115, 22, 0.05), transparent)' }}>
        <div className="container">
          
          <div className="text-center max-w-2xl mx-auto mb-5 pb-3">
            <span className="text-orange-custom fw-bold text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Katalog Terpilih</span>
            <h2 className="display-5 fw-extrabold text-slate-100 mt-2 mb-3" style={{ fontWeight: 800 }}>Pilih Kategori Hobi Anda</h2>
            <p className="lead text-slate-300" style={{ fontSize: '1.05rem' }}>
              Kami menyediakan beragam pilihan kategori peralatan hobi yang terjamin kualitasnya langsung dari para pehobi profesional.
            </p>
          </div>

          <div className="row g-4">
            
            {/* Fotografi */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { setSelectedCategory('Fotografi'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">📸</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Fotografi</h5>
              </div>
            </div>

            {/* Camping */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { setSelectedCategory('Camping'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">🏕️</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Camping</h5>
              </div>
            </div>

            {/* Gaming */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { setSelectedCategory('Gaming'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">🎮</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Gaming</h5>
              </div>
            </div>

            {/* Olahraga */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { setSelectedCategory('Olahraga'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">🚴</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Olahraga</h5>
              </div>
            </div>

            {/* Memancing */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { triggerToast('Kategori Memancing baru saja diperbarui! Silakan cek kembali.'); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">🎣</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Memancing</h5>
              </div>
            </div>

            {/* Drone */}
            <div className="col-6 col-md-4 col-lg-2">
              <div onClick={() => { setSelectedCategory('Drone'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="category-card h-100">
                <span className="category-icon text-orange-custom">🚁</span>
                <h5 className="fw-bold m-0 text-slate-100 fs-6">Drone</h5>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SEKSI PRODUK POPULER (FEATURED PRODUCTS) */}
      <section id="produk" className="py-16 sm:py-24 bg-dark-custom border-top border-secondary border-opacity-10">
        <div className="container">
          
          <div className="text-center max-w-2xl mx-auto mb-5 pb-3">
            <span className="text-orange-custom fw-bold text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Peralatan Populer</span>
            <h2 className="display-5 fw-extrabold text-slate-100 mt-2 mb-3" style={{ fontWeight: 800 }}>Produk Sewa Unggulan</h2>
            <p className="lead text-slate-300" style={{ fontSize: '1.05rem' }}>
              Temukan ribuan perlengkapan terbaik yang siap menemani aktivitas hobi harian Anda dengan hemat.
            </p>

            {/* Navigasi Pill Filter Kategori Interaktif */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              {['Semua', 'Fotografi', 'Camping', 'Gaming', 'Olahraga', 'Drone', 'Musik'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm px-4 py-2.5 rounded-pill fw-bold border-0 transition-all ${
                    selectedCategory === cat 
                      ? 'btn-primary shadow-sm bg-primary' 
                      : 'btn-dark text-slate-300 hover-text-dark bg-slate-800'
                  }`}
                  style={selectedCategory === cat ? { background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: '#0F172A' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Cards Produk */}
          <div className="row g-4 mt-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 card-glass border bg-dark-custom overflow-hidden shadow-sm flex flex-col justify-content-between" style={{ borderColor: 'var(--border-color)' }}>
                    
                    {/* Header Image Cover & Badge */}
                    <div className="position-relative overflow-hidden" style={{ height: '240px', backgroundColor: '#1e293b' }}>
                      <img 
                        src={product.image} 
                        alt={`[Foto ${product.name}]`} 
                        className="w-100 h-100 object-cover transition-all opacity-85"
                        style={{ transitionDuration: '0.4s' }}
                      />
                      <span className="position-absolute bg-dark bg-opacity-75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-100 shadow-sm flex items-center gap-1" style={{ top: '12px', left: '12px', border: '1px solid var(--border-color)' }}>
                        <i className="bi bi-star-fill text-warning"></i>
                        <span>{product.rating} ({product.reviews})</span>
                      </span>
                      <span className="position-absolute bg-primary text-slate-100 text-xs font-extrabold px-3 py-1 rounded-pill" style={{ top: '12px', right: '12px', background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: '#0F172A' }}>
                        {product.badge}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-grow-1 flex flex-col justify-content-between">
                      <div>
                        <div className="d-flex align-items-center gap-1.5 text-xs text-slate-300 font-semibold mb-2">
                          <i className="bi bi-geo-alt-fill text-orange-custom"></i>
                          <span>{product.location}</span>
                        </div>
                        <h4 className="fw-bold text-slate-100 fs-5 mb-2 leading-snug">{product.name}</h4>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.desc}
                        </p>
                      </div>

                      <div className="border-t border-secondary border-opacity-15 pt-3 d-flex items-center justify-content-between mt-3">
                        <div>
                          <small className="text-slate-400 d-block" style={{ fontSize: '11px' }}>Biaya Sewa</small>
                          <strong className="text-orange-custom font-heading fs-5" style={{ fontWeight: 800 }}>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                            <span className="text-slate-400 fs-6 font-normal" style={{ fontSize: '12px' }}>/hari</span>
                          </strong>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setBookingDays(1);
                          }} 
                          className="btn btn-outline-custom fw-bold rounded-3 px-3 py-2 btn-sm transition-all d-flex align-items-center gap-1"
                        >
                          <span>Lihat Detail</span>
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search fs-1 text-slate-400 mb-3 d-block"></i>
                <h5 className="fw-bold text-slate-100">Produk Tidak Ditemukan</h5>
                <p className="text-slate-300 text-sm">Maaf, saat ini belum ada produk sewa di kategori "{selectedCategory}".</p>
                <button onClick={() => setSelectedCategory('Semua')} className="btn btn-gradient btn-sm rounded-pill fw-bold px-4 py-2 mt-2">Tampilkan Semua</button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 6. CARA KERJA TIMELINE */}
      <section id="cara-kerja" className="py-16 sm:py-24 bg-dark-custom border-top border-secondary border-opacity-10">
        <div className="container">
          
          <div className="text-center max-w-2xl mx-auto mb-5 pb-3">
            <span className="text-orange-custom fw-bold text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Proses Instan</span>
            <h2 className="display-5 fw-extrabold text-slate-100 mt-2 mb-3" style={{ fontWeight: 800 }}>Cara Kerja Mudah & Terintegrasi</h2>
            <p className="lead text-slate-300" style={{ fontSize: '1.05rem' }}>
              Proses penyewaan alat hobi di HobiRent dirancang sesederhana mungkin untuk kenyamanan maksimal Anda.
            </p>
          </div>

          <div className="row g-4 justify-content-center text-center mt-4">
            
            {/* Step 1 */}
            <div className="col-md-6 col-lg-3 timeline-step">
              <div className="timeline-badge">1</div>
              <h4 className="fw-bold fs-5 text-slate-100">Pilih Peralatan</h4>
              <p className="text-slate-300 px-3 text-sm">Cari alat hobi terbaik di katalog digital HobiRent sesuai preferensi harian Anda.</p>
            </div>

            {/* Step 2 */}
            <div className="col-md-6 col-lg-3 timeline-step">
              <div className="timeline-badge" style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)' }}>2</div>
              <h4 className="fw-bold fs-5 text-slate-100">Pesan Secara Online</h4>
              <p className="text-slate-300 px-3 text-sm">Tentukan durasi rental, lakukan transaksi pembayaran aman melalui e-wallet atau transfer.</p>
            </div>

            {/* Step 3 */}
            <div className="col-md-6 col-lg-3 timeline-step">
              <div className="timeline-badge">3</div>
              <h4 className="fw-bold fs-5 text-slate-100">Ambil atau Kirim</h4>
              <p className="text-slate-300 px-3 text-sm">Pilih opsi pengambilan langsung (COD) di mitra terdekat atau kirim lewat kurir ekspres.</p>
            </div>

            {/* Step 4 */}
            <div className="col-md-6 col-lg-3 timeline-step">
              <div className="timeline-badge" style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)' }}>4</div>
              <h4 className="fw-bold fs-5 text-slate-100">Gunakan & Kembalikan</h4>
              <p className="text-slate-300 px-3 text-sm">Nikmati petualangan hobi baru Anda, lalu kembalikan alat setelah durasi pemakaian habis.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FITUR UNGGULAN & KEUNGGULAN SAAS */}
      <section id="tentang" className="py-16 sm:py-24 bg-dark-custom border-top border-secondary border-opacity-10">
        <div className="container">
          
          <div className="row align-items-center g-5">
            
            {/* Kiri: Deskripsi Keunggulan */}
            <div className="col-lg-5 text-center text-lg-start">
              <span className="text-orange-custom fw-bold text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Tentang Kami</span>
              <h2 className="display-6 fw-extrabold text-slate-100 mt-2 mb-4" style={{ fontWeight: 850 }}>Teknologi Terdepan Pelopor Rental Hobi</h2>
              <p className="lead text-slate-300 mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                HobiRent menggunakan sistem modular manajemen pergudangan otomatis serta verifikasi mitra tepercaya untuk mendukung hobi seru Anda tanpa batas.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <button onClick={() => triggerToast('Selamat bergabung! Layanan panduan sedang dipersiapkan.')} className="btn btn-gradient px-4 py-3 font-semibold text-sm rounded-3">Pelajari Dokumen</button>
                <Link to="#produk" className="btn btn-outline-custom px-4 py-3 font-semibold text-sm rounded-3">Cari Peralatan</Link>
              </div>
            </div>

            {/* Kanan: Grid Fitur */}
            <div className="col-lg-7">
              <div className="row g-4">
                
                {/* Fitur 1 */}
                <div className="col-md-6">
                  <div className="card border-0 p-4 rounded-4 shadow-sm h-100 bg-dark" style={{ border: '1px solid var(--border-color) !important' }}>
                    <div className="text-orange-custom mb-3">
                      <i className="bi bi-box-seam-fill fs-3"></i>
                    </div>
                    <h5 className="fw-bold text-slate-100">Manajemen Produk</h5>
                    <p className="text-slate-400 text-sm m-0">Pengaturan deskripsi, kelayakan fungsi, and ketersediaan stok produk secara berkala.</p>
                  </div>
                </div>

                {/* Fitur 2 */}
                <div className="col-md-6">
                  <div className="card border-0 p-4 rounded-4 shadow-sm h-100 bg-dark" style={{ border: '1px solid var(--border-color) !important' }}>
                    <div className="text-orange-custom mb-3">
                      <i className="bi bi-tags-fill fs-3"></i>
                    </div>
                    <h5 className="fw-bold text-slate-100">Sistem Kategori</h5>
                    <p className="text-slate-400 text-sm m-0">Klasifikasi produk yang tertata rapi untuk memudahkan pencarian barang hobi spesifik.</p>
                  </div>
                </div>

                {/* Fitur 3 */}
                <div className="col-md-6">
                  <div className="card border-0 p-4 rounded-4 shadow-sm h-100 bg-dark" style={{ border: '1px solid var(--border-color) !important' }}>
                    <div className="text-orange-custom mb-3">
                      <i className="bi bi-speedometer2 fs-3"></i>
                    </div>
                    <h5 className="fw-bold text-slate-100">Dashboard Admin</h5>
                    <p className="text-slate-400 text-sm m-0">Dashboard ringkas untuk melacak omset harian, status peminjaman, dan retur barang.</p>
                  </div>
                </div>

                {/* Fitur 4 */}
                <div className="col-md-6">
                  <div className="card border-0 p-4 rounded-4 shadow-sm h-100 bg-dark" style={{ border: '1px solid var(--border-color) !important' }}>
                    <div className="text-orange-custom mb-3">
                      <i className="bi bi-activity fs-3"></i>
                    </div>
                    <h5 className="fw-bold text-slate-100">Monitoring Penyewaan</h5>
                    <p className="text-slate-400 text-sm m-0">Pemantauan status keterlambatan pengembalian otomatis demi keamanan aset Anda.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. TESTIMONI PENGGUNA */}
      <section className="py-16 sm:py-24 border-top border-secondary border-opacity-10">
        <div className="container">
          
          <div className="text-center max-w-2xl mx-auto mb-5 pb-3">
            <span className="text-orange-custom fw-bold text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Ulasan Real</span>
            <h2 className="display-5 fw-extrabold text-slate-100 mt-2 mb-3" style={{ fontWeight: 800 }}>Kata Mereka Tentang HobiRent</h2>
            <p className="lead text-slate-300" style={{ fontSize: '1.05rem' }}>
              Dengarkan langsung testimoni dari para pehobi yang operasional aktivitasnya terbantu secara efisien dengan HobiRent.
            </p>
          </div>

          <div className="row g-4">
            
            {/* Testimonial 1 */}
            <div className="col-lg-4">
              <div className="card-glass h-100 p-4.5 d-flex flex-column justify-content-between border">
                <div>
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h5 className="fw-bold text-slate-100">"Pilihan Tepat Naik Gunung!"</h5>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    "Sebelum tahu HobiRent, saya terpaksa harus membeli tenda dan nesting baru yang sangat memakan biaya bulanan. Sewa di sini sangat hemat, barangnya pun dalam kondisi super mulus."
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3 pt-4 border-top border-secondary border-opacity-15">
                  <div className="bg-primary text-slate-900 rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '14px', background: 'var(--primary)' }}>
                    RA
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold text-slate-100">Rian Anggara</h6>
                    <small className="text-slate-400">Pencinta Alam & Petualang</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-lg-4">
              <div className="card-glass h-100 p-4.5 d-flex flex-column justify-content-between border">
                <div>
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h5 className="fw-bold text-slate-100">"Sangat Hemat Produksi"</h5>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    "HobiRent adalah penyelamat bisnis konten kami. Kami bisa menyewa kamera sinematik premium harian sesuai dengan kebutuhan proyek klien tanpa perlu investasi puluhan juta di awal."
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3 pt-4 border-top border-secondary border-opacity-15">
                  <div className="bg-success text-slate-900 rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '14px' }}>
                    NA
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold text-slate-100">Nadia Amalia</h6>
                    <small className="text-slate-400">Kreator Konten Video</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="col-lg-4">
              <div className="card-glass h-100 p-4.5 d-flex flex-column justify-content-between border">
                <div>
                  <div className="text-warning mb-3">
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill me-1"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h5 className="fw-bold text-slate-100">"Sangat Recomended!"</h5>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    "Saya rutin menyewa konsol game and board game untuk acara ramah tamah akhir pekan keluarga. Proses administrasinya transparan, harga terjangkau, dan pemiliknya ramah sekali."
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3 pt-4 border-top border-secondary border-opacity-15">
                  <div className="bg-accent text-slate-900 rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '14px', background: 'var(--accent)' }}>
                    BS
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold text-slate-100">Bima Satria</h6>
                    <small className="text-slate-400">Penggemar Board Game</small>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. CALL TO ACTION WITH PREMIUM GRADIENT */}
      <section className="py-5 py-lg-5 position-relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}>
        <div className="position-absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
        <div className="container py-lg-5 text-center position-relative z-2">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="display-5 fw-extrabold mb-3" style={{ fontWeight: 800, color: '#0F172A' }}>Mulai Sewa Peralatan Hobi Favoritmu Hari Ini</h2>
            <p className="lead mb-5 text-slate-900" style={{ fontSize: '1.1rem', opacity: 0.85 }}>
              Bergabunglah bersama ribuan pehobi aktif lainnya. Kelola alat hobi Anda atau mulailah mengeksplorasi aktivitas baru dengan cara paling hemat.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <button onClick={() => triggerToast('Terima kasih atas pendaftaran Anda! Akun Anda sedang diverifikasi.')} className="btn btn-light text-slate-900 hover-lift fw-bold px-5 py-3 rounded-3 d-inline-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#F8FAFC' }}>
                <i className="bi bi-check2-circle"></i>
                <span>Daftar Sekarang</span>
              </button>
              <Link
                to="/login"
                className="btn btn-dark hover-lift fw-bold px-5 py-3 rounded-3 d-inline-flex align-items-center gap-2 text-decoration-none border-0 text-slate-100"
                style={{
                  backgroundColor: '#0F172A',
                }}
              >
                <i className="bi bi-person-lock"></i>
                <span>Login Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER DARK MODERN */}
      <footer className="bg-dark-custom text-slate-400 pt-5 pb-4 border-top border-secondary border-opacity-15">
        <div className="container">
          <div className="row g-5 mb-5">
            
            {/* Brand column */}
            <div className="col-lg-4 space-y-4">
              <Link to="#home" className="d-flex align-items-center gap-2 text-decoration-none">
                <div className="d-flex align-items-center justify-content-center bg-primary text-slate-900 rounded-3 shadow-sm" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' }}>
                  <i className="bi bi-rocket-takeoff-fill"></i>
                </div>
                <span className="fw-black text-slate-100 fs-4 tracking-tight" style={{ fontWeight: 800 }}>
                  Hobi<span className="text-orange-custom">Rent</span>
                </span>
              </Link>
              <p className="text-slate-400 mt-3" style={{ fontSize: '14.5px', lineHeight: '1.7' }}>
                Platform sirkulasi peminjaman alat hobi outdoor dan indoor terbesar di Indonesia. Mendorong pemanfaatan aset bersama demi lingkungan berkelanjutan.
              </p>
              <div className="d-flex gap-3 pt-2">
                <a href="#" className="text-slate-400 hover-text-primary fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-slate-400 hover-text-primary fs-5"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-slate-400 hover-text-primary fs-5"><i className="bi bi-tiktok"></i></a>
                <a href="#" className="text-slate-400 hover-text-primary fs-5"><i className="bi bi-youtube"></i></a>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="col-sm-6 col-md-4 col-lg-2 offset-lg-1">
              <h6 className="text-slate-100 fw-bold uppercase tracking-wider mb-4" style={{ fontSize: '12.5px' }}>Tentang Kami</h6>
              <ul className="list-unstyled space-y-2" style={{ fontSize: '14px' }}>
                <li className="mb-2"><Link to="#home" className="footer-link text-slate-400">Latar Belakang</Link></li>
                <li className="mb-2"><Link to="#tentang" className="footer-link text-slate-400">Karir & Peluang</Link></li>
                <li className="mb-2"><Link to="#home" className="footer-link text-slate-400">Hubungan Investor</Link></li>
                <li className="mb-2"><Link to="#home" className="footer-link text-slate-400">Berita & Rilis</Link></li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="col-sm-6 col-md-4 col-lg-2">
              <h6 className="text-slate-100 fw-bold uppercase tracking-wider mb-4" style={{ fontSize: '12.5px' }}>Kategori Sewa</h6>
              <ul className="list-unstyled space-y-2" style={{ fontSize: '14px' }}>
                <li className="mb-2"><button onClick={() => { setSelectedCategory('Fotografi'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="btn p-0 border-0 footer-link text-start text-slate-400">Fotografi</button></li>
                <li className="mb-2"><button onClick={() => { setSelectedCategory('Camping'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="btn p-0 border-0 footer-link text-start text-slate-400">Camping</button></li>
                <li className="mb-2"><button onClick={() => { setSelectedCategory('Gaming'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="btn p-0 border-0 footer-link text-start text-slate-400">Gaming</button></li>
                <li className="mb-2"><button onClick={() => { setSelectedCategory('Drone'); document.getElementById('produk').scrollIntoView({ behavior: 'smooth' }); }} className="btn p-0 border-0 footer-link text-start text-slate-400">Drone</button></li>
              </ul>
            </div>

            {/* Quick Links Column 3 */}
            <div className="col-sm-6 col-md-4 col-lg-3">
              <h6 className="text-slate-100 fw-bold uppercase tracking-wider mb-4" style={{ fontSize: '12.5px' }}>Hubungi & Bantuan</h6>
              <ul className="list-unstyled text-slate-400" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <li className="mb-2 d-flex align-items-start gap-2">
                  <i className="bi bi-geo-alt text-orange-custom mt-1"></i>
                  <span>Gedung Inovasi Hobi, Dago, Bandung, Jawa Barat 40135</span>
                </li>
                <li className="mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-envelope text-orange-custom"></i>
                  <span>support@hobirent.id</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-top border-secondary border-opacity-10 pt-4 d-flex flex-column flex-sm-row items-center justify-content-between text-slate-400" style={{ fontSize: '12px' }}>
            <p className="m-0">© 2026 HobiRent. Seluruh Hak Cipta Dilindungi.</p>
            <div className="d-flex gap-4 mt-3 mt-sm-0">
              <a href="#" className="footer-link text-slate-400">Kebijakan Privasi</a>
              <a href="#" className="footer-link text-slate-400">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL DETAIL & PEMESANAN BARANG HOBI (DENGAN KALKULATOR) --- */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-container" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Image Preview & Close Button */}
            <div className="position-relative" style={{ height: '280px', backgroundColor: '#1e293b' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-100 h-100 object-cover opacity-90" />
              <button 
                type="button" 
                className="btn-close btn-close-white p-2.5 rounded-circle shadow position-absolute" 
                style={{ top: '15px', right: '15px', backgroundColor: 'rgba(15,23,42,0.8)' }} 
                onClick={() => setSelectedProduct(null)}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge px-3 py-1.5 rounded-pill" style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', color: '#0F172A' }}>
                  {selectedProduct.category}
                </span>
                <div className="d-flex align-items-center gap-1.5 text-slate-100 fw-bold">
                  <i className="bi bi-star-fill text-warning"></i>
                  <span>{selectedProduct.rating} ({selectedProduct.reviews} Ulasan)</span>
                </div>
              </div>

              <h4 className="fw-extrabold text-slate-100 mb-2">{selectedProduct.name}</h4>
              <p className="text-slate-300 text-sm mb-3">Mitra Penyedia: <strong className="text-slate-100">{selectedProduct.owner}</strong> ({selectedProduct.location})</p>
              
              <div className="bg-dark p-3 rounded-4 mb-4 border" style={{ borderColor: 'var(--border-color)' }}>
                <small className="text-slate-400 fw-bold text-uppercase d-block mb-1.5" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Deskripsi Produk</small>
                <p className="text-slate-300 text-sm m-0 leading-relaxed">{selectedProduct.desc}</p>
              </div>

              {/* Form Booking Simulasi */}
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-slate-300 fw-semibold small">Mulai Sewa</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      className="form-control bg-dark border-secondary border-opacity-25 text-slate-100" 
                      required 
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-slate-300 fw-semibold small">Durasi Pemakaian</label>
                    <select 
                      value={bookingDays} 
                      onChange={(e) => setBookingDays(parseInt(e.target.value, 10))} 
                      className="form-select bg-dark border-secondary border-opacity-25 fw-bold text-slate-100"
                    >
                      {[1, 2, 3, 5, 7, 14].map((d) => (
                        <option key={d} value={d}>{d} Hari</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Kalkulator Harga Total Sewa */}
                <div className="bg-orange-subtle-dark p-3 rounded-4 d-flex justify-content-between align-items-center mt-4 border border-primary border-opacity-10">
                  <div>
                    <span className="text-slate-400 d-block" style={{ fontSize: '11px' }}>Estimasi Biaya ({bookingDays} Hari)</span>
                    <strong className="text-orange-custom fs-4" style={{ fontWeight: 800 }}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.price * bookingDays)}
                    </strong>
                  </div>
                  <div className="d-flex gap-2">
                    {/* FITUR CHAT: Tombol hubungi pemilik barang */}
                    <button 
                      type="button" 
                      onClick={() => startChatWithOwner(selectedProduct)}
                      className="btn btn-outline-custom border-orange-opacity-25 text-slate-100 fw-bold d-flex align-items-center gap-2"
                      style={{ border: '1px solid rgba(249, 115, 22, 0.4)', transition: 'all 0.3s' }}
                    >
                      <i className="bi bi-chat-dots-fill text-orange-custom"></i>
                      <span>Chat</span>
                    </button>
                    <button type="submit" className="btn btn-primary btn-gradient px-4 py-2.5 fw-bold rounded-3">
                      Sewa
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* --- FLOATING CHAT WIDGET INTERAKTIF --- */}
      <div className="chat-widget-container">
        {/* Jendela Obrolan Aktif */}
        {isChatOpen && (
          <div className="chat-window d-flex">
            {/* Sidebar Daftar Obrolan */}
            <div className="chat-sidebar">
              <span className="text-slate-400 text-uppercase fw-extrabold mb-2 font-monospace" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>Thread</span>
              {chatSessions.map((session, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setActiveSessionIndex(index);
                    const updated = [...chatSessions];
                    updated[index].unread = false;
                    setChatSessions(updated);
                  }}
                  className={`chat-avatar-tab ${activeSessionIndex === index ? 'active' : ''}`}
                  title={session.owner}
                >
                  {session.owner.substring(0, 2)}
                  {session.unread && <span className="position-absolute top-0 end-0 bg-danger border border-dark rounded-circle" style={{ width: '8px', height: '8px' }}></span>}
                </div>
              ))}
            </div>

            {/* Chat Conversation Pane */}
            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
              {/* Header Percakapan */}
              <div className="chat-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="m-0 fw-bold text-slate-100" style={{ fontSize: '14px' }}>
                    {chatSessions[activeSessionIndex]?.owner}
                  </h6>
                  <small className="text-orange-custom" style={{ fontSize: '11px', fontWeight: '500' }}>
                    {chatSessions[activeSessionIndex]?.productName}
                  </small>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsChatOpen(false)}
                  className="btn-close btn-close-white" 
                  style={{ fontSize: '12px' }}
                ></button>
              </div>

              {/* Feed Percakapan */}
              <div className="chat-feed flex-grow-1">
                {chatSessions[activeSessionIndex]?.messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'owner'}`}
                  >
                    <div>{msg.text}</div>
                    <div 
                      className="text-end mt-1" 
                      style={{ fontSize: '9px', opacity: 0.6, color: msg.sender === 'user' ? '#0F172A' : 'var(--slate-400)' }}
                    >
                      {msg.time}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form Percakapan */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Tulis pesan..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="form-control bg-dark border-secondary border-opacity-25 text-slate-100"
                    style={{ fontSize: '13px', outline: 'none' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary px-3"
                    style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', border: 'none', color: '#0F172A' }}
                  >
                    <i className="bi bi-send-fill" style={{ color: '#0F172A' }}></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tombol Pemanggil Chat (Toggle Button) */}
        <div 
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            // Matikan unread badge saat diklik
            const updated = [...chatSessions];
            if (updated[activeSessionIndex]) {
              updated[activeSessionIndex].unread = false;
            }
            setChatSessions(updated);
          }} 
          className="chat-toggle-btn"
        >
          {isChatOpen ? (
            <i className="bi bi-x-lg" style={{ color: '#0F172A' }}></i>
          ) : (
            <>
              <i className="bi bi-chat-dots-fill" style={{ color: '#0F172A' }}></i>
              {chatSessions.some(s => s.unread) && (
                <span className="chat-badge">!</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* TOAST NOTIFIKASI CONTAINER */}
      {showNotificationToast && (
        <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 2500 }}>
          <div className="toast show align-items-center text-white bg-dark border border-secondary border-opacity-15 p-2 shadow-lg rounded-3" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2.5">
                <i className="bi bi-info-circle-fill text-warning fs-5"></i>
                <span style={{ fontSize: '13.5px' }}>{toastMessage}</span>
              </div>
              <button type="button" className="btn-close btn-close-white m-auto me-2" onClick={() => setShowNotificationToast(false)} aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}