# SPK SAW: Decision Support System

A web app that helps you **pick the best option** from a list, using the **SAW (Simple Additive Weighting)** method. You define the criteria (for example price, quality, distance), give each one a weight, score every option, and the app ranks them for you, showing every step of the math.

This was a course project for Decision Support Systems.

## How SAW works (in short)

1. **Decision matrix**: every option gets a value for every criterion.
2. **Normalize** each value to a 0–1 scale:
   - **Benefit** criteria (higher is better): `value / highest value`
   - **Cost** criteria (lower is better): `lowest value / value`
3. **Preference score**: multiply each normalized value by its criterion's weight and add them up.
4. **Rank** the options from the highest score to the lowest.

## Features

- Log in as `admin` or `user`
- Admins manage users
- **Criteria** with weights; the app checks that the weights add up to exactly **1.0000**
- **Alternatives** (the options), with an optional file upload
- Enter the values for the decision matrix
- Full SAW calculation: matrix, normalization, preference scores, and ranking
- Dashboard with statistics and history
- Export results to **PDF** and **Excel**
- Works on phones, with dark mode

## Tech stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS (shadcn-style components), Zustand, Recharts
- **Backend**: Laravel 11 REST API with Sanctum
- **Database**: MySQL 8

## Getting started

You need PHP 8.2+, Composer, Node.js, and MySQL (XAMPP works).

### 1. Database

Create a database called `spk_saw` and import `backend/database/sql/spk_saw.sql` (for example with phpMyAdmin).

Default accounts from the seed data:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@spk.test` | `password` |
| User | `user@spk.test` | `password` |

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Check the database settings in `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spk_saw
DB_USERNAME=root
DB_PASSWORD=
```

Start the API:

```bash
php -S 127.0.0.1:8000 -t public server-router.php
```

If you'd rather build the tables with Laravel migrations instead of the SQL file, run `php artisan migrate --seed`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run build
php -S 127.0.0.1:5173 -t dist
```

Open http://127.0.0.1:5173. The API runs at http://127.0.0.1:8000.

The frontend is served as a static build here because `npm run dev` can be unreliable on Windows paths with spaces. After changing frontend code, run `npm run build` again. On other systems, `npm run dev` works too.

## Important files

| File | What it is |
| --- | --- |
| `backend/routes/api.php` | API routes |
| `backend/app/Services/SAWService.php` | The SAW calculation |
| `frontend/src/App.tsx` | Frontend entry |
| `frontend/src/pages/DashboardPage.tsx` | Dashboard |
| `frontend/src/pages/PerhitunganPage.tsx` | Calculation results |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| "Network Error" when logging in | Make sure the backend is running on `127.0.0.1:8000` and you opened the frontend from `127.0.0.1:5173` (CORS allows `127.0.0.1:5173` and `localhost:5173`). Restart the backend after editing `.env`. |
| Laravel can't connect to MySQL | Check that MySQL is running, the `spk_saw` database exists, and the username and password in `.env` are right. |
| Frontend changes don't show up | Run `npm run build` again, since the frontend is served from the build folder. |

## License

Released under the [MIT License](LICENSE).
