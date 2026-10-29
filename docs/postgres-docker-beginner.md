# Docker, Postgres, and PostgreSQL

This page is a beginner guide for this project. It explains the names people mix up, what each tool does, and the same setup steps on macOS and Windows.

The Daynix-specific login values and table list are also in `docs/docker-and-postgres.md`. The live-server checklist is in `docs/live-setup.md`.

## What each thing is

This is the explanation the steps below rely on. Read this part first.

### Database

A database is the place where the app saves information that must still be there after you close the app. Daynix saves accounts, login codes, and logged-in devices there. The database in this project is named `daynix`.

A database holds tables. A table holds rows. A row holds columns.

| Word | Simple meaning | Example in this project |
| --- | --- | --- |
| Database | The whole notebook | `daynix` |
| Table | One page in that notebook | `users` |
| Column | One heading on that page | `email` |
| Row | One filled-in line | one person, `testuser991@yopmail.com` |

### PostgreSQL and Postgres

PostgreSQL is the program that keeps that notebook and answers questions about it. Postgres is the short name for the same program. When this project says Postgres 17, it means PostgreSQL version 17.

You talk to it at an address: a host, a port, a username, a password, and a database name. All five are required. Missing any one of them is why a Connect button can fail.

### SQL

SQL is the language used to ask PostgreSQL a question or to save a change. The letters stand for Structured Query Language. One question looks like this:

```sql
SELECT name, email FROM users;
```

That sentence means: from the `users` table, give me the name and email of every row.

The phone app does not speak SQL. The API does. The viewer at port `8088` also does, when you click **Rows**.

### psql

psql is a terminal window that speaks SQL to PostgreSQL. It is a client. PostgreSQL is the server that stores the rows. This project can run psql inside the Docker box with `docker exec`. The browser viewer is the other client. Both clients read the same `users` table.

### Docker

Docker is a program on your Mac or Windows PC. Its job here is to start PostgreSQL for you. You install Docker Desktop. You leave the separate PostgreSQL installer unused for local Daynix work.

Three Docker words matter:

| Word | What it is | In this project |
| --- | --- | --- |
| Image | The downloaded package that describes a program | `postgres:17-alpine` and `sosedoff/pgweb` |
| Container | That package actually running | `daynix-postgres` and `daynix-db-ui` |
| Volume | The disk folder Docker keeps so rows survive a stop | `daynix_postgres_data` |

An image is the installer file. A container is the program after you press start. A volume is the saved data.

### Docker Compose

Docker Compose reads `docker-compose.yml` and starts every container listed there with one command:

```sh
docker compose up -d
```

`up` starts the containers. `-d` leaves them running in the background so you can close the terminal. `stop` pauses them and keeps the volume. `ps` shows whether they are running.

### Host, port, and localhost

The host is which computer to talk to. The port is which door on that computer.

| Word | Meaning | Value you type |
| --- | --- | --- |
| Host | The machine that has Postgres | `localhost` from your Mac or PC. `db` from the viewer form |
| `localhost` | "This computer" | Port `5432` for the API. Port `8088` for the viewer page |
| Port | The door number | `5432` is Postgres. `8088` is the table viewer |

`db` is the Docker-only name of the Postgres container. The viewer page runs inside Docker, so on that form the host is `db`. The API runs on your computer, so in `apps/api/.env` the host is `localhost`.

### Username, password, database, and SSL

These are the rest of the Connect form.

| Field | What it is | Local value |
| --- | --- | --- |
| Username | The account Postgres lets in | `daynix_user` |
| Password | The secret for that account | `local_dev_password` |
| Database | Which notebook to open after login | `daynix` |
| SSL Mode | Whether the connection is encrypted | `disable` on your computer. A live server usually requires SSL |
| Scheme | A single connection URL instead of separate boxes | Leave this tab unused. Use the **Standard** tab |
| SSH | A login that jumps through another computer first | Leave this tab unused for local Daynix |

The same five facts written as one line are called a connection string:

```text
postgresql://daynix_user:local_dev_password@localhost:5432/daynix
```

Read it as: protocol, username, password, host, port, database name.

### API

The API is the Node program in `apps/api`. The phone sends it JSON, such as an email and a 6-digit code. The API checks that input, then reads and writes Postgres. The phone never receives the database password.

### Hash

A hash is a scrambled fingerprint of a secret. The `email_otps` and `refresh_tokens` tables store that fingerprint. They do not store the 6-digit code or the refresh token in a form you can read back. On your computer the API still prints the real 6-digit code in its terminal so you can finish signup.

## The names

These words show up in docs, errors, and connection screens. Here is what each one means.

| Name you may see | What it actually is |
| --- | --- |
| **PostgreSQL** | The database program. Version in this project: 17. |
| **Postgres** | The short name for PostgreSQL. Same program, same data. |
| **Postgress** / **Postsql** | Common spellings of the names above. There is no separate product called PostSQL. |
| **SQL** | The language used to ask the database for rows or to save rows. PostgreSQL understands SQL. MySQL and many other databases understand SQL too. |
| **psql** | A small terminal program that sends SQL to PostgreSQL. The name is pronounced "P-S-Q-L" or "postgres SQL". |
| **Docker** | The tool that runs PostgreSQL in a box on your computer, so you do not install PostgreSQL yourself. |

PostgreSQL and Postgres are one database. SQL is the language. psql is one way to type that language. Docker is how this project starts the database.

A connection string uses the long name because that is the protocol:

```text
postgresql://daynix_user:local_dev_password@localhost:5432/daynix
```

`postgresql://` means "connect with the PostgreSQL protocol." The database on the other end is still Postgres.

## A simple example

Think of the database `daynix` as one notebook. Each table is one page. Each row is one record.

The `users` page looks like this:

| name | email |
| --- | --- |
| New Test User | newuser@example.com |
| Test user 991 | testuser991@yopmail.com |

SQL for "show me those two columns" is:

```sql
SELECT name, email FROM users;
```

You do not need to type that. The viewer page at [http://localhost:8088](http://localhost:8088) shows the same rows when you click **users**, then **Rows**.

This project stores four tables:

| Table | One row means |
| --- | --- |
| `users` | One account, created after the 6-digit code is verified |
| `email_otps` | One signup or login code request. The code itself is stored as a hash |
| `user_sessions` | One logged-in phone or browser |
| `refresh_tokens` | One secret that keeps that device logged in. Also stored as a hash |

The mobile app never opens these tables. It calls the API. The API (`apps/api`) is the only app that talks to Postgres, using `DATABASE_URL` in `apps/api/.env`.

## What Docker is doing

Docker Desktop runs programs in containers. A container is a running box with its own files and its own network name.

This project defines two boxes in `docker-compose.yml`:

| Container | Program inside | How you reach it from your computer |
| --- | --- | --- |
| `daynix-postgres` | PostgreSQL 17. Database name `daynix` | `localhost` port `5432` |
| `daynix-db-ui` | pgweb, the table viewer | [http://localhost:8088](http://localhost:8088) |

The login is already set for local development:

| Field | Value |
| --- | --- |
| Username | `daynix_user` |
| Password | `local_dev_password` |
| Database | `daynix` |
| Port | `5432` |
| SSL | `disable` |

Use host `localhost` in the API and in any app installed on your computer. Use host `db` only in the viewer Connect form. That form runs inside Docker, and inside Docker the database box is named `db`. Typing `localhost` there produces **connection refused**, because `localhost` inside the viewer is the viewer itself.

Saved rows live in a Docker volume named `daynix_postgres_data`. Stopping the containers keeps the rows. Deleting the volume removes them.

## macOS steps

1. Install Docker Desktop for Mac from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/). Open it and wait until it says Docker is running. You do not install PostgreSQL from the Postgres website.
2. Install Node.js 24 or newer and pnpm if you also want to run the API. The database itself only needs Docker.
3. Open Terminal. Go to the project folder. Example:

```sh
cd /Users/mac/Documents/Project/D/Daynix-Daily-Productivity
```

4. Start the database and the viewer:

```sh
docker compose up -d
```

The first run downloads the Postgres and pgweb images. Later runs are faster. `-d` means "keep running after the command finishes."

5. Check both boxes:

```sh
docker compose ps
```

`daynix-postgres` should say `healthy`. `daynix-db-ui` should say `Up`.

6. Open the viewer in a browser: [http://localhost:8088](http://localhost:8088).

If the Connect form appears, fill it like this:

| Field | Value |
| --- | --- |
| Host | `db` |
| Port | `5432` |
| Username | `daynix_user` |
| Password | `local_dev_password` |
| Database | `daynix` |
| SSL Mode | `disable` |

7. Click **users** on the left, then **Rows**.

8. When you are finished for the day, stop the boxes and keep the data:

```sh
docker compose stop
```

Start them again later with `docker compose up -d`.

## Windows steps

The commands are the same as on a Mac. Only the install and the folder path change.

1. Install Docker Desktop for Windows from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/). During setup, leave the WSL 2 option enabled when the installer offers it. Restart the PC if the installer asks. Open Docker Desktop and wait until it says Docker is running.
2. You do not install PostgreSQL from the Postgres website for this project. Docker Desktop runs it.
3. Open PowerShell or Windows Terminal. Go to the project folder. Example:

```powershell
cd C:\Users\YourName\Documents\Daynix-Daily-Productivity
```

4. Start the database and the viewer:

```powershell
docker compose up -d
```

If Windows says `docker` is not recognized, Docker Desktop is closed or the install did not finish. Open Docker Desktop, wait until it is running, then run the command again.

5. Check both boxes:

```powershell
docker compose ps
```

6. Open a browser to [http://localhost:8088](http://localhost:8088).

Use the same Connect form as on macOS. Host is `db`, not `localhost`. Username `daynix_user`, password `local_dev_password`, database `daynix`, port `5432`, SSL `disable`.

7. Click **users**, then **Rows**.

8. Stop the boxes and keep the data:

```powershell
docker compose stop
```

## Commands after install

Run these from the project folder on either system.

| You want to | Command |
| --- | --- |
| Start Postgres and the viewer | `docker compose up -d` |
| Start only Postgres | `docker compose up -d db` |
| Start only the viewer | `docker compose up -d db_ui` |
| See if they are running | `docker compose ps` |
| Stop them and keep accounts | `docker compose stop` |
| Look at tables | open [http://localhost:8088](http://localhost:8088) |

`docker compose down -v` deletes the saved database. Use that only when you mean to wipe local accounts.

## Optional: the psql command

psql is the terminal client. The viewer is enough for looking at users. This command prints the `users` table without opening a SQL window. It works on macOS Terminal and Windows PowerShell once the `daynix-postgres` container is running:

```sh
docker exec daynix-postgres psql -U daynix_user -d daynix -c "TABLE users;"
```

`docker exec` runs `psql` inside the Postgres container. `TABLE users` is a short SQL statement that means "show every column in `users`."
