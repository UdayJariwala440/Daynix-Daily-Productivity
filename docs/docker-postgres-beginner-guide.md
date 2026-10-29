# Docker, PostgreSQL & SQL: A Beginner-Friendly Guide

> Goal: understand what these tools are, why they exist, and how to use them together, with no prior experience needed.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
   - [1.1 PostgreSQL and Postgres](#11-postgresql-and-postgres)
   - [1.2 How to Write and Run Commands](#12-how-to-write-and-run-commands)
   - [1.3 Do I Need to Install Postgres Separately If I Have Docker?](#13-do-i-need-to-install-postgres-separately-if-i-have-docker)
2. [Part 1: Docker](#2-part-1-docker)
3. [Part 2: Databases, SQL, and PostgreSQL](#3-part-2-databases-sql-and-postgresql)
4. [Part 3: Using Docker + PostgreSQL Together](#4-part-3-using-docker--postgresql-together)
5. [Docker Compose (the easy way)](#5-docker-compose-the-easy-way)
6. [Common Mistakes & Fixes](#6-common-mistakes--fixes)
7. [Cheat Sheets](#7-cheat-sheets)
8. [What to Learn Next](#8-what-to-learn-next)

---

## 1. The Big Picture

| Term | What it is | Real-life analogy |
|------|-----------|-------------------|
| **Docker** | A tool that runs apps in isolated, portable boxes | Shipping containers: same box works on any ship or truck |
| **Database** | A place to store data in an organized way | A giant, organized filing cabinet |
| **SQL** | A language to talk to a database | The language you use to ask the filing clerk for things |
| **PostgreSQL / Postgres** | A popular database program that understands SQL | The actual filing cabinet and clerk |

**Important:** "Postgres" and "PostgreSQL" are the **same thing**. Postgres is just the short nickname.

**How they fit together:**

```
Your App  --(SQL)-->  PostgreSQL (database)  <-- runs inside -->  Docker (container)
```

### 1.1 PostgreSQL and Postgres

**They are the same database.** There is only one product. The two names exist for historical and practical reasons.

| Name | Where you'll see it | Notes |
|------|--------------------|-------|
| **PostgreSQL** | Official name, documentation, website (postgresql.org), job listings | The "proper" name |
| **Postgres** | Casual talk, tutorials, Docker image (`postgres`), commands (`postgres`, `psql`), package names | The popular nickname, also fully accepted by the project |

**Why two names? A short history**

1. **Ingres** (1970s): an early database project at UC Berkeley.
2. **Postgres** (1986): Berkeley's follow-up project, literally "**Post**-**Ingres**".
3. **Postgres95** (1995): SQL support was added to it.
4. **PostgreSQL** (1996): renamed to show it now speaks **SQL**, giving "Postgres" + "SQL" = **PostgreSQL**.

So "Postgres" is the older name and "PostgreSQL" is the name that stuck officially. People kept using "Postgres" because it's easier to say.

**How to pronounce it**

- **PostgreSQL**: "Post-gres-Q-L" (the official pronunciation).
- **Postgres**: "Post-gres".
- It is **not** "Post-gree-S-Q-L" and it is **not** a separate thing from Postgres.

**Where each name appears in practice**

```bash
# Docker image uses the short name
docker pull postgres:16

# The server program uses the short name
postgres --version

# The command-line client is psql
psql --version

# Connection strings accept BOTH prefixes
postgresql://admin:secret123@localhost:5432/shop
postgres://admin:secret123@localhost:5432/shop
```

```sql
-- Check your version from inside the database
SELECT version();
-- Example output: PostgreSQL 16.x on x86_64-pc-linux-gnu ...
```

**Related terms people mix up**

| Term | What it really is |
|------|------------------|
| **SQL** | The query *language* (not a database) |
| **PostgreSQL / Postgres** | A database *software* that understands SQL |
| **psql** | The command-line *tool* to talk to PostgreSQL |
| **pgAdmin** | A free graphical *app* to manage PostgreSQL |
| **PostGIS** | An *extension* that adds map and location features to PostgreSQL |
| **MySQL, SQLite, SQL Server** | *Other* databases that also use SQL (different software, not Postgres) |

**Rule of thumb:** use "PostgreSQL" in formal writing and "Postgres" in everyday conversation. Everyone will understand both.

### 1.2 How to Write and Run Commands

Beginners often get stuck on one question: **"Where do I type this, and how do I write it?"** There are **three different places** to type commands, and mixing them up is the #1 beginner mistake.

#### The three "places" for commands

| # | Place | What you type there | How you know you're there |
|---|-------|--------------------|--------------------------|
| 1 | **Terminal** (your computer's command line) | `docker ...` commands | Prompt looks like `$`, `>`, or `C:\Users\you>` |
| 2 | **`psql`** (Postgres client) | `\dt`, `\l`, and SQL | Prompt looks like `shop=#` or `postgres=#` |
| 3 | **SQL editor** (DBeaver, pgAdmin, etc.) | SQL only | A query window with a "Run" button |

```
Terminal   ->   docker exec -it my-postgres psql -U admin -d shop   ->   psql prompt (shop=#)
 (docker commands)                                                        (SQL commands)
```

**Rule:** `docker ...` goes in the **terminal**. `SELECT ...` goes in **psql or an SQL editor**. If you type `SELECT * FROM users;` in the terminal, you'll get "command not found", because the terminal doesn't understand SQL.

#### Step 1: Open a terminal

| System | How to open |
|--------|-------------|
| **Windows** | Press `Win` key, type **PowerShell** (or **Windows Terminal**), press Enter |
| **Mac** | Press `Cmd + Space`, type **Terminal**, press Enter |
| **Linux** | Press `Ctrl + Alt + T` |

Then check Docker works:

```bash
docker --version
```

You should see something like `Docker version 27.x.x`. Press **Enter** after typing to run any command.

#### Step 2: Understand the shape of a Docker command

Almost every Docker command follows this pattern:

```
docker  <command>  [options]  <target>
```

Example, broken into pieces:

```bash
docker run -d --name my-postgres -p 5432:5432 postgres:16
#  |      |   |    |             |             |
#  |      |   |    |             |             +-- image to use (name:version)
#  |      |   |    |             +-- port mapping (your PC : container)
#  |      |   |    +-- give the container a name
#  |      |   +-- option: run in background
#  |      +-- command: create and start a container
#  +-- the program (Docker)
```

**Rules for writing commands:**

1. Commands are **case-sensitive** on Mac/Linux: `docker` works, `Docker` does not.
2. **Spaces matter.** `-p 5432:5432` has a space after `-p`. No spaces around the `:`.
3. **Options (flags) start with `-` or `--`.** Short form: `-d`. Long form: `--detach`.
4. Put **options before the image name**. Anything after the image name is passed to the program inside the container.
5. Use **quotes** if a value contains spaces: `-e "POSTGRES_PASSWORD=my secret"`.
6. Press **Enter** to run. Press **Ctrl + C** to stop a running command. Press the **Up arrow** to bring back the previous command.

#### Step 3: Writing long commands on multiple lines

Long commands are easier to read when split across lines. The "line continuation" character is **different per system**:

**Mac / Linux (bash or zsh): use `\` at the end of each line**
```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret123 \
  -p 5432:5432 \
  postgres:16
```

**Windows PowerShell: use the backtick `` ` ``**
```powershell
docker run -d `
  --name my-postgres `
  -e POSTGRES_USER=admin `
  -e POSTGRES_PASSWORD=secret123 `
  -p 5432:5432 `
  postgres:16
```

**Windows Command Prompt (cmd): use `^`**
```bat
docker run -d ^
  --name my-postgres ^
  -e POSTGRES_USER=admin ^
  -e POSTGRES_PASSWORD=secret123 ^
  -p 5432:5432 ^
  postgres:16
```

**Always works everywhere: write it on ONE line**
```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret123 -p 5432:5432 postgres:16
```

> **Tip:** The character after `\` (or `` ` ``) must be the **last thing on the line**. An accidental space after it breaks the command.

#### Step 4: Writing `psql` commands

There are **two kinds** of things you type once you're inside `psql`:

| Kind | Looks like | Ends with `;`? | Example |
|------|-----------|----------------|---------|
| **psql shortcut (meta-command)** | Starts with `\` | **No** | `\dt` |
| **SQL statement** | Starts with a word like `SELECT` | **Yes** | `SELECT * FROM users;` |

Enter psql from the terminal:

```bash
docker exec -it my-postgres psql -U admin -d shop
```

What this means:

```
docker exec -it   my-postgres   psql   -U admin   -d shop
   |       |          |          |        |          |
   |       |          |          |        |          +-- database name
   |       |          |          |        +-- user name
   |       |          |          +-- program to run inside the container
   |       |          +-- container name
   |       +-- interactive terminal
   +-- run a command inside a running container
```

Now you're at the `shop=#` prompt. Try:

```
shop=# \dt                       <- list tables (no semicolon)
shop=# SELECT * FROM users;      <- SQL (semicolon required)
shop=# \q                        <- quit back to terminal
```

**Run a single SQL command without entering psql** (use `-c`):
```bash
docker exec -it my-postgres psql -U admin -d shop -c "SELECT * FROM users;"
```

**Run a whole `.sql` file:**
```bash
cat script.sql | docker exec -i my-postgres psql -U admin -d shop
```

#### Step 5: Writing SQL correctly

SQL has its own writing rules:

1. **End every statement with a semicolon `;`**. If you forget, psql shows `shop-#` and waits for more. Type `;` and press Enter to finish.
2. **Keywords are not case-sensitive**: `SELECT` = `select`. By convention, we write keywords in UPPERCASE so they're easy to spot.
3. **Text values use single quotes**: `'Asha'`. Double quotes are for identifiers (table/column names), not text.
4. **Numbers don't need quotes**: `age = 25`.
5. **Line breaks and extra spaces are ignored**, so you can format freely.
6. **Comments**: `-- single line` or `/* multi-line */`.

**Reading a SQL statement piece by piece:**

```sql
SELECT name, email          -- WHAT columns I want
FROM users                  -- FROM which table
WHERE age > 24              -- ONLY rows that match this condition
ORDER BY name               -- sorted by this column
LIMIT 5;                    -- at most 5 rows
```

**Common SQL "templates" to copy and fill in:**

```sql
-- Add data
INSERT INTO table_name (column1, column2) VALUES ('value1', 'value2');

-- Read data
SELECT column1, column2 FROM table_name WHERE condition;

-- Change data
UPDATE table_name SET column1 = 'new value' WHERE condition;

-- Remove data
DELETE FROM table_name WHERE condition;

-- Create a table
CREATE TABLE table_name (
    id SERIAL PRIMARY KEY,
    column1 TEXT NOT NULL,
    column2 INT
);
```

#### Step 6: A complete walkthrough, start to finish

Follow these in order. Notice **where** each command is typed.

**1. In the TERMINAL: start Postgres**
```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret123 -e POSTGRES_DB=shop -p 5432:5432 postgres:16
```

**2. In the TERMINAL: confirm it's running**
```bash
docker ps
```

**3. In the TERMINAL: enter psql**
```bash
docker exec -it my-postgres psql -U admin -d shop
```
Your prompt changes to `shop=#`.

**4. In PSQL: create a table**
```sql
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, age INT);
```

**5. In PSQL: add data**
```sql
INSERT INTO users (name, age) VALUES ('Asha', 25), ('Ravi', 30);
```

**6. In PSQL: read it back**
```sql
SELECT * FROM users;
```

**7. In PSQL: leave**
```
\q
```
Your prompt returns to the normal terminal.

**8. In the TERMINAL: stop and clean up (optional)**
```bash
docker stop my-postgres
docker rm my-postgres
```

#### Getting help when you forget a command

```bash
docker --help               # list all Docker commands
docker run --help           # list all options for "run"
psql --help                 # psql options
```
Inside psql: type `\?` for psql shortcuts and `\h SELECT` for help on any SQL command.

#### Common "how to write it" mistakes

| Mistake | What happens | Fix |
|---------|-------------|-----|
| Typing SQL in the terminal | `command not found` | Enter `psql` first, or use an SQL editor |
| Typing `docker ...` inside psql | `syntax error` | Type `\q` to leave psql first |
| Forgetting `;` after SQL | Prompt changes to `shop-#` and waits | Type `;` and press Enter |
| Adding `;` after `\dt` | Usually harmless, but not needed | Meta-commands don't need it |
| Using double quotes for text: `"Asha"` | `column "Asha" does not exist` | Use single quotes: `'Asha'` |
| Pasting `\` multi-line commands on Windows PowerShell | `unexpected token` | Use `` ` `` instead, or one line |
| Space after `\` at line end | Command breaks | Remove trailing spaces |
| Copying commands with fancy "curly quotes" from a website | Strange errors | Retype the quotes with your keyboard |
| Typing the `$` or `shop=#` prompt | `command not found` | The prompt is shown for context. Don't type it |

### 1.3 Do I Need to Install Postgres Separately If I Have Docker?

**No.** If Docker is installed, you do **not** need to install PostgreSQL on your computer. Docker downloads and runs Postgres for you inside a container, so nothing is installed directly on your system.

#### What happens the first time you run Postgres

When you run this command:

```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret123 -e POSTGRES_DB=shop -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16
```

Docker checks whether the `postgres:16` image is on your computer. If not, you'll see:

```
Unable to find image 'postgres:16' locally
16: Pulling from library/postgres
...
Status: Downloaded newer image for postgres:16
```

That download **is** the Postgres "installation". After that, Docker starts the container and Postgres is running.

#### Checklist before you start

| Step | What to check | How |
|------|--------------|-----|
| 1 | Docker is installed | `docker --version` |
| 2 | Docker is **running** | Windows/Mac: open **Docker Desktop** and wait until it shows "running". Linux: `sudo systemctl status docker` |
| 3 | Internet is on (first time only) | Needed to download the image |
| 4 | Port 5432 is free | See the warning below |

If Docker isn't running, you'll get an error like `Cannot connect to the Docker daemon`. Start Docker Desktop and try again.

#### What you need vs. what is optional

| Item | Needed? | Notes |
|------|---------|-------|
| Docker | **Yes** | The only required install |
| PostgreSQL installer | **No** | Docker provides Postgres |
| `psql` on your computer | **No** | Use the one inside the container: `docker exec -it my-postgres psql -U admin -d shop` |
| GUI tool (DBeaver, pgAdmin, TablePlus) | Optional | Connect to `localhost:5432` if you prefer clicking over typing |
| Database driver in your code (`psycopg2`, `pg`, etc.) | Only if your app connects | Install it with your language's package manager |

#### Warning: Postgres already installed on your computer?

If you installed Postgres directly on your computer earlier, it may already use **port 5432**, and Docker will fail with `port is already allocated`. You have two options:

1. **Use a different port for Docker** (easiest). Change `-p 5432:5432` to `-p 5433:5432`, then connect to port **5433**.
2. **Stop the local Postgres service** so the port is free.

#### Spelling tip

| Correct | Wrong |
|---------|-------|
| **Postgres** | Postgress, Postgre |
| **PostgreSQL** | Postgresssql, PostgresSQL, Postgresql |

Search engines usually understand misspellings, but **commands, image names, and config files need the exact spelling**. For example, `docker pull postgres` works, but `docker pull postgress` fails with `repository does not exist`.

---

## 2. Part 1: Docker

### 2.1 The problem Docker solves

Imagine you build an app on your laptop. It works perfectly. You send it to a friend and they say:

> "It doesn't work on my computer!"

Why? Their computer might have a different operating system, a different version of Python or Node, or missing libraries. This is the famous **"it works on my machine"** problem.

**Docker fixes this** by packaging your app *together with everything it needs* into one box. That box runs the same everywhere.

### 2.2 Key concepts

#### Image
A **blueprint or recipe**. It is a read-only package that contains the app, its libraries, and its settings. It does nothing on its own.

#### Container
A **running instance** of an image. If an image is a recipe, a container is the actual cooked meal. You can start, stop, and delete containers.

> **Analogy:** Image = a cake recipe. Container = a cake baked from it. You can bake many cakes from one recipe.

#### Dockerfile
A text file with instructions for **building your own image**.

#### Docker Hub
An online library of ready-made images (like an app store). Postgres, Python, Node, Nginx and thousands more are there: https://hub.docker.com

#### Volume
A place to **store data outside the container**. Containers are temporary: when deleted, their data disappears. Volumes keep your data safe.

#### Network
A virtual connection that lets containers talk to each other.

### 2.3 Docker vs Virtual Machines

| | Virtual Machine | Docker Container |
|---|---|---|
| Includes a full OS? | Yes (heavy) | No, shares the host OS kernel (light) |
| Start time | Minutes | Seconds |
| Size | GBs | MBs |
| Isolation | Very strong | Good |

Containers are lighter and faster, which is why developers love them.

### 2.4 Installing Docker

- **Windows / Mac:** install **Docker Desktop** from https://www.docker.com/products/docker-desktop
- **Linux (Ubuntu example):**
  ```bash
  sudo apt update
  sudo apt install docker.io
  sudo systemctl enable --now docker
  ```

Check it works:

```bash
docker --version
docker run hello-world
```

If you see a "Hello from Docker!" message, you're ready.

### 2.5 Your first Docker commands

```bash
# Download an image
docker pull nginx

# Run a container from an image
docker run -d -p 8080:80 --name my-web nginx

# See running containers
docker ps

# See ALL containers (including stopped)
docker ps -a

# Stop a container
docker stop my-web

# Start it again
docker start my-web

# Delete a container
docker rm my-web

# List downloaded images
docker images

# Delete an image
docker rmi nginx

# See logs of a container
docker logs my-web

# Open a terminal inside a running container
docker exec -it my-web bash
```

**Understanding the `docker run` flags:**

| Flag | Meaning |
|------|---------|
| `-d` | Run in the background ("detached") |
| `-p 8080:80` | Map **your computer's port 8080** to the **container's port 80** |
| `--name my-web` | Give the container a friendly name |
| `-e KEY=value` | Set an environment variable |
| `-v name:/path` | Attach a volume |
| `--rm` | Auto-delete container when it stops |
| `-it` | Interactive terminal |

After running the nginx example, open http://localhost:8080 in your browser. You'll see the Nginx welcome page. You just ran a web server without installing it.

### 2.6 A simple Dockerfile example

Say you have a tiny Python app `app.py`:

```dockerfile
# Start from an existing image that has Python
FROM python:3.12-slim

# Set the working folder inside the container
WORKDIR /app

# Copy your files into the container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Command to run when the container starts
CMD ["python", "app.py"]
```

Build and run it:

```bash
docker build -t my-python-app .
docker run my-python-app
```

---

## 3. Part 2: Databases, SQL, and PostgreSQL

### 3.1 What is a database?

A **database** stores data so you can find, add, change, and delete it quickly and safely. Almost every app uses one: social media posts, online shop orders, bank accounts, and so on.

### 3.2 Relational databases

PostgreSQL is a **relational database**. Data is stored in **tables**, like spreadsheets.

**Table: `users`**

| id | name | email | age |
|----|------|-------|-----|
| 1 | Asha | asha@example.com | 25 |
| 2 | Ravi | ravi@example.com | 30 |
| 3 | Meera | meera@example.com | 22 |

- **Table** = a collection of similar data (users, orders, products)
- **Row** (record) = one item (one user)
- **Column** (field) = one property (name, email, age)
- **Primary key** = a unique ID for each row (like `id`)
- **Foreign key** = a link from one table to another

**Example of a relationship:**

**Table: `orders`**

| id | user_id | product | price |
|----|---------|---------|-------|
| 1 | 1 | Laptop | 800 |
| 2 | 1 | Mouse | 20 |
| 3 | 2 | Keyboard | 50 |

`user_id` points to `users.id`. This tells us Asha (id 1) bought a Laptop and a Mouse.

### 3.3 What is SQL?

**SQL** (Structured Query Language, pronounced "S-Q-L" or "sequel") is the language you use to talk to relational databases. MySQL, SQL Server, SQLite, and PostgreSQL all use SQL (with small differences).

> **SQL is the language. PostgreSQL is the software that understands it.**

### 3.4 What is PostgreSQL?

PostgreSQL is a **free, open-source, very powerful relational database** (first released in 1996). It's known for:

- **Reliability**: your data stays safe and correct
- **ACID compliance**: transactions either fully succeed or fully fail
- **Rich features**: JSON support, full-text search, extensions (like PostGIS for maps)
- **Standards-friendly**: follows SQL standards closely
- **Huge community**, and it's free

**What is ACID?**

| Letter | Meaning | Simple idea |
|--------|---------|-------------|
| **A**tomicity | All or nothing | A bank transfer either completes both steps or neither |
| **C**onsistency | Data follows the rules | You can't have an order for a user that doesn't exist |
| **I**solation | Users don't interfere | Two people editing at once don't corrupt data |
| **D**urability | Saved means saved | Even if power fails, committed data stays |

### 3.5 Essential SQL, step by step

#### Create a database
```sql
CREATE DATABASE shop;
```

#### Create a table
```sql
CREATE TABLE users (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age   INT
);
```

- `SERIAL` = auto-increasing number (1, 2, 3...)
- `PRIMARY KEY` = unique identifier
- `NOT NULL` = value is required
- `UNIQUE` = no duplicates allowed

#### Common data types

| Type | Used for | Example |
|------|----------|---------|
| `INT` | Whole numbers | 42 |
| `NUMERIC(10,2)` | Exact decimals (money) | 19.99 |
| `VARCHAR(n)` / `TEXT` | Text | 'Hello' |
| `BOOLEAN` | True / false | true |
| `DATE` | Date | '2026-10-29' |
| `TIMESTAMP` | Date and time | '2026-10-29 14:30:00' |
| `JSONB` | JSON data | '{"a": 1}' |

#### CRUD: the four basic operations

**C: Create (INSERT)**
```sql
INSERT INTO users (name, email, age)
VALUES ('Asha', 'asha@example.com', 25);

INSERT INTO users (name, email, age) VALUES
    ('Ravi', 'ravi@example.com', 30),
    ('Meera', 'meera@example.com', 22);
```

**R: Read (SELECT)**
```sql
-- Everything
SELECT * FROM users;

-- Specific columns
SELECT name, email FROM users;

-- With a condition
SELECT * FROM users WHERE age > 24;

-- Sorting
SELECT * FROM users ORDER BY age DESC;

-- Limit results
SELECT * FROM users LIMIT 2;

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'A%';
```

**U: Update**
```sql
UPDATE users
SET age = 26
WHERE name = 'Asha';
```

**D: Delete**
```sql
DELETE FROM users WHERE id = 3;
```

> **WARNING:** Always use `WHERE` with `UPDATE` and `DELETE`. Without it, you change or delete **every row**!

#### Aggregates and grouping
```sql
SELECT COUNT(*)  FROM users;            -- how many users
SELECT AVG(age)  FROM users;            -- average age
SELECT MAX(age)  FROM users;            -- oldest

-- Total spent per user
SELECT user_id, SUM(price) AS total_spent
FROM orders
GROUP BY user_id;
```

#### JOINs: combining tables
```sql
SELECT users.name, orders.product, orders.price
FROM users
JOIN orders ON users.id = orders.user_id;
```

Result:

| name | product | price |
|------|---------|-------|
| Asha | Laptop | 800 |
| Asha | Mouse | 20 |
| Ravi | Keyboard | 50 |

Join types in one line each:
- `INNER JOIN` (or `JOIN`): only rows that match in both tables
- `LEFT JOIN`: all rows from the left table, matches from the right (or NULL)
- `RIGHT JOIN`: the reverse of LEFT
- `FULL JOIN`: everything from both

#### Foreign keys
```sql
CREATE TABLE orders (
    id      SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    product VARCHAR(100),
    price   NUMERIC(10,2)
);
```

#### Indexes (make searches faster)
```sql
CREATE INDEX idx_users_email ON users(email);
```
Think of an index like the index at the back of a book: it helps the database find things without reading every page.

#### Transactions
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- save both changes
-- or ROLLBACK; to undo everything
```

### 3.6 The `psql` command-line tool

`psql` is Postgres's built-in terminal client. Handy commands (these start with a backslash and are **not** SQL):

| Command | What it does |
|---------|--------------|
| `\l` | List databases |
| `\c dbname` | Connect to a database |
| `\dt` | List tables |
| `\d tablename` | Describe a table |
| `\du` | List users/roles |
| `\x` | Toggle expanded output |
| `\q` | Quit |

---

## 4. Part 3: Using Docker + PostgreSQL Together

### 4.1 Why run Postgres in Docker?

- No messy installation on your computer
- Pick any version in seconds
- Delete and recreate it any time for a clean slate
- Everyone on your team gets the **exact same setup**
- Run several Postgres versions side by side

### 4.2 Run your first Postgres container

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=shop \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

(On Windows PowerShell, put it on one line or replace `\` with a backtick `` ` ``.)

**What each part means:**

| Part | Meaning |
|------|---------|
| `-d` | Run in the background |
| `--name my-postgres` | Container name |
| `-e POSTGRES_USER=admin` | Create a database user called `admin` |
| `-e POSTGRES_PASSWORD=secret123` | Set its password (**required**) |
| `-e POSTGRES_DB=shop` | Create a database called `shop` |
| `-p 5432:5432` | Postgres's default port, exposed on your computer |
| `-v pgdata:/var/lib/postgresql/data` | Store data in a volume called `pgdata` so it **survives** container deletion |
| `postgres:16` | Image name and version (tag) |

Check it's running:
```bash
docker ps
docker logs my-postgres
```
Look for: `database system is ready to accept connections`.

### 4.3 Connect to it

**Option A: from inside the container**
```bash
docker exec -it my-postgres psql -U admin -d shop
```
You'll see a prompt like `shop=#`. Try:
```sql
CREATE TABLE hello (id SERIAL PRIMARY KEY, msg TEXT);
INSERT INTO hello (msg) VALUES ('Hi from Docker!');
SELECT * FROM hello;
\q
```

**Option B: from your computer using a GUI tool**

Free tools: **DBeaver**, **pgAdmin**, **TablePlus**, **VS Code SQL extensions**.

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `shop` |
| User | `admin` |
| Password | `secret123` |

**Option C: from your code (connection string)**
```
postgresql://admin:secret123@localhost:5432/shop
```

Python example:
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost", port=5432,
    dbname="shop", user="admin", password="secret123"
)
cur = conn.cursor()
cur.execute("SELECT * FROM hello;")
print(cur.fetchall())
conn.close()
```

Node.js example:
```js
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://admin:secret123@localhost:5432/shop'
});
await client.connect();
const res = await client.query('SELECT * FROM hello');
console.log(res.rows);
await client.end();
```

### 4.4 Why volumes matter (data persistence)

Try this experiment:

```bash
docker stop my-postgres
docker rm my-postgres          # container deleted!

# Re-run the same docker run command from 4.2 ...
docker exec -it my-postgres psql -U admin -d shop -c "SELECT * FROM hello;"
```

Your data is **still there**, because it lives in the `pgdata` volume, not inside the container. Without `-v`, it would be gone.

Manage volumes:
```bash
docker volume ls
docker volume rm pgdata        # permanently deletes data!
```

### 4.5 Backups and restores

```bash
# Backup (dump to a file on your computer)
docker exec my-postgres pg_dump -U admin shop > backup.sql

# Restore
cat backup.sql | docker exec -i my-postgres psql -U admin -d shop
```

---

## 5. Docker Compose (the easy way)

Typing long `docker run` commands is annoying. **Docker Compose** lets you describe everything in one file (`docker-compose.yml`) and start it with one command.

### 5.1 Postgres only

Create `docker-compose.yml`:

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

Run it:
```bash
docker compose up -d      # start
docker compose logs -f    # watch logs
docker compose down       # stop and remove containers (data kept)
docker compose down -v    # ...and ALSO delete volumes (data lost!)
```

### 5.2 Postgres + pgAdmin (web UI) + your app

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: shop
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d shop"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - db

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://admin:secret123@db:5432/shop
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

**Key idea:** Inside Compose, containers talk to each other **by service name**. Your app connects to host `db` (not `localhost`). Open pgAdmin at http://localhost:5050 and add a server with host `db`.

### 5.3 Auto-run SQL on first start

Any `.sql` file placed in `/docker-entrypoint-initdb.d/` runs automatically the **first time** the database is created:

```yaml
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

### 5.4 Using a `.env` file (don't hardcode passwords)

`.env`:
```
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
POSTGRES_DB=shop
```

`docker-compose.yml`:
```yaml
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```

**Add `.env` to `.gitignore`** so passwords never go to GitHub.

---

## 6. Common Mistakes & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `Error: Database is uninitialized and superuser password is not specified` | Missing `POSTGRES_PASSWORD` | Add `-e POSTGRES_PASSWORD=...` |
| `port is already allocated` / `address already in use` | Another Postgres (or app) uses port 5432 | Use `-p 5433:5432` and connect to port 5433 |
| Data disappeared | No volume used, or ran `down -v` | Always mount a volume; avoid `-v` on `down` |
| Changed `POSTGRES_PASSWORD` but old one still works | Env vars only apply on **first** initialization | Delete the volume (loses data) or change it with `ALTER USER admin PASSWORD 'new';` |
| App can't connect using `localhost` inside Docker | `localhost` inside a container means *itself* | Use the service name (`db`) |
| `connection refused` right after start | Postgres not ready yet | Use `healthcheck` + `depends_on`, or retry |
| `FATAL: role "x" does not exist` | Wrong username | Check `POSTGRES_USER` |
| `permission denied` on docker (Linux) | User not in docker group | `sudo usermod -aG docker $USER`, then log out and back in |

---

## 7. Cheat Sheets

### Docker

```bash
docker ps                      # running containers
docker ps -a                   # all containers
docker images                  # images
docker pull <image>            # download image
docker run <image>             # create + start container
docker stop <name>             # stop
docker start <name>            # start
docker restart <name>
docker rm <name>               # remove container
docker rmi <image>             # remove image
docker logs -f <name>          # follow logs
docker exec -it <name> bash    # shell inside container
docker volume ls               # list volumes
docker network ls              # list networks
docker system prune            # clean unused stuff (careful!)
docker compose up -d           # start compose project
docker compose down            # stop compose project
```

### SQL

```sql
-- Structure
CREATE TABLE t (...);       DROP TABLE t;
ALTER TABLE t ADD COLUMN c INT;
CREATE INDEX i ON t(c);

-- Data
INSERT INTO t (a,b) VALUES (1,'x');
SELECT * FROM t WHERE a = 1 ORDER BY b LIMIT 10;
UPDATE t SET b = 'y' WHERE a = 1;
DELETE FROM t WHERE a = 1;

-- Combine & summarize
SELECT ... FROM a JOIN b ON a.id = b.a_id;
SELECT col, COUNT(*) FROM t GROUP BY col HAVING COUNT(*) > 1;
```

### psql

```
\l   \c db   \dt   \d table   \du   \x   \q
```

---

## 8. What to Learn Next

**Beginner practice ideas**
1. Run Postgres in Docker and create a `students` + `courses` database with a join
2. Write a small script (Python/Node) that inserts and reads rows
3. Put your app and Postgres together with Docker Compose

**Next topics**
- SQL: subqueries, window functions, views, CTEs (`WITH`)
- Postgres: constraints, triggers, `JSONB`, full-text search, `EXPLAIN` (performance)
- Security: roles and permissions, never exposing port 5432 to the public internet
- Docker: multi-stage builds, networks, `.dockerignore`, image size optimization
- ORMs: SQLAlchemy (Python), Prisma / Sequelize (Node), Hibernate (Java)
- Migrations: Alembic, Flyway, Prisma Migrate
- Production: backups, monitoring, managed services (AWS RDS, Supabase, Neon)

**Good resources**
- Docker official docs: https://docs.docker.com/get-started/
- PostgreSQL official docs: https://www.postgresql.org/docs/
- Practice SQL online: https://pgexercises.com
- Docker Hub Postgres page: https://hub.docker.com/_/postgres

---

### Quick Summary

- **Docker** = packages apps in portable containers that run the same everywhere.
- **SQL** = the language for working with relational data.
- **PostgreSQL (Postgres)** = a powerful free database that understands SQL.
- **Together** = run Postgres in a Docker container with a **volume** for persistent data, manage it with **Docker Compose**, and connect from your app using a connection string.

Happy learning!
