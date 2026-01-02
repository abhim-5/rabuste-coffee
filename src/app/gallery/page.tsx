'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/ui/Footer';
import { Cart } from '@/components/cart/Cart';
import { CartButton } from '@/components/cart/CartButton';
import { useCart } from '@/hooks/useCart';
import './kinetic.css';

const galleryItems = [
  {
    id: 1,
    name: 'Dawn Chorus',
    about: 'A delicate watercolor celebrating the quiet beauty of dawn, where vibrant finches perch gracefully on golden wheat stalks. The soft, earthy tones and gentle brushwork evoke the serene moment when nature awakens, and the first songbirds greet the morning light.',
    price: 12999,
    artist: 'Priya Malhotra',
    artistPOV: 'I\'m captivated by those fleeting moments just before sunrise, when the world holds its breath. These finches represent hope and renewal—a reminder that each day brings fresh possibilities.'
  },
  {
    id: 2,
    name: 'Midnight Falls',
    about: 'A dramatic nocturnal landscape where a luminous full moon illuminates a cascading waterfall through misty forests. Rich blues and teals create an ethereal atmosphere, while the play of moonlight on water captures nature\'s mystical grandeur.',
    price: 15999,
    artist: 'Arjun Reddy',
    artistPOV: 'The night reveals a different world—one of mystery and magic. This painting explores the power of moonlight to transform the familiar into the extraordinary, where waterfalls become liquid silver.'
  },
  {
    id: 3,
    name: 'Wetland Companions',
    about: 'A naturalist\'s study featuring elegant waterfowl resting on weathered driftwood, rendered in classical watercolor technique. The composition celebrates biodiversity and the interconnected lives of marsh inhabitants, from sleek ravens to mottled ducks.',
    price: 18999,
    artist: 'Kavya Sharma',
    artistPOV: 'Wetlands are sanctuaries of life. Through careful observation and tender brushstrokes, I aim to honor these often-overlooked creatures and the delicate ecosystems they call home.'
  },
  {
    id: 4,
    name: 'Monsoon Transit',
    about: 'An atmospheric urban scene capturing the romance of rain-soaked city streets, where a vintage tram glides through the drizzle as pedestrians navigate with umbrellas. Warm ochres and cool grays create a nostalgic mood of everyday poetry.',
    price: 21999,
    artist: 'Rahul Verma',
    artistPOV: 'Cities transform in the rain. The reflections, the softened edges, the shared shelter of strangers—monsoons reveal the humanity in our urban landscapes. This is my love letter to rainy days.'
  },
  {
    id: 5,
    name: 'Summer Garden',
    about: 'A vibrant celebration of nature\'s bounty, featuring cheerful daisies interwoven with ripe citrus fruits. The composition bursts with warmth and vitality, evoking sun-drenched gardens and the simple pleasures of seasonal abundance.',
    price: 16999,
    artist: 'Meera Kapoor',
    artistPOV: 'Flowers and fruit together represent life\'s sweetness. I wanted to capture that feeling of walking through a garden in full bloom, where color and fragrance overwhelm the senses in the most delightful way.'
  },
  {
    id: 6,
    name: 'Bamboo Sanctuary',
    about: 'A tranquil Asian-inspired landscape where graceful cranes wade through misty bamboo groves. Soft greens and subtle atmospheric perspective create depth and serenity, embodying the zen aesthetic of balance and natural harmony.',
    price: 19999,
    artist: 'Sudhir Gupta',
    artistPOV: 'Cranes symbolize longevity and wisdom in many cultures. Set against bamboo—which bends but never breaks—this painting is a meditation on resilience, grace, and the quiet strength found in nature.'
  }
];

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
  const [currentArticle, setCurrentArticle] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, addItem, removeItem, updateQuantity } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);

  // Parallax effect for hero image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.1]);

  const isInCart = (id: string) => {
    return cart.items.some(item => item.menuItem.id === id);
  };

  const handleAddToCart = (item: typeof galleryItems[0]) => {
    const cartItem = {
      id: `gallery-${item.id}`,
      name: item.name,
      price: item.price,
      image: `/gallery/${item.id}.jpg`,
      category: 'Art Gallery' as const,
      description: item.about,
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
    // Extract the numeric ID from 'gallery-X' format
    const match = itemId.match(/gallery-(\d+)/);
    if (match) {
      const id = parseInt(match[1]);
      const galleryItem = galleryItems.find(item => item.id === id);
      if (galleryItem) {
        handleAddToCart(galleryItem);
      }
    }
  };

  const openArticle = (index: number) => {
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
        setCurrentArticle(index);
        gsap.set(backRef.current, { pointerEvents: 'auto' });
        gsap.set('.item-wrap', { pointerEvents: 'none' });
      }, 'articleOpening')
      .to(backRef.current, {
        duration: 0.7,
        opacity: 1,
      }, 'articleOpening')
      .fromTo(`.article-${index} .article__title, .article-${index} .article__number, .article-${index} .article__intro, .article-${index} .article__description, .article-${index} .article__about, .article-${index} .article__purchase, .article-${index} .article__artist`, {
        opacity: 0,
        y: '50%',
      }, {
        duration: 1,
        ease: 'expo',
        opacity: 1,
        y: '0%',
        stagger: 0.04,
      }, 'articleOpening')
      .fromTo(`.article-${index} .article__img-wrap`, {
        y: '100%',
      }, {
        duration: 1,
        ease: 'expo',
        y: '0%',
      }, 'articleOpening')
      .fromTo(`.article-${index} .article__img`, {
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
        <section ref={heroRef} className="relative z-30 min-h-screen w-full overflow-hidden bg-black">
          {/* Background Image with Parallax */}
          <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0 origin-top">
            <Image
              src="/gallery/gallery-hero.jpg"
              alt="Art Gallery"
              fill
              className="object-cover object-top scale-125 md:scale-100"
              priority
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40" aria-hidden>
            <div className="grain-texture h-full w-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto flex h-full min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 md:pt-36 md:pb-28 text-center lg:px-8 lg:pt-44">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display tracking-wide text-white text-[clamp(2rem,10vw,5.5rem)] leading-tight drop-shadow-2xl"
            >
              ART GALLERY
            </motion.h1>

            {/* Divider with icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 mb-8 flex items-center gap-4 text-white/90"
            >
              <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <Coffee className="h-6 w-6" />
              <span className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif mx-auto max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl"
            >
              Discover our curated collection of nature and wildlife-inspired artwork. Each piece tells a story
              of tranquility, beauty, and the timeless connection between art and the natural world. From serene
              landscapes to vibrant still life, find the perfect piece to bring nature's elegance into your space.
            </motion.p>
          </div>
        </section>

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
          {galleryItems.map((item, index) => (
            <figure
              key={item.id}
              className="item"
              ref={(el) => { itemRefs.current[index] = el; }}
              onClick={() => openArticle(item.id)}
            >
              <Image
                className="item__img"
                src={`/gallery/${item.id}.jpg`}
                alt={item.name}
                width={300}
                height={400}
                priority={index < 4}
                unoptimized
              />
              <figcaption className="item__caption">
                <h2 className="item__caption-title">
                  {item.name}
                </h2>
              </figcaption>
            </figure>
          ))}
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
              className={`article article-${item.id} ${
                currentArticle === item.id ? 'article--current' : ''
              }`}
            >
              <div className="article__img-wrap">
                <div
                  className="article__img"
                  style={{
                    backgroundImage: `url(/gallery/${item.id}.jpg)`,
                  }}
                />
              </div>
              
              <h2 className="article__title">{item.name}</h2>
              
              <div className="article__about">
                <h3 className="article__about-heading">About this Artwork</h3>
                <p>{item.about}</p>
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
                <p className="article__artist-pov"><em>"{item.artistPOV}"</em></p>
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
      />
      <Footer />
    </>
  );
}
