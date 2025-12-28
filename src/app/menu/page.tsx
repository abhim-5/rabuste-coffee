"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { DealOfTheDay } from "@/components/menu/DealOfTheDay";
import { MenuSection } from "@/components/menu/MenuSection";
import { CoffeeDetail } from "@/components/menu/CoffeeDetail";
import { Cart } from "@/components/cart/Cart";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/hooks/useCart";
import {
    menuItems,
    getMenuItemsByCategory,
    getDealItems,
    getRecommendedItems,
    getMenuItemById,
} from "@/data/menuData";
import { MenuItem } from "@/types/menu";
import { motion } from "framer-motion";

export default function MenuPage() {
    const { cart, addItem, removeItem, updateQuantity } = useCart();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleAddToCart = (
        item: MenuItem,
        quantity: number,
        variations?: Record<string, string>
    ) => {
        addItem(item, quantity, variations);
        // Optional: Show a toast notification here
    };

    const handleAddRecommendedItem = (itemId: string) => {
        const item = getMenuItemById(itemId);
        if (item) {
            addItem(item, 1);
        }
    };

    const handleViewCart = () => {
        setIsCartOpen(true);
    };

    // Get items by category
    const dealItems = getDealItems();
    const coffeeItems = getMenuItemsByCategory("coffee");
    const pizzaItems = getMenuItemsByCategory("pizza");
    const pastriesItems = getMenuItemsByCategory("pastries");
    const sandwichItems = getMenuItemsByCategory("sandwiches");
    const beverageItems = getMenuItemsByCategory("beverages");
    const dessertItems = getMenuItemsByCategory("desserts");
    const recommendedItems = getRecommendedItems();

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20 pb-20 lg:pb-8">
                {/* Deal of the Day */}
                <DealOfTheDay />

                {/* Deals Section (if there are deal items) */}
                {dealItems.length > 0 && (
                    <MenuSection
                        title="Today's Special Deals"
                        items={dealItems}
                        onItemClick={handleItemClick}
                        onAddToCart={handleAddToCart}
                    />
                )}

                {/* Separator */}
                <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                    <hr className="border-t border-black/10" />
                </div>

                {/* Coffee Section */}
                <MenuSection
                    title="Coffee"
                    items={coffeeItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                />

                {/* Separator */}
                <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                    <hr className="border-t border-black/10" />
                </div>

                {/* Pizza Section */}
                <MenuSection
                    title="Pizza"
                    items={pizzaItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                />

                {/* Separator */}
                <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                    <hr className="border-t border-black/10" />
                </div>

                {/* Recommended Section */}
                <MenuSection
                    title="Recommended For You"
                    items={recommendedItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                />

                {/* Separator */}
                <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                    <hr className="border-t border-black/10" />
                </div>

                {/* Pastries Section */}
                <MenuSection
                    title="Pastries & Bakes"
                    items={pastriesItems}
                    onItemClick={handleItemClick}
                    onAddToCart={handleAddToCart}
                />

                {/* Separator */}
                <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                    <hr className="border-t border-black/10" />
                </div>

                {/* Sandwiches Section */}
                {sandwichItems.length > 0 && (
                    <>
                        <MenuSection
                            title="Sandwiches"
                            items={sandwichItems}
                            onItemClick={handleItemClick}
                            onAddToCart={handleAddToCart}
                        />
                        <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                            <hr className="border-t border-black/10" />
                        </div>
                    </>
                )}

                {/* Beverages Section */}
                {beverageItems.length > 0 && (
                    <>
                        <MenuSection
                            title="Beverages"
                            items={beverageItems}
                            onItemClick={handleItemClick}
                            onAddToCart={handleAddToCart}
                        />
                        <div style={{ backgroundColor: "#D8CBB8" }} className="w-full px-4 lg:px-6 py-0">
                            <hr className="border-t border-black/10" />
                        </div>
                    </>
                )}

                {/* Desserts Section */}
                {dessertItems.length > 0 && (
                    <MenuSection
                        title="Desserts"
                        items={dessertItems}
                        onItemClick={handleItemClick}
                        onAddToCart={handleAddToCart}
                    />
                )}

                {/* Footer */}
                <Footer />
            </main>

            {/* Coffee Detail Modal */}
            <CoffeeDetail
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onAddToCart={handleAddToCart}
                onViewCart={handleViewCart}
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
