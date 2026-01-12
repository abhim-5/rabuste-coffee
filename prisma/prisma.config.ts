import 'dotenv/config'
import { defineConfig } from '@prisma/client'

export default defineConfig({
  adapter: {
    url: process.env.DATABASE_URL!,
  },
  // Use directUrl for migrations
  migrate: {
    directUrl: process.env.DIRECT_URL!,
  },
})
