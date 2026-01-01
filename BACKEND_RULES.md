# Backend Rules – Rabuste Coffee

1. All database access must go through Prisma ORM
2. No raw SQL queries
3. No business logic in frontend components
4. Every API route must:
   - Validate user authentication (except public GET routes)
   - Handle errors properly
   - Be type-safe
5. Use UUIDs for all primary keys
6. PostgreSQL via Supabase
7. No payments, admin panel, or AI logic for now
8. Design APIs for future scaling
9. Follow single-responsibility principle per route
