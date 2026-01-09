"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuItem, CartItem, CartState, Variation } from "@/types/menu";

const CART_STORAGE_KEY = "rabuste-cart";

const calculateSubtotal = (
    menuItem: MenuItem,
    quantity: number,
    selectedVariation?: Variation
): number => {
    // If variation is selected, use variation price, otherwise use menu item price
    const price = selectedVariation ? selectedVariation.price : menuItem.price;
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
                // Failed to parse cart, will use default empty state
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
            selectedVariation?: Variation
        ) => {
            setCart((prevCart) => {
                // Each variation is a separate cart item
                // Match by both item ID AND variation name
                const existingItemIndex = prevCart.items.findIndex(
                    (item) =>
                        item.menuItem.id === menuItem.id &&
                        item.selectedVariation?.name === selectedVariation?.name
                );

                let newItems: CartItem[];

                if (existingItemIndex > -1) {
                    // Update existing cart item quantity
                    newItems = [...prevCart.items];
                    const newQuantity = newItems[existingItemIndex].quantity + quantity;
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: newQuantity,
                        subtotal: calculateSubtotal(menuItem, newQuantity, selectedVariation),
                    };
                } else {
                    // Add new cart item (new variation = new item)
                    const newItem: CartItem = {
                        menuItem,
                        quantity,
                        selectedVariation,
                        subtotal: calculateSubtotal(menuItem, quantity, selectedVariation),
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
                subtotal: calculateSubtotal(item.menuItem, quantity, item.selectedVariation),
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
