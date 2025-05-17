# 📝 Todo App with Next.js + Supabase

A modern, real-time todo application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase for authentication and data storage.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-000000?style=for-the-badge&logo=github&logoColor=white)

## ✨ Features

- **🔐 User Authentication**: Secure sign up and login with Supabase Auth
- **📋 Todo Management**: Create, read, update, and delete todos
- **🛡️ Data Privacy**: Each user can only see and modify their own todos
- **⚡ Real-time Updates**: Changes appear instantly across all devices
- **🌓 Dark Mode Support**: Automatically adapts to system preferences
- **📱 Responsive Design**: Works on all device sizes

## 🛠️ Technology Stack

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) - React framework with App Router
  - [TypeScript](https://www.typescriptlang.org/) - Static typing
  - [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
  - [shadcn/ui](https://ui.shadcn.com/) - Accessible UI components
  - [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
  - [Lucide Icons](https://lucide.dev/) - Beautiful icons

- **Backend**:
  - [Supabase](https://supabase.com/) - Backend as a Service
  - PostgreSQL - SQL database
  - Row Level Security - Data access control

- **Development**:
  - [VS Code](https://code.visualstudio.com/) - Code editor
  - [GitHub Copilot](https://github.com/features/copilot) - AI pair programming

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account (free tier is sufficient)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/todo-app-sql.git
cd todo-app-sql
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Supabase**

   - Create a new project at [https://app.supabase.com](https://app.supabase.com)
   - Go to Project Settings > API to get your project URL and anon key
   - Create a `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set up the database schema**

   - Go to the SQL Editor in your Supabase dashboard
   - Copy the SQL code from `src/db/schema.sql`
   - Paste and run the SQL code in the editor

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open the application**

   - Visit [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Project Structure

```
src/
  ├── app/                 # Next.js app router pages
  │   ├── auth/            # Authentication page
  │   ├── globals.css      # Global styles
  │   ├── layout.tsx       # Root layout
  │   └── page.tsx         # Home page
  ├── components/          # React components
  │   ├── auth-form.tsx    # Authentication form
  │   ├── header.tsx       # App header with auth status
  │   ├── todo-list.tsx    # Todo list management
  │   └── ui/              # UI components (shadcn/ui)
  ├── db/                  # Database
  │   └── schema.sql       # SQL schema for Supabase
  └── lib/                 # Utility libraries
      ├── supabase.ts      # Supabase client configuration
      └── utils.ts         # Helper functions
```

## 🔒 Security

This application uses Row Level Security (RLS) in Supabase to ensure that users can only see and modify their own todos. The SQL policies are defined in `src/db/schema.sql` and are automatically applied when you run the SQL script.

## 👨‍💻 Development Process

This project was built using VS Code with GitHub Copilot, showcasing the power of AI-assisted development. The Model Context Protocol (MCP) in VS Code allowed for a streamlined development experience, helping to:

- Generate component templates
- Set up Supabase integration
- Implement authentication flows
- Create row-level security policies
- Debug and optimize code

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Supabase](https://supabase.com/) for the powerful backend platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [GitHub Copilot](https://github.com/features/copilot) for development assistance
