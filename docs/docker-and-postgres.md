# Docker and Postgres in Daynix

This page explains the database side of this project in plain terms: what Docker is doing, what Postgres is storing, how to open it, and which host name to type.

You do not install Postgres on your Mac. Docker runs it for you.

## The three pieces

| Piece | What it is | Where you see it |
| --- | --- | --- |
| Docker | Runs the database in a small isolated box called a container, so you do not install Postgres yourself | Docker Desktop, and the `docker compose` commands below |
| Postgres | The database. It keeps accounts, login codes, sessions, and refresh tokens | Container name `daynix-postgres` |
| Database viewer | A web page for looking at those tables. The project uses pgweb | [http://localhost:8088](http://localhost:8088) |

Only the API (`apps/api`) talks to Postgres. The mobile app talks to the API. The web app and the docs app do not use this database.

## What Docker starts

Both boxes are defined in `docker-compose.yml`.

| Container name | Job | Address on your Mac |
| --- | --- | --- |
| `daynix-postgres` | Postgres 17. Database name `daynix` | `localhost` port `5432` |
| `daynix-db-ui` | The viewer page (pgweb) | `localhost` port `8088` |

Start them from the project folder:

```sh
docker compose up -d
```

`up` creates and starts the boxes. `-d` keeps them running in the background. After this, leave the terminal. The database stays up until you stop Docker or stop the containers.

Stop them with:

```sh
docker compose stop
```

That pauses the boxes. Your saved data stays. Start again later with `docker compose up -d`.

See whether they are running:

```sh
docker compose ps
```

`daynix-postgres` should say `healthy`. `daynix-db-ui` should say `Up`.

## Where the rows are saved

Postgres keeps files inside a Docker volume named `daynix_postgres_data`. That volume survives `docker compose stop` and a Mac restart, as long as you do not delete the volume.

These commands remove the saved database. Do not run them unless you mean to wipe local accounts:

```sh
docker compose down -v
```

## Login values already set in this project

Local development already has a user and password. They are in `docker-compose.yml` and in `apps/api/.env`.

| Field | Value | Who uses it |
| --- | --- | --- |
| Host, from your Mac or the API | `localhost` | `DATABASE_URL` in `apps/api/.env` |
| Host, inside the viewer form | `db` | The Connect form at [http://localhost:8088](http://localhost:8088) |
| Port | `5432` | Both |
| Username | `daynix_user` | Both |
| Password | `local_dev_password` | Both |
| Database | `daynix` | Both |
| SSL | `disable` | Local only |

`localhost` and `db` are two names for the same database.

- On your Mac, `localhost` means this computer. Port `5432` is published there, so the API uses `localhost`.
- The viewer page runs inside Docker. From inside that box, `localhost` is the viewer itself, not Postgres. The database box is named `db`. That is why the Connect form returns **connection refused** when Host is `localhost`, and why Host must be `db` on that form.

The API connection string is already:

```text
postgresql://daynix_user:local_dev_password@localhost:5432/daynix
```

These values are for your computer only. A live server needs its own database, user, and password. That checklist is in `docs/live-setup.md`.

## How to look at the data

Open the viewer. No SQL to type.

```sh
docker compose up -d db_ui
```

Then open [http://localhost:8088](http://localhost:8088).

If it asks you to connect, use Host `db` and the login table above. If it is already connected, skip the form.

On the left, under **Tables**, click a table, then click **Rows**.

| Table | What a row means |
| --- | --- |
| `users` | An account. A row appears only after the 6-digit code is verified, not when signup is first requested. |
| `email_otps` | A signup or login code request. The real 6-digit code is not stored. Only a hash is stored, plus expiry and how many tries were used. |
| `user_sessions` | One logged-in device. It records the device name, platform, last activity, and whether the session was revoked. |
| `refresh_tokens` | The secret that lets that device stay logged in. Only a hash is stored. A new row replaces the old one when the token refreshes. |

There is no extra admin account to insert by hand. Empty tables mean nobody has finished signup on this database yet.

## What happens when someone signs up

1. The phone calls the API.
2. The API checks Postgres for that email.
3. The API writes one row in `email_otps`.
4. On your computer, while `NODE_ENV` is not `production`, the API prints the 6-digit code in its terminal. It does not send email yet.
5. When the code is verified, the API writes one row in `users`, one row in `user_sessions`, and one row in `refresh_tokens`.

Click the table again in the viewer to see the new row. The page does not refresh by itself.

## Commands you will actually use

Run these from the project folder.

| You want to | Command |
| --- | --- |
| Start the database and the viewer | `docker compose up -d` |
| Start only the database | `docker compose up -d db` |
| Start only the viewer | `docker compose up -d db_ui` |
| Check that both are running | `docker compose ps` |
| Stop them and keep the data | `docker compose stop` |
| Open the tables in the browser | go to [http://localhost:8088](http://localhost:8088) |

If `docker compose ps` shows nothing, Docker Desktop is stopped or the containers were never started. Open Docker Desktop, then run `docker compose up -d` again.
