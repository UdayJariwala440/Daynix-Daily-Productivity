# Docker + PostgreSQL Setup Steps (Beginner Checklist)

Follow these steps in order. Each step says **where** to type the command: **Terminal**, **psql**, or **Browser**.

**What you will have at the end:** a working PostgreSQL database running in Docker, with a table and some data in it.

---

## Quick Checklist

- [ ] Step 1: Install Docker
- [ ] Step 2: Confirm Docker is running
- [ ] Step 3: Create a project folder
- [ ] Step 4: Start PostgreSQL
- [ ] Step 5: Confirm it is running
- [ ] Step 6: Connect to the database
- [ ] Step 7: Create a table and add data
- [ ] Step 8: (Optional) Connect with a GUI tool
- [ ] Step 9: Stop, start, and clean up
- [ ] Step 10: (Optional) Use Docker Compose

---

## Step 1: Install Docker

You do **not** need to install PostgreSQL separately. Docker will download it for you.

### Windows

1. Download **Docker Desktop** from https://www.docker.com/products/docker-desktop
2. Run the installer. Keep **"Use WSL 2"** ticked if it asks.
3. Restart your computer if asked.
4. Open **Docker Desktop** from the Start menu and accept the terms.

### Mac

1. Download **Docker Desktop** from the same link (choose **Apple Silicon** for M1/M2/M3/M4 chips, or **Intel**).
2. Open the `.dmg` file and drag Docker into **Applications**.
3. Open **Docker** from Applications and accept the terms.

### Linux (Ubuntu)

**Terminal:**
```bash
sudo apt update
sudo apt install docker.io
sudo systemctl enable --now docker

# Optional: run docker without sudo (log out and back in afterwards)
sudo usermod -aG docker $USER
```

---

## Step 2: Confirm Docker Is Running

**Windows/Mac:** Docker Desktop must be **open** and show a green "running" status. Wait until the startup animation finishes.

**Open a terminal:**

| System | How |
|--------|-----|
| Windows | Press `Win`, type **PowerShell**, press Enter |
| Mac | Press `Cmd + Space`, type **Terminal**, press Enter |
| Linux | Press `Ctrl + Alt + T` |

**Terminal:**
```bash
docker --version
docker run hello-world
```

**Expected result:** a version number, then a message starting with `Hello from Docker!`

If you see `Cannot connect to the Docker daemon`, Docker is not running yet. Start Docker Desktop and try again.

---

## Step 3: Create a Project Folder

This keeps your files organized.

**Terminal:**
```bash
mkdir my-postgres-project
cd my-postgres-project
```

---

## Step 4: Start PostgreSQL

**Terminal:** copy this as **one line**:

```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret123 -e POSTGRES_DB=shop -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16
```

**What each part does:**

| Part | Meaning |
|------|---------|
| `-d` | Run in the background |
| `--name my-postgres` | Name of your container |
| `-e POSTGRES_USER=admin` | Database username |
| `-e POSTGRES_PASSWORD=secret123` | Database password (change it for real projects) |
| `-e POSTGRES_DB=shop` | Name of the database to create |
| `-p 5432:5432` | Open Postgres's port so you can connect |
| `-v pgdata:/var/lib/postgresql/data` | Save data in a volume so it is not lost |
| `postgres:16` | The image (Postgres version 16) |

**First time only:** you will see `Unable to find image 'postgres:16' locally` and a download. This is normal and can take a minute.

**Port already in use?** If you see `port is already allocated`, change `-p 5432:5432` to `-p 5433:5432` and use port **5433** everywhere below.

---

## Step 5: Confirm It Is Running

**Terminal:**
```bash
docker ps
```

You should see `my-postgres` with status **Up**.

Check the logs:
```bash
docker logs my-postgres
```

Look for this line near the end:

```
database system is ready to accept connections
```

If the container is missing from `docker ps`, run `docker ps -a` and `docker logs my-postgres` to see what went wrong.

---

## Step 6: Connect to the Database

**Terminal:**
```bash
docker exec -it my-postgres psql -U admin -d shop
```

Your prompt changes to:

```
shop=#
```

You are now inside **psql**. Everything you type from here is SQL or a `\` shortcut, **not** a Docker command.

---

## Step 7: Create a Table and Add Data

**psql:** type these one at a time, pressing Enter after each.

**Create a table:**
```sql
CREATE TABLE users (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT UNIQUE,
    age   INT
);
```

**Add data:**
```sql
INSERT INTO users (name, email, age) VALUES
    ('Asha', 'asha@example.com', 25),
    ('Ravi', 'ravi@example.com', 30),
    ('Meera', 'meera@example.com', 22);
```

**Read it back:**
```sql
SELECT * FROM users;
```

**Expected result:**

```
 id | name  |       email       | age
----+-------+-------------------+-----
  1 | Asha  | asha@example.com  |  25
  2 | Ravi  | ravi@example.com  |  30
  3 | Meera | meera@example.com |  22
```

**Useful extras:**
```sql
SELECT * FROM users WHERE age > 24;
UPDATE users SET age = 26 WHERE name = 'Asha';
DELETE FROM users WHERE name = 'Meera';
```

**psql shortcuts:**
```
\dt        list tables
\d users   describe the users table
\l         list databases
\q         quit psql (back to the terminal)
```

> Remember: end SQL statements with `;`. Don't put `;` after `\` shortcuts.

---

## Step 8: (Optional) Connect with a GUI Tool

If you prefer clicking over typing, install one of these (free):

- **DBeaver**: https://dbeaver.io
- **pgAdmin**: https://www.pgadmin.org
- **TablePlus**: https://tableplus.com

Create a new PostgreSQL connection with these settings:

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` (or `5433` if you changed it) |
| Database | `shop` |
| Username | `admin` |
| Password | `secret123` |

Click **Test Connection**, then **Connect**. You should see your `users` table.

**Connection string (for code):**
```
postgresql://admin:secret123@localhost:5432/shop
```

---

## Step 9: Stop, Start, and Clean Up

**Terminal:**

```bash
docker stop my-postgres        # stop (data is kept)
docker start my-postgres       # start again
docker restart my-postgres     # restart
docker logs -f my-postgres     # watch live logs (Ctrl + C to exit)
```

**Remove the container (data is still safe in the volume):**
```bash
docker stop my-postgres
docker rm my-postgres
```
Run the Step 4 command again and your data will still be there.

**Delete everything, including your data (cannot be undone):**
```bash
docker stop my-postgres
docker rm my-postgres
docker volume rm pgdata
```

**Backup and restore:**
```bash
# Backup
docker exec my-postgres pg_dump -U admin shop > backup.sql

# Restore
cat backup.sql | docker exec -i my-postgres psql -U admin -d shop
```

---

## Step 10: (Optional) Use Docker Compose

Docker Compose replaces the long `docker run` command with a small file.

**1. Remove the old container first (if it exists):**
```bash
docker stop my-postgres
docker rm my-postgres
```

**2. Create a file named `docker-compose.yml`** in your project folder with this content:

```yaml
services:
  db:
    image: postgres:16
    container_name: my-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: shop
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**3. Start it (Terminal, in the same folder):**
```bash
docker compose up -d
```

**4. Other Compose commands:**
```bash
docker compose ps         # status
docker compose logs -f    # logs
docker compose down       # stop and remove containers (data kept)
docker compose down -v    # ALSO deletes data (careful!)
```

> YAML is strict about spaces. Use **spaces, not tabs**, and keep the indentation exactly as shown.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| `Cannot connect to the Docker daemon` | Docker is not running | Open Docker Desktop and wait for "running" |
| `docker: command not found` | Docker not installed, or terminal not restarted | Reinstall Docker, then reopen the terminal |
| `port is already allocated` | Something else uses port 5432 | Use `-p 5433:5432` and connect to 5433 |
| `container name "/my-postgres" is already in use` | Old container exists | `docker rm -f my-postgres`, then run again |
| `Database is uninitialized and superuser password is not specified` | Missing password | Add `-e POSTGRES_PASSWORD=...` |
| `connection refused` right after starting | Postgres is still starting | Wait 5 to 10 seconds, check `docker logs my-postgres` |
| `password authentication failed` | Wrong password, or you changed it after the first run | Env variables only apply on first creation. Reset with `docker volume rm pgdata` (deletes data) |
| `psql: command not found` in terminal | `psql` is not installed on your computer | Use `docker exec -it my-postgres psql -U admin -d shop` instead |
| Data disappeared | No volume used, or you deleted the volume | Always include `-v pgdata:/var/lib/postgresql/data` |
| Windows: Docker Desktop will not start | WSL 2 or virtualization is off | Run `wsl --update` in PowerShell, and enable virtualization in BIOS if needed |
| `syntax error` when typing SQL | Typed in the terminal, not psql | Enter psql first (Step 6) |

---

## Command Summary

```bash
# Setup
docker --version
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret123 -e POSTGRES_DB=shop -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16

# Check
docker ps
docker logs my-postgres

# Connect
docker exec -it my-postgres psql -U admin -d shop

# Control
docker stop my-postgres
docker start my-postgres
docker rm my-postgres

# Compose
docker compose up -d
docker compose down
```

---

## Security Notes

- Change `secret123` to a strong password for anything beyond practice.
- Never upload passwords to GitHub. Store them in a `.env` file and add it to `.gitignore`.
- Don't expose port 5432 to the public internet.

You are done. You now have PostgreSQL running in Docker.
