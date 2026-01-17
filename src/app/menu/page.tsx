"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { DealSection } from "@/components/menu/DealSection";
import { MenuSection } from "@/components/menu/MenuSection";
import { CoffeeDetail } from "@/components/menu/CoffeeDetail";
import { Cart } from "@/components/cart/Cart";
import { CartButton } from "@/components/cart/CartButton";
import { OrderConfirmation } from "@/components/orders/OrderConfirmation";
import AuthModal from "@/components/auth/AuthModal";
import { useCart } from "@/hooks/useCart";
import { useMenu } from "@/hooks/useMenu"; // NEW: Database-driven menu
import { MenuItem, Variation } from "@/types/menu";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function MenuPage() {
    const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();

    // NEW: Use database-driven menu
    const { menuItems, featuredItems, loading: menuLoading, error: menuError, retry } = useMenu();

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [buttonRect, setButtonRect] = useState<DOMRect | undefined>();
    const loginButtonRef = useRef<HTMLButtonElement>(null);
    const [orderConfirmation, setOrderConfirmation] = useState<{
        isOpen: boolean;
        orderNumber: string;
        orderType: string;
        scheduledTime?: string;
        total: number;
        itemCount: number;
    }>({ isOpen: false, orderNumber: '', orderType: '', total: 0, itemCount: 0 });

    // Get current user
    useEffect(() => {
        const supabase = createClient();

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-open cart if coming from reorder
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('openCart') === 'true' && cart.itemCount > 0) {
            setIsCartOpen(true);
            // Clean up URL
            window.history.replaceState({}, '', '/menu');
        }
    }, [cart.itemCount]);

    // Log menu status for debugging
    useEffect(() => {
        if (!menuLoading) {
            console.log('📋 Menu loaded from database:', menuItems.length, 'items');
            console.log('⭐ Featured items:', featuredItems.length);
        }
    }, [menuLoading, menuItems, featuredItems]);

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleAddToCart = (item: MenuItem, variation?: Variation) => {
        addItem(item, 1, variation);
    };

    const handleUpdateQuantity = (item: MenuItem, change: number) => {
        const cartItemIndex = cart.items.findIndex(
            (cartItem) => cartItem.menuItem.id === item.id
        );

        if (cartItemIndex > -1) {
            const currentQty = cart.items[cartItemIndex].quantity;
            const newQty = currentQty + change;

            if (newQty <= 0) {
                removeItem(cartItemIndex);
            } else {
                updateQuantity(cartItemIndex, newQty);
            }
        }
    };

    // Get aggregated cart quantity for an item (sum of all variations)
    const getCartQuantity = (itemId: string | number): number => {
        const allVariations = cart.items.filter((item) => item.menuItem.id === itemId);
        return allVariations.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleAddToCartWithVariations = (
        item: MenuItem,
        quantity: number,
        variation?: Variation
    ) => {
        addItem(item, quantity, variation);
    };

    const handleAddRecommendedItem = (itemId: string) => {
        const item = menuItems.find((item) => String(item.id) === itemId);
        if (item) {
            addItem(item, 1);
        }
    };

    const handleOrderComplete = (orderNumber: string) => {
        // Set order confirmation data
        setOrderConfirmation({
            isOpen: true,
            orderNumber,
            orderType: 'takeaway-scheduled', // Will be passed from Cart
            total: cart.total,
            itemCount: cart.itemCount
        });
    };

    const handleShowAuth = () => {
        setShowAuthModal(true);
    };

    const handleViewCart = () => {
        setIsCartOpen(true);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8 bg-[#faeade]">
                <DealSection
                    dealItems={featuredItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    getCartQuantity={getCartQuantity}
                />

                <MenuSection
                    title="Our Menu"
                    items={menuItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    getCartQuantity={getCartQuantity}
                    showFilters={true}
                />

                <Footer />
            </main>

            <CoffeeDetail
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onAddToCart={handleAddToCartWithVariations}
                onUpdateQuantity={handleUpdateQuantity}
                onViewCart={handleViewCart}
                currentCartQuantity={selectedItem ? getCartQuantity(selectedItem.id) : 0}
                onRelatedItemClick={(item) => {
                    setSelectedItem(item);
                }}
                getCartQuantityForItem={getCartQuantity}
            />

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart.items}
                total={cart.total}
                itemCount={cart.itemCount}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onAddRecommendedItem={handleAddRecommendedItem}
                cartType="menu"
                currentUser={currentUser}
                onOrderComplete={handleOrderComplete}
                onClearCart={clearCart}
                onShowAuth={handleShowAuth}
            />

            <OrderConfirmation
                isOpen={orderConfirmation.isOpen}
                onClose={() => setOrderConfirmation({ ...orderConfirmation, isOpen: false })}
                orderNumber={orderConfirmation.orderNumber}
                orderType={orderConfirmation.orderType}
                scheduledTime={orderConfirmation.scheduledTime}
                total={orderConfirmation.total}
                itemCount={orderConfirmation.itemCount}
            />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                buttonRect={buttonRect}
            />

            <CartButton itemCount={cart.itemCount} onClick={() => setIsCartOpen(true)} />
        </>
    );
}
