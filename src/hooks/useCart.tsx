"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuItem, CartItem, CartState } from "@/types/menu";

const CART_STORAGE_KEY = "rabuste-cart";

const calculateSubtotal = (
    menuItem: MenuItem,
    quantity: number,
    selectedVariations?: Record<string, string>
): number => {
    let price = menuItem.price;

    if (selectedVariations && menuItem.variations) {
        menuItem.variations.forEach((variation) => {
            const selectedOptionId = selectedVariations[variation.id];
            if (selectedOptionId) {
                const option = variation.options.find((opt) => opt.id === selectedOptionId);
                if (option?.priceModifier) {
                    price += option.priceModifier;
                }
            }
        });
    }

    return price * quantity;
};

export function useCart() {
    const [cart, setCart] = useState<CartState>({
        items: [],
        total: 0,
        itemCount: 0,
    });

    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                const parsedCart: CartState = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addItem = useCallback(
        (
            menuItem: MenuItem,
            quantity: number = 1,
            selectedVariations?: Record<string, string>
        ) => {
            setCart((prevCart) => {
                const existingItemIndex = prevCart.items.findIndex(
                    (item) =>
                        item.menuItem.id === menuItem.id &&
                        JSON.stringify(item.selectedVariations) === JSON.stringify(selectedVariations)
                );

                let newItems: CartItem[];

                if (existingItemIndex > -1) {
                    newItems = [...prevCart.items];
                    const newQuantity = newItems[existingItemIndex].quantity + quantity;
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: newQuantity,
                        subtotal: calculateSubtotal(menuItem, newQuantity, selectedVariations),
                    };
                } else {
                    const newItem: CartItem = {
                        menuItem,
                        quantity,
                        selectedVariations,
                        subtotal: calculateSubtotal(menuItem, quantity, selectedVariations),
                    };
                    newItems = [...prevCart.items, newItem];
                }

                const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
                const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

                return { items: newItems, total, itemCount };
            });
        },
        []
    );

    const removeItem = useCallback((index: number) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.filter((_, i) => i !== index);
            const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
            const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

            return { items: newItems, total, itemCount };
        });
    }, []);

    const updateQuantity = useCallback((index: number, quantity: number) => {
        if (quantity <= 0) {
            return;
        }

        setCart((prevCart) => {
            const newItems = [...prevCart.items];
            const item = newItems[index];
            newItems[index] = {
                ...item,
                quantity,
                subtotal: calculateSubtotal(item.menuItem, quantity, item.selectedVariations),
            };

            const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
            const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

            return { items: newItems, total, itemCount };
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart({ items: [], total: 0, itemCount: 0 });
    }, []);

    return {
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
    };
}
