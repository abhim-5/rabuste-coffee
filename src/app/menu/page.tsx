"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { DealSection } from "@/components/menu/DealSection";
import { MenuSection } from "@/components/menu/MenuSection";
import { CoffeeDetail } from "@/components/menu/CoffeeDetail";
import { Cart } from "@/components/cart/Cart";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/hooks/useCart";
import { menuItems, getDealItems } from "@/data/menuData";
import { MenuItem } from "@/types/menu";

export default function MenuPage() {
    const { cart, addItem, removeItem, updateQuantity } = useCart();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const dealItems = getDealItems();

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleAddToCart = (item: MenuItem) => {
        addItem(item, 1);
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

    const getCartQuantity = (itemId: string): number => {
        const cartItem = cart.items.find((item) => item.menuItem.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleAddToCartWithVariations = (
        item: MenuItem,
        quantity: number,
        variations?: Record<string, string>
    ) => {
        addItem(item, quantity, variations);
    };

    const handleAddRecommendedItem = (itemId: string) => {
        const item = menuItems.find((i) => i.id === itemId);
        if (item) {
            addItem(item, 1);
        }
    };

    const handleViewCart = () => {
        setIsCartOpen(true);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
                {/* Deal of the Day Section with Cards */}
                <DealSection
                    dealItems={dealItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    getCartQuantity={getCartQuantity}
                />

                {/* Main Menu Section with Filters */}
                <MenuSection
                    title="Our Menu"
                    items={menuItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    getCartQuantity={getCartQuantity}
                    showFilters={true}
                />

                {/* Footer */}
                <Footer />
            </main>

            {/* Coffee Detail Modal */}
            <CoffeeDetail
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onAddToCart={handleAddToCartWithVariations}
                onUpdateQuantity={handleUpdateQuantity}
                onViewCart={handleViewCart}
                currentCartQuantity={selectedItem ? getCartQuantity(selectedItem.id) : 0}
            />

            {/* Cart Drawer */}
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

            {/* Floating Cart Button */}
            <CartButton itemCount={cart.itemCount} onClick={() => setIsCartOpen(true)} />
        </>
    );
}
