# Scrible

A real-time collaborative whiteboard built with Next.js, Node.js, WebSockets, PostgreSQL, Prisma, and Turborepo.

## Features

- JWT-based authentication
- Create and join rooms
- Real-time collaborative drawing
- Pencil/freehand drawing
- Rectangle and circle tools
- WebSocket-based synchronization
- Persistent canvas data
- PostgreSQL database with Prisma ORM
- Monorepo architecture using Turborepo

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- WebSockets
- JWT authentication

### Database
- PostgreSQL
- Prisma ORM

### Infrastructure
- Turborepo
- pnpm

## Architecture

```text
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │                     │
                    │  Auth / Rooms /     │
                    │  Collaborative      │
                    │  Canvas             │
                    └─────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
              HTTP API                WebSocket
                 │                         │
        ┌────────▼────────┐       ┌────────▼────────┐
        │ Express Backend │       │  WS Backend     │
        │                 │       │                 │
        │ Auth / Rooms    │       │ Real-time sync  │
        └────────┬────────┘       └────────┬────────┘
                 │                         │
                 └────────────┬────────────┘
                              │
                       ┌──────▼──────┐
                       │ PostgreSQL  │
                       │  + Prisma   │
