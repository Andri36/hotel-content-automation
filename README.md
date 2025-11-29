# Hotel Content Automation

Sistem otomatis untuk scraping data hotel, membuat artikel menggunakan AI, dan mempublikasikan konten secara terjadwal dengan dashboard web responsif.

---

## Fitur Utama

- **AI Article Generator** - Membuat artikel dengan OpenAI API (fallback tersedia)
- **Scraping Hotel Otomatis** - Mengumpulkan data hotel setiap 2 jam
- **Mobile-Responsive UI** - Dashboard web yang responsif dengan React + Tailwind
- **Social Media Integration** - Simulasi auto-posting ke Twitter & LinkedIn
- **Chatbot AI** - Chatbot interaktif dengan fallback
- **Live Status Monitoring** - Monitor status scheduler dan proses automation
- **TypeScript Full-Stack** - Backend Express + Frontend React dengan type safety

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Express.js, Node.js, TypeScript |
| **Database** | PostgreSQL, Drizzle ORM |
| **Automation** | Node Scheduler, Background Jobs |
| **Validation** | Zod Schema Validation |

---

##  Installation

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd ai-agent/AssessmentHelper
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Buat file `server/.env`:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` dengan API keys Anda:

```env
# OpenAI API (opsional - fallback tersedia)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# Twitter API (opsional)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# LinkedIn (opsional)
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

# Database (opsional - gunakan jika custom database)
DATABASE_URL=postgresql://user:password@host:port/dbname
```

**Catatan:** Sistem memiliki fallback, jadi bisa berjalan tanpa API keys yang lengkap.

---

## Menjalankan Server

### Development Mode (Recommended)

```bash
npm run dev
```

**Apa yang terjadi:**
- Server Express + React berjalan di `http://localhost:5000` (1 server)
- Vite terintegrasi sebagai middleware (bukan standalone server)
- Hot Module Reload (HMR) aktif untuk frontend
- Scheduler berjalan di background

**Otomatis berjalan:**
- Scrape hotel data
- Generate artikel dengan AI
- Publish konten
- Simulasi sharing ke social media (setiap 2 jam)

### Production Build

```bash
npm run build
```

Membuat optimized production build.

### Start Production Server

```bash
npm start
```

Menjalankan server production di port 5000.

### Other Useful Commands

```bash
npm run check      # Check TypeScript errors
npm run db:push    # Sync database schema
```

---

## Project Structure

```
AssessmentHelper/
├── client/                          # Frontend (React + Vite)
│   ├── index.html
│   └── src/
│       ├── App.tsx                  # Root component
│       ├── main.tsx                 # Entry point
│       ├── components/              # React components
│       │   ├── ArticleView.tsx
│       │   ├── ChatbotUI.tsx
│       │   ├── HotelCard.tsx
│       │   └── ui/                  # shadcn/ui components (40+)
│       ├── pages/                   # Page components
│       ├── hooks/                   # Custom hooks
│       └── lib/                     # Utilities
│
├── server/                          # Backend (Express)
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API routes
│   ├── storage.ts                   # Database operations
│   ├── .env.example                 # Environment template
│   └── services/                    # Business logic
│       ├── scraper.ts               # Web scraper
│       ├── contentGenerator.ts       # AI content generation
│       ├── scheduler.ts             # Job scheduler
│       └── socialPoster.ts          # Social media posting
│
├── shared/                          # Shared code
│   └── schema.ts                    # Database schema (Drizzle + Zod)
│
├── script/                          # Build scripts
│   └── build.ts
│
├── Configuration Files
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── drizzle.config.ts
│   ├── .gitignore
│   └── .env.example
│
└── Documentation
    ├── README.md                    # This file
    ├── design_guidelines.md         # UI/UX guidelines
    └── components.json              # Component config
```

---

## Available Scripts

```bash
npm run dev       # Start development server (backend + frontend)
npm run build     # Build production bundle
npm start         # Run production server
npm run check     # Check TypeScript errors
npm run db:push   # Push database schema to PostgreSQL
```

---

## API Endpoints

### Base URL
- Development: `http://localhost:5000`

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/latest` | Get latest content |
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles/:id` | Get specific article |
| GET | `/api/hotels` | Get all hotels |
| GET | `/api/hotels/:id` | Get specific hotel |
| POST | `/api/chat` | Chat with AI chatbot |

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---