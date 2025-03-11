# Ecommerce-Farm

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://nextjs.org/" target="blank"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="120" alt="Next.js Logo" /></a>
</p>

<p align="center">
  A scalable e-commerce platform for agricultural products, connecting farmers and buyers with modern tools and a farmer-friendly interface.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

Ecommerce-Farm: A scalable e-commerce platform for farm products, built with NestJS, Next.js, Tailwind CSS, featuring authentication and product management.

This project combines a robust backend with **NestJS** (TypeScript) for efficient server-side logic and a dynamic frontend with **Next.js** (TypeScript), styled using **Tailwind CSS** and **Shadcn/UI**. It supports user authentication, product listings, and order management, with plans for advanced features like seller dashboards and search filters.

## Features

- **User Authentication**: Secure login/register with JWT.
- **Product Management**: CRUD operations for agricultural products.
- **Order Processing**: Manage orders with a scalable system.
- **Responsive Design**: Modern UI with Tailwind CSS and earthy tones (#accc8b, #90c577, #74a65d, #599146, #44703d).
- **Scalability**: Supports 50,000+ concurrent users with SSR, SSG, and ISR.
- **Future Plans**: Seller dashboards, advanced search (image/text/filters), and REST API integration.

## Tech Stack

- **Backend**: NestJS, TypeScript, TypeORM (or Prisma), PostgreSQL
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn/UI, Redux
- **Tools**: Node.js, npm, concurrently, Git
- **Styling**: Tailwind CSS, PostCSS
- **Optimization**: SSR, SSG, ISR, lazy loading, code splitting

## Project Structure


ecommerce-farm/
├── backend/              # Backend (NestJS)
│   ├── src/              # Source code
│   ├── test/             # Tests
│   ├── .env              # Environment variables
│   ├── package.json      # Dependencies and scripts
│   └── README.md         # Backend docs
├── frontend/             # Frontend (Next.js)
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── .env.local        # Local environment variables
│   ├── package.json      # Dependencies and scripts
│   └── README.md         # Frontend docs
├── .gitignore            # Git ignore file
├── README.md             # Project overview
└── package.json          # Root scripts

## Getting Started

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/huykg1112/project-ecommerce-farm.git
   cd project-ecommerce-farm
2. Install dependencies:
  - For backend:
    ```bash
    cd backend
    npm install
  - For frontend:
    ```bash
    cd ../frontend
    npm install
  - For root (concurrently):
    ```bash
    cd ../frontend
    npm install
3. Set up environment variables:
   Create .env in backend:
   ```bash
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=youruser
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=ecommerce_farm

### Usage
- Run both backend and frontend:
  ```bash
  npm run dev
Backend: http://localhost:4200
Frontend: http://localhost:3000

- Run only backend:
  ```bash
  npm run start:backend
  
- Run only frontend:
  ```bash
  npm run start:frontend
