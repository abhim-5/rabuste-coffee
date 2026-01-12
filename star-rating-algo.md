# Bayesian Average Rating System

This document explains the logic behind the "Star Ratings" displayed on the Menu Items.

## The Problem

Standard averages (Total Score / Total Votes) are flawed for products with very few reviews.

-   A product with **one** 5-star review has a 5.0 average.
-   A product with **one hundred** 4.8-star reviews has a 4.8 average.

Intuitively, the second product is "better" or at least more reliably good, but a naive sort would rank the first one higher. To solve this, we use a **Bayesian Average**.

## The Solution: Bayesian Average

This formula "pulls" a product's rating toward a "Global Average" (the baseline) if it doesn't have enough data (reviews) to be confident. As the number of reviews increases, the "pull" of the global average weakens, and the product's own rating dominates.

### The Formula

$$
\text{Weighted Score} = \left( \frac{v}{v + m} \cdot R \right) + \left( \frac{m}{v + m} \cdot C \right)
$$

### Variables used in Rabuste Coffee

| Variable | Description                                                   | Value Used         |
| :------- | :------------------------------------------------------------ | :----------------- |
| **R**    | The **average rating** of the specific product                | Calculated from DB |
| **v**    | The **number of votes** (reviews) for the specific product    | Calculated from DB |
| **C**    | The **Global Average** rating across the website              | **3.5** (Baseline) |
| **m**    | The **Confidence Number** (minimum votes to "prove" a rating) | **10**             |

### How it works behaviorally

-   **0 Reviews**: The formula yields **3.5** (The global average).
    -   _Note: In our UI, we display "New Product" instead of 3.5 stars for items with 0 reviews._
-   **Few Reviews**: If an item gets one 5-star review:
    -   $v=1, R=5, m=10, C=3.5$
    -   Score $\approx 3.63$. It moves slightly up from 3.5, but doesn't jump to 5.0 immediately.
-   **Many Reviews**: If an item gets 100 5-star reviews:
    -   $v=100, R=5, m=10, C=3.5$
    -   Score $\approx 4.86$. It is very close to its true 5.0 rating.

## SQL Implementation

This logic is implemented in the `products_with_ratings_view` view in the database:

```sql
( (COALESCE(rs.vote_count, 0)::numeric / (COALESCE(rs.vote_count, 0) + 10)::numeric) * COALESCE(rs.rating_avg, 0)::numeric ) +
( (10::numeric / (COALESCE(rs.vote_count, 0) + 10)::numeric) * 3.5 )
```
