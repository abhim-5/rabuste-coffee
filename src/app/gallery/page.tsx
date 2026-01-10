'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/ui/Footer';
import { Cart } from '@/components/cart/Cart';
import { CartButton } from '@/components/cart/CartButton';
import { useCart } from '@/hooks/useCart';
import GalleryHero from '@/components/gallery/GalleryHero';
import { GalleryBooking } from '@/components/gallery/GalleryBooking';
import AuthModal from '@/components/auth/AuthModal';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import './kinetic.css';

import { useGallery, GalleryItem } from '@/hooks/useGallery';
import './kinetic.css';

// Remove static galleryItems
// const galleryItems = ...

const typeLines = [
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
  'RABUSTE RABUSTE RABUSTE',
];

export default function GalleryPage() {
  const { items: galleryItems, loading, error } = useGallery();
  const [currentArticle, setCurrentArticle] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    isOpen: boolean;
    bookingNumber: string;
    artPieceName: string;
    artist: string;
    price: number;
  }>({ isOpen: false, bookingNumber: '', artPieceName: '', artist: '', price: 0 });
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();
  // Removed heroRef hooks as they are moved to GalleryHero
  const typeRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);

  const isInCart = (id: string) => {
    return cart.items.some(item => item.menuItem.id === id);
  };

  const handleAddToCart = (item: GalleryItem) => {
    const cartItem = {
      id: `gallery-${item.id}`,
      name: item.name,
      price: item.price,
      image: item.image_url, // Use the full URL from API
      category: 'Art Gallery' as const,
      description: item.description,
      rating: 5,
      reviewCount: 0,
    };
    addItem(cartItem, 1);
  };

  const handleRemoveFromCart = (id: string) => {
    const itemIndex = cart.items.findIndex(item => item.menuItem.id === id);
    if (itemIndex !== -1) {
      removeItem(itemIndex);
    }
  };

  const handleAddRecommendedItem = (itemId: string) => {
    // Extract the ID from 'gallery-X' format
    // Modified to handle both numeric (legacy) and UUID (new) IDs
    const prefix = 'gallery-';
    if (itemId.startsWith(prefix)) {
      const id = itemId.substring(prefix.length);
      const galleryItem = galleryItems.find(item => item.id.toString() === id); // toString just in case
      if (galleryItem) {
        handleAddToCart(galleryItem);
      }
    }
  };

  // Get current user
  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGalleryBookingComplete = (bookingNumber: string, artPieceName: string, artist: string, price: number) => {
    setBookingConfirmation({
      isOpen: true,
      bookingNumber,
      artPieceName,
      artist,
      price
    });
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  const openArticle = (id: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Store current scroll position and lock body scroll
    scrollPositionRef.current = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = '100%';

    // Hide navbar when opening article
    setShowNavbar(false);

    const timeline = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    // Type transition
    const typeInTimeline = gsap.timeline({ paused: true })
      .to(typeRef.current, {
        duration: 1.4,
        ease: 'power2.inOut',
        scale: 2.7,
        rotate: -90,
      })
      .to('.type__line', {
        keyframes: [
          { x: '20%', duration: 1, ease: 'power1.inOut' },
          { x: '-200%', duration: 1.5, ease: 'power1.in' },
        ],
        stagger: 0.04,
      }, 0)
      .to('.type__line', {
        keyframes: [
          { opacity: 1, duration: 1, ease: 'power1.in' },
          { opacity: 0, duration: 1.5, ease: 'power1.in' },
        ],
      }, 0);

    timeline
      .addLabel('start', 0)
      .addLabel('typeTransition', 0.3)
      .addLabel('articleOpening', 0.75 * typeInTimeline.totalDuration() + 0.3)
      .to('.item', {
        duration: 0.8,
        ease: 'power2.inOut',
        opacity: 0,
        y: (i: number) => (i % 2 ? '25%' : '-25%'),
      }, 'start')
      .to(frameRef.current, {
        duration: 0.8,
        ease: 'power3',
        opacity: 0,
        pointerEvents: 'none',
      }, 'start')
      .add(() => { typeInTimeline.play(); }, 'typeTransition')
      .add(() => {
        setCurrentArticle(id);
        gsap.set(backRef.current, { pointerEvents: 'auto' });
        gsap.set('.item-wrap', { pointerEvents: 'none' });
      }, 'articleOpening')
      .to(backRef.current, {
        duration: 0.7,
        opacity: 1,
      }, 'articleOpening')
      .fromTo(`.article-${id} .article__title, .article-${id} .article__number, .article-${id} .article__intro, .article-${id} .article__description, .article-${id} .article__about, .article-${id} .article__purchase, .article-${id} .article__artist`, {
        opacity: 0,
        y: '50%',
      }, {
        duration: 1,
        ease: 'expo',
        opacity: 1,
        y: '0%',
        stagger: 0.04,
      }, 'articleOpening')
      .fromTo(`.article-${id} .article__img-wrap`, {
        y: '100%',
      }, {
        duration: 1,
        ease: 'expo',
        y: '0%',
      }, 'articleOpening')
      .fromTo(`.article-${id} .article__img`, {
        y: '-100%',
      }, {
        duration: 1,
        ease: 'expo',
        y: '0%',
      }, 'articleOpening');
  };

  const closeArticle = () => {
    if (isAnimating || currentArticle === null) return;
    setIsAnimating(true);

    const typeOutTimeline = gsap.timeline({ paused: true })
      .to(typeRef.current, {
        duration: 1.4,
        ease: 'power2.inOut',
        scale: 1,
        rotate: 0,
      }, 1.2)
      .to('.type__line', {
        duration: 2.3,
        ease: 'back',
        x: '0%',
        stagger: -0.04,
      }, 0)
      .to('.type__line', {
        keyframes: [
          { opacity: 1, duration: 1, ease: 'power1.in' },
          { opacity: 0.05, duration: 1.5, ease: 'power1.in' },
        ],
      }, 0);

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setCurrentArticle(null);
        // Show navbar again when returning to gallery
        setShowNavbar(true);
        // Restore scroll position and unlock body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPositionRef.current);
      },
    });

    timeline
      .addLabel('start', 0)
      .addLabel('typeTransition', 0.5)
      .addLabel('showItems', 0.7 * typeOutTimeline.totalDuration() + 0.5)
      .to(backRef.current, {
        duration: 0.7,
        ease: 'power1',
        opacity: 0,
      }, 'start')
      .to(`.article-${currentArticle} .article__title, .article-${currentArticle} .article__about, .article-${currentArticle} .article__purchase, .article-${currentArticle} .article__artist`, {
        duration: 1,
        ease: 'power4.in',
        opacity: 0,
        y: '50%',
        stagger: -0.04,
      }, 'start')
      .to(`.article-${currentArticle} .article__img-wrap`, {
        duration: 1,
        ease: 'power4.in',
        y: '100%',
      }, 'start')
      .to(`.article-${currentArticle} .article__img`, {
        duration: 1,
        ease: 'power4.in',
        y: '-100%',
      }, 'start')
      .add(() => {
        gsap.set(backRef.current, { pointerEvents: 'none' });
        gsap.set('.item-wrap', { pointerEvents: 'auto' });
      })
      .add(() => { typeOutTimeline.play(); }, 'typeTransition')
      .to(frameRef.current, {
        duration: 0.8,
        ease: 'power3',
        opacity: 1,
        pointerEvents: 'auto',
      }, 'showItems')
      .to('.item', {
        duration: 1,
        ease: 'power3.inOut',
        opacity: 1,
        y: '0%',
      }, 'showItems');
  };

  useEffect(() => {
    document.documentElement.className = 'js';
  }, []);

  return (
    <>
      {showNavbar && <Navbar />}
      <main className={`gallery-main ${!showNavbar ? 'no-navbar-padding' : ''}`}>
        {/* Hero Section */}
        <GalleryHero />

        {/* Owner's POV About Art Section */}
        <section className="relative py-8 lg:py-12 overflow-hidden bg-gradient-to-br from-[#F5EFE6] via-[#E8DBC8] to-[#D8CBB8] z-30">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#8B6F47] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8B6F47] rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border-2 border-[#8B6F47]/20">
                {/* Quote Icon */}
                <svg className="absolute top-4 left-4 w-10 h-10 text-[#8B6F47]/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>

                <div className="relative z-10">
                  <p className="text-lg lg:text-xl font-serif text-[#2A2A2A] italic leading-relaxed text-center mb-4">
                    "Art is not just meant to be seen—it's meant to be felt, experienced, and lived with. Each piece in our gallery brings the serenity of nature into our space, creating moments of tranquility amidst the hustle. When you enjoy your coffee surrounded by beautiful art, you're not just taking a break—you're nourishing your soul."
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-3 border-t-2 border-[#8B6F47]/20">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8B6F47]">
                      <Image
                        src="/about us/owner_pic.png"
                        alt="Rabuste Coffee"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-display text-base text-[#2A2A2A] font-bold">Rabuste Coffee</p>
                      <p className="text-sm text-[#404040]/70">Founder & Curator</p>
                    </div>

                    {/* Decorative Coffee Icon */}
                    <div className="ml-auto hidden lg:block">
                      <Coffee className="w-12 h-12 text-[#8B6F47]/10" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Content Wrapper - Contains Intro, Kinetic Typography and Gallery Grid */}
        <div className="gallery-content-wrapper">

          {/* Rabuste Art Gallery Introduction - Styled like WhatIsRobusta */}
          <section className="relative w-full overflow-hidden py-6 lg:py-6 mt-20 lg:mt-32">
            {/* Coffee bean decorative elements */}
            <div className="absolute top-20 left-10 opacity-10">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="50" rx="35" ry="48" fill="#404040" transform="rotate(-15 50 50)" />
                <path d="M50 20 Q30 50 50 80" stroke="#8B4513" strokeWidth="3" fill="none" />
              </svg>
            </div>
            <div className="absolute bottom-32 right-16 opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="50" rx="40" ry="52" fill="#404040" transform="rotate(20 50 50)" />
                <path d="M50 15 Q25 50 50 85" stroke="#8B4513" strokeWidth="3" fill="none" />
              </svg>
            </div>
            <div className="absolute top-1/3 right-1/4 opacity-8 hidden lg:block">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="50" rx="30" ry="42" fill="#404040" transform="rotate(-30 50 50)" />
                <path d="M50 18 Q32 50 50 82" stroke="#8B4513" strokeWidth="2.5" fill="none" />
              </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl lg:px-8">
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center mb-6 lg:mb-8 px-4"
              >
                <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-[#404040] mb-6 text-center">
                  Rabuste Art Gallery
                </h2>

                {/* Title Separator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-32 h-8 lg:w-40 lg:h-10"
                >
                  <Image
                    src="/title-separator.png"
                    fill
                    alt="Decorative separator"
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>


            </div>
          </section>

          {/* Kinetic Typography Background */}
          <div className="type" ref={typeRef} aria-hidden="true">
            {typeLines.map((line, i) => (
              <div key={i} className="type__line">
                {line}
              </div>
            ))}
          </div>

          {/* Gallery Items */}
          <section className={`item-wrap ${currentArticle !== null ? 'article-open' : ''}`}>
            {loading && <div className="text-white text-center py-20">Loading art collection...</div>}
            {error && <div className="text-white text-center py-20">Unable to load collection. Please try again.</div>}

            {!loading && !error && galleryItems.map((item, index) => {
              // Safely construct image URL
              const getImageSrc = () => {
                if (!item.image_url) return '/gallery/default.jpg';
                if (item.image_url.startsWith('http')) return item.image_url;
                
                // If it already has gallery/ prefix, respect it
                if (item.image_url.includes('gallery/')) {
                    return item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`;
                }
                
                // Otherwise assume it's in the gallery folder
                return `/gallery/${item.image_url.startsWith('/') ? item.image_url.substring(1) : item.image_url}`;
              };

              return (
                <figure
                  key={item.id}
                  className="item"
                  ref={(el) => { itemRefs.current[index] = el; }}
                  onClick={() => openArticle(item.id)}
                >
                  <img
                    className="item__img"
                    src={getImageSrc()}
                    alt={item?.name || 'Artwork'}
                    width={300}
                    height={400}
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                  <figcaption className="item__caption">
                    <h2 className="item__caption-title">
                      {item.name}
                    </h2>
                  </figcaption>
                </figure>
              );
            })}
          </section>
        </div>

        {/* Article Content */}
        <section className="article-wrap">
          <button className="back" ref={backRef} onClick={closeArticle}>
            <svg viewBox="0 0 50 9">
              <path d="m0 4.5 5-3m-5 3 5 3m45-3h-77" />
            </svg>
          </button>

          {galleryItems.map((item) => (
            <article
              key={item.id}
              className={`article article-${item.id} ${currentArticle === item.id ? 'article--current' : ''
                }`}
            >
              <div className="article__img-wrap">
                <div
                  className="article__img"
                  style={{
                    backgroundImage: `url(${item.image_url.startsWith('http') ? item.image_url : `/${item.image_url}`})`,
                  }}
                />
              </div>

              <h2 className="article__title">{item.name}</h2>

              <div className="article__about">
                <h3 className="article__about-heading">About this Artwork</h3>
                <p>{item.description}</p>
              </div>

              <div className="article__purchase">
                <p className="article__price">₹{item.price.toLocaleString('en-IN')}</p>
                <button
                  className={`article__add-to-cart ${isInCart(`gallery-${item.id}`) ? 'remove-from-cart' : ''}`}
                  onClick={() => {
                    if (isInCart(`gallery-${item.id}`)) {
                      handleRemoveFromCart(`gallery-${item.id}`);
                    } else {
                      handleAddToCart(item);
                    }
                  }}
                >
                  {isInCart(`gallery-${item.id}`) ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>

              <div className="article__artist">
                <h3 className="article__artist-heading">Artist</h3>
                <p className="article__artist-name">{item.artist}</p>
                <p className="article__artist-pov"><em>"{item.artist_pov}"</em></p>
              </div>
            </article>
          ))}
        </section>

      </main>
      <CartButton itemCount={cart.itemCount} onClick={() => setIsCartOpen(true)} />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        total={cart.total}
        itemCount={cart.itemCount}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onAddRecommendedItem={handleAddRecommendedItem}
        currentUser={currentUser}
        onOrderComplete={() => { }} // Not used for gallery
        onClearCart={clearCart}
        onShowAuth={handleShowAuth}
        onGalleryBookingComplete={handleGalleryBookingComplete}
        cartType="gallery"
      />
      <GalleryBooking
        isOpen={bookingConfirmation.isOpen}
        onClose={() => setBookingConfirmation({ ...bookingConfirmation, isOpen: false })}
        bookingNumber={bookingConfirmation.bookingNumber}
        artPieceName={bookingConfirmation.artPieceName}
        artist={bookingConfirmation.artist}
        price={bookingConfirmation.price}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        buttonRect={undefined}
      />
      <Footer />
    </>
  );
}
