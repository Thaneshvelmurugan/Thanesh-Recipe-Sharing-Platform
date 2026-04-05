# Recipe Sharing Platform

A full-stack MERN recipe sharing application with recipe discovery, ratings, comments, video tutorials, user profiles, ingredient-based search, meal planning, favorites, and social follow features.

## Tech stack

- MongoDB + Mongoose
- Express.js + Node.js
- React + Vite
- Tailwind CSS

## Features

- User registration and login with JWT authentication
- Recipe submission with title, description, ingredients, steps, cooking time, servings, photo URL, and embedded YouTube tutorial
- Search and filters for ingredients, cuisine, dietary preferences, meal type, and rating
- Ratings, likes, favorites, and comments on recipe detail pages
- Profile management and user dashboards
- Social following between users
- Weekly meal planning with generated shopping lists

## Project structure

```text
client/   React + Tailwind frontend
server/   Express + MongoDB backend
```

## Local setup

1. Copy `.env.example` to `.env` and update values for your environment.
2. Install dependencies with `npm run install:all`.
3. Start MongoDB locally.
4. Seed demo data with `npm --workspace server run seed`.
5. Run the backend with `npm run dev:server`.
6. Run the frontend with `npm run dev:client`.

## Demo credentials

- `maya@example.com` / `password123`
- `ethan@example.com` / `password123`

## Deployment

### Frontend on Netlify

- Build command: `npm --workspace client run build`
- Publish directory: `client/dist`
- Environment variable: `VITE_API_URL=<your Render backend url>/api`

### Backend on Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`
- Optional: use the included `render.yaml` blueprint to create both the backend web service and the frontend static site with the correct root directories.

### Render root deploy fallback

- If you deploy the repository root as a single Render web service, use:
- Build command: `npm install`
- Start command: `npm start`
- This starts the backend directly with `node server/src/server.js`

## Notes

- Photo and video uploads are URL-based in this version to keep deployment simple.
- Use embedded YouTube links like `https://www.youtube.com/embed/...` for tutorials.
- Keep the code open source, and do not include the assessment provider's name anywhere in the codebase.
