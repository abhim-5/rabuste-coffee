'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import AuthModal from '@/components/auth/AuthModal';

const FranchiseInquiry = () => {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check authentication
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/franchise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    location: formValues.location,
                    message: formValues.message || ''
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                setFormValues({});
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
                const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to submit inquiry');
                alert('❌ ' + errorMsg);
                console.error('Franchise submission error:', data);
            }
        } catch (error) {
            console.error('Franchise inquiry error:', error);
            setSubmitStatus('error');
            alert('❌ Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputs = [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email Address', type: 'email' },
        { name: 'phone', label: 'Phone Number', type: 'tel' },
        { name: 'location', label: 'Preferred Location', type: 'text' },
    ];

    return (
        <section id="franchise-inquiry" className="relative w-full py-20 lg:py-32 bg-[#faeade] overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left Column: The Pitch */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1"
                    >
                        <h2 className="font-tan-pearl text-5xl lg:text-7xl font-bold text-[#7f3b2d] mb-8 leading-tight lowercase">
                            build your <br />
                            <span className="text-[#c58d4a]">legacy</span>
                        </h2>

                        <div className="space-y-8 font-serif text-[#7f3b2d]/80 text-lg lg:text-xl leading-relaxed">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Partner with Rabuste to bring the boldest dark roast experience to your city. We don't just sell coffee; we cultivate culture.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="pl-6 border-l-2 border-[#7f3b2d]">
                                <h3 className="font-tan-pearl text-2xl font-bold text-[#7f3b2d] mb-2 uppercase">Why Partner?</h3>
                                <ul className="space-y-2">
                                    <li>✦ Proven High-Yield Model</li>
                                    <li>✦ Comprehensive Operational Support</li>
                                    <li>✦ Exclusive Territory Rights</li>
                                </ul>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Column: The Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="flex-1"
                    >
                        <h3 className="font-tan-pearl text-3xl font-bold text-[#7f3b2d] mb-8 lowercase">
                            unit franchise inquiry
                        </h3>

                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800">
                                ✅ Thank you! We'll contact you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {inputs.map((input) => (
                                <div key={input.name} className="relative group">
                                    <input
                                        type={input.type}
                                        id={input.name}
                                        name={input.name}
                                        value={formValues[input.name] || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-b border-[#7f3b2d]/30 py-4 text-[#7f3b2d] text-lg focus:outline-none focus:border-[#7f3b2d] transition-colors duration-300 peer placeholder-transparent"
                                        placeholder={input.label}
                                        onFocus={() => setFocusedField(input.name)}
                                        onBlur={() => setFocusedField(null)}
                                        suppressHydrationWarning
                                    />
                                    <label
                                        htmlFor={input.name}
                                        className={`absolute left-0 transition-all duration-300 pointer-events-none
                                            ${focusedField === input.name || formValues[input.name]
                                                ? '-top-3 text-xs text-[#7f3b2d]'
                                                : 'top-4 text-lg text-[#7f3b2d]/60'
                                            }`}
                                    >
                                        {input.label}
                                    </label>
                                    <div className={`absolute bottom-0 left-0 h-0.5 bg-[#7f3b2d] transition-all duration-500 ease-out ${focusedField === input.name ? 'w-full' : 'w-0'}`} />
                                </div>
                            ))}

                            <div className="relative group">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formValues['message'] || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-[#7f3b2d]/30 py-4 text-[#7f3b2d] text-lg focus:outline-none focus:border-[#7f3b2d] transition-colors duration-300 peer placeholder-transparent resize-none"
                                    placeholder="Your Message/Vision"
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    suppressHydrationWarning
                                />
                                <label
                                    htmlFor="message"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none
                                        ${focusedField === 'message' || formValues['message']
                                            ? '-top-3 text-xs text-[#7f3b2d]'
                                            : 'top-4 text-lg text-[#7f3b2d]/60'
                                        }`}
                                >
                                    Your Message/Vision
                                </label>
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#7f3b2d] transition-all duration-500 ease-out ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#7f3b2d] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#faeade] font-tan-pearl text-xl font-bold uppercase tracking-widest hover:bg-[#5e2b20] transition-colors duration-300 shadow-xl mt-8"
                            >
                                {isSubmitting ? 'SUBMITTING...' : 'Submit Inquiry'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Flagship Location Map */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-24 lg:mt-32"
                >
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#404040] mb-8 text-center">
                        Our Flagship Location
                    </h2>
                    <p className="font-serif text-[#5C5C5C] text-lg text-center mb-12 max-w-2xl mx-auto">
                        Experience the original Rabuste vibes at our main cafe in Surat.
                        <br />
                        <span className="font-bold">Dimple Row House 15, Gymkhana Road, Piplod, Surat, Gujarat 395007</span>
                    </p>

                    <div className="w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-[#8B6F47]/20 grayscale-0 lg:grayscale lg:hover:grayscale-0 transition-all duration-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.654817757984!2d72.78453531485664!3d21.166159985923985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0527375555555%3A0x6b0b0b0b0b0b0b0b!2sGymkhana%20Rd%2C%20Piplod%2C%20Surat%2C%20Gujarat%20395007!5e0!3m2!1sen!2sin!4v1625634567890!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Rabuste Coffee Flagship Location"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                buttonRect={undefined}
            />
        </section>
    );
};

export default FranchiseInquiry;
