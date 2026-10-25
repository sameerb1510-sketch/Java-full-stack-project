# Forge Fitness Club

A Java full-stack gym membership manager built for the course mini project. The app uses React and Vite for the client, Spring Boot for the REST API, and MySQL locally. It can also connect to PostgreSQL for a Render deployment. It demonstrates member and plan CRUD, attendance, renewals, validation, and exception handling.

## What it includes

- Dashboard totals for all members, active members, expired memberships, and memberships ending within seven days.
- Member search and a complete add, edit, and delete workflow.
- Monthly, quarterly, and yearly plans, with plan CRUD.
- Four-digit member codes, daily check-in rules, and attendance history.
- Payment history for the sample members, with each payment tied to its selected plan.
- Membership renewals that let staff choose any available plan and renew by that plan’s duration.
- Responsive pages for the dashboard, members, expired/expiring memberships, plans, check-in, attendance, and payments.

## Technologies

- Java 21 language target, Spring Boot 4.1.2, Spring Web, Spring Data JPA, Bean Validation, Maven.
- MySQL 8.4.
- PostgreSQL JDBC support for the Render deployment.
- React 19, React Router, Vite 8, HTML, CSS, and JavaScript.

## Prerequisites

Install a JDK, Maven, Node.js/npm, and MySQL. The installed JDK can compile the Java 21 target. Vite requires Node.js 20.19+ or 22.12+; Node.js 24 works. The versions used during setup are listed near the end of this file.

MySQL must be running on `localhost:3306`. The app expects a database named `gym_membership`. The backend can create and update tables using JPA, and it seeds three plans and five sample members into an empty database on first start. `schema.sql` is the matching SQL setup/reference and also contains sample rows.

The local setup created a `gym_app` database user. Its password is kept in the ignored `.env.local` file, never in tracked source. The backend launcher reads this file before starting Spring Boot.

## Run on this computer

The MySQL service is configured to start with Windows. If it is stopped, start it from an Administrator PowerShell with `Start-Service MySQL84`.

1. From the project root, start the backend:

   ```powershell
   .\run-backend.ps1
   ```

   This loads the local database settings and runs `spring-boot:run` with the project-local Maven installation. The API is at `http://localhost:8080`.

2. In a second terminal, install and start the React client:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

The demo login is `Admin` / `forge123`. This is a simple front-end demo gate; it does not secure the REST API and should not be used for real member data.

The GitHub Pages site connects to the Render backend, so member, plan, attendance, and payment changes are stored in the hosted database. The GitHub Pages login no longer displays the demo credentials hint.

## Deploy the full app on Render

The root `render.yaml` describes a live frontend, Spring Boot API, and Render PostgreSQL database. The API image uses Java 21 and Maven from `backend/Dockerfile`. The backend has PostgreSQL and MySQL drivers: Render uses PostgreSQL, while local development can continue using MySQL. The Render Blueprint connects the services automatically; no database credentials need to be pasted into the Blueprint.

Both hosted frontends use the live API and save changes to PostgreSQL. The Render Blueprint permits requests from the Render and GitHub Pages origins. If Render assigns a different URL to the static site or API, update the matching URL in `FRONTEND_ORIGINS` or the GitHub Pages workflow. Render's free PostgreSQL database expires 30 days after creation, so use it for a temporary demo and keep a backup if you need the data.

If you use your own MySQL credentials, set `MYSQL_URL`, `MYSQL_USER`, and `MYSQL_PASSWORD` in the environment or `.env.local`. `application.properties` supplies placeholder defaults for the connection.

## Database schema

`schema.sql` creates `plans`, `members`, `attendance`, and `payments`, with the member-plan and activity relationships. It inserts the three standard plans and five sample members. The application uses `spring.jpa.hibernate.ddl-auto=update` and seeds equivalent sample data when the tables are empty, so a fresh database can also be initialized by starting the backend.

To create the schema manually on a fresh MySQL installation, create the database first and run `schema.sql` as a MySQL user with schema privileges. Do not import the sample rows again after the application has already seeded its five sample members.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET, POST | `/plans` | List or add a plan |
| GET, PUT, DELETE | `/plans/{id}` | Read, update, or delete a plan |
| GET, POST | `/members` | List or add a member |
| GET, PUT, DELETE | `/members/{id}` | Read, update, or delete a member |
| GET | `/members/search?name=` | Search names, case-insensitively |
| GET | `/members/expired` | Expired or expiring within seven days |
| GET | `/dashboard` | Member counts |
| POST | `/attendance` | Check in by four-digit member code |
| GET | `/attendance/{memberId}` | Member attendance history |
| POST | `/payments` | Record the selected plan’s listed price and renew membership (`memberId`, `planId`) |
| GET | `/payments/{memberId}` | Member payment history |

Request and response examples are included in `docs/test-cases.md` and the source DTOs.

## Documentation

- `docs/er-diagram.md` — database relationships.
- `docs/test-cases.md` — workflow and validation cases with actual results from the final check.
- `docs/project-report-outline.md` — report sections and screenshot checklist.

## Project structure

```text
backend/        Spring Boot API, JPA entities, repositories, services, controllers
frontend/       React/Vite single-page client
schema.sql      MySQL schema and starter rows
docs/           ER diagram, test cases, and report outline
```

## Local tool versions used

- Java/Javac 26.0.1 (Maven compiles with `--release 21`)
- Apache Maven 3.10.0 in `.tools/apache-maven-3.10.0`
- Node.js 24.20.0 and npm 11.19.0
- MySQL Community Server 8.4.9
- Spring Boot 4.1.2, React 19.3.1, Vite 8.3.5, React Router 7.18.4
