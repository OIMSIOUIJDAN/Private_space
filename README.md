# 💕 Us — Our Private Space

A romantic, private web app for two people to share messages, memories, and love notes.

## ✨ Features

- 💌 **Real-time Chat** — Messages sync instantly between devices
- 📸 **Photo Album** — A digital scrapbook of your memories
- 💝 **Jar of Love** — Add and randomly pull "reasons I love you" notes
- 📅 **Relationship Counters** — Days since you met, days until your next date
- 📱 **PWA** — Install on home screen for an app-like experience

## 🎨 Design

- Dark navy blue + baby pink color palette
- Elegant serif + soft sans-serif fonts
- Smooth animations with Framer Motion
- Mobile-first responsive design

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase (database + real-time + storage)

## 🚀 Deploy

This app is deployed on Vercel. Every push to `main` auto-deploys instantly.

## 💡 Setup

1. Create a Supabase project
2. Add your credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```
3. Run the SQL to create tables (see Supabase SQL Editor)
4. Create a `photos` storage bucket (public)
5. Push to GitHub — auto-deploys!

Made with love 💗
