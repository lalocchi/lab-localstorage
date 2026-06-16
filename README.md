# Lab: Keep Me Logged In

<img src="./public/main.png" width=600 />

## Introduction on how to run
# 1. Navigate to the backend directory
cd back

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 1. Navigate to the frontend directory
cd front

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev



You just shipped a tiny app with three screens: a sign up page, a login page, and
a home page that only logged in people should see. The backend is already written
and running: it can create users and, when someone logs in with the right
password, it hands back a **JWT** (a JSON Web Token, basically a signed "this
person is who they say they are" badge).

There is one problem. The frontend throws that badge away. You log in, the server
sends you a perfectly good token, and the browser forgets it the moment the page
changes. So the home page has no idea who you are.

This lab is about a skill you will use on basically every app with a login screen:
**storing a token in the browser's `localStorage` and using it to keep someone
logged in.** That is the whole game. Get the token, stash it, read it back later.

## The situation

> The auth API is done, I wrote it myself, do not touch the `back/` folder. What
> I need from you is the browser side. Right now the forms are pretty boxes that
> do nothing. Make them actually talk to the API. Sign up should create the user
> and send them over to log in. Login should get the token and, this is the part
> I actually care about, **keep that token around so the home page knows the
> person is logged in even after the page reloads.** The token is your
> responsibility now, not mine.

That last sentence is the heart of this lab. The server gives you the token once.
What happens to it after that is entirely up to your frontend.

## The API

The backend lives in the `back/` folder and runs on **http://localhost:5005**.
You do not need to change anything in there. You just call it. Two endpoints:

**`POST /signup`**, creates a user. Does *not* log them in, does *not* return a
token.

```
Request body:   { "email": "ana@example.com", "password": "1234" }
Success (201):  { "message": "User created. You can log in now." }
Email taken (409): { "message": "That email is already registered." }
```

**`POST /login`**, checks the credentials and, if they are good, returns a token.

```
Request body:   { "email": "ana@example.com", "password": "1234" }
Success (200):  { "token": "eyJhbGciOiJ..." }
Bad login (401): { "message": "Invalid email or password." }
```

⚠️ The "database" is just an array in memory. Every time you restart the backend
it forgets all users, so if login suddenly fails, you probably just need to sign
up again.

Before you write a single line of React, **poke these endpoints by hand** (Postman,
Thunder Client, `curl`, whatever you like). Sign up a user, then log in, and look
at the token that comes back. You can paste it into [jwt.io](https://jwt.io) to
see what is inside. Knowing exactly what the API expects and returns will save you
a lot of guessing later.

## What you will build

- A working **sign up** form that creates a user, then sends them to login.
- A working **login** form that gets the token and saves it.
- A **home** page that reads the saved token, greets the user, and lets them log
  out. If there is no token, it should not let them in.

## Getting started

You have two apps to run, so you need **two terminals**.

Terminal 1, the backend:

```bash
cd back
npm install
npm run dev
```

You should see `Auth API listening on http://localhost:5005`.

Terminal 2, the frontend:

```bash
cd front
npm install
npm run dev
```

Open http://localhost:3000. You will see the home page, but it is fake: it greets
everyone and the Log out button does nothing. Visit `/login` and `/signup` and you
will find forms that look fine but do not work yet, you can type, but submitting
goes nowhere. That is expected. That is your job.

## Your job

Work in this order. Get one thing fully working before moving to the next.

### 1. Talk to the API by hand first

Do the Postman / curl round trip described in **The API** above. Confirm you can
sign up and log in and that you have seen the shape of the token. Don't skip this.

### 2. Make sign up work, `front/app/signup/page.js`

Give each input some state so the form remembers what the user types. On submit,
send a `POST` to `http://localhost:5005/signup` with the email and password as
JSON. If it works, send the user to `/login` and make sure they get a little
"account created, now log in" message when they land there. If the email is
already taken (status `409`), show the message the server sent.

### 3. Make login work and **store the token**, `front/app/login/page.js`

Same idea: state for the inputs, `POST` to `http://localhost:5005/login`. When the
server answers with a token, **this is the key moment of the whole lab**: save that
token in `localStorage`. Then redirect to the home page (`/`). If the login is bad
(status `401`), show the error instead.

### 4. Guard the home page and add logout, `front/app/page.js`

When the home page loads, look in `localStorage` for the token. No token? This
person is not logged in, send them to `/login`. Token present? Greet them and show
the Log out button, which should remove the token from `localStorage` and bounce
them back to `/login`.

Remember: `localStorage` does not exist on the server. You will need to read it in
the browser, *after* the page mounts. Think about the directive and the hook that
make that possible.

## 💡 Think about it

- **Where does this token actually live?** `localStorage` is per-browser, per-origin
  storage that survives reloads and even closing the tab. Open your browser dev
  tools, go to the Application (or Storage) tab, and watch your token appear there
  when you log in and disappear when you log out. Seeing it makes it real.
- **The first-render problem.** Your home page renders on the server first, where
  `localStorage` is `undefined`. If you try to read it too early you will crash or
  get a hydration mismatch. That is *why* the token check has to happen in a client
  effect, not during the initial render.
- **Is `localStorage` even a good place for a token?** It is convenient, which is
  why we are using it here, but it is readable by any JavaScript on the page, so a
  cross site scripting (XSS) bug can steal it. Real apps often store tokens in
  HttpOnly cookies for exactly this reason. You do not have to fix that today, but
  you should be able to say out loud what the trade-off is.

## How to work through this

1. Read the auth lesson in the students portal first.
2. Hit the API by hand until you fully understand what it wants and what it gives back.
3. Build sign up, end to end, before touching login.
4. Build login and get the token saved into `localStorage` (check dev tools).
5. Only then wire up the home page guard and logout.

## Styling

Use Tailwind. The forms already have basic classes, you can leave them or make
them yours. Don't spend the lab on CSS.

## Checklist before you call it done

✅ Signing up creates the user and sends you to the login page.
✅ After signing up, a message tells you the account was created.
✅ A wrong sign up (email already taken) shows the server's error message.
✅ Logging in with the right password saves the token in `localStorage`.
✅ You can see the token in dev tools under Application → Local Storage.
✅ A wrong login shows an error and does NOT save a token.
✅ After login you land on the home page and it greets you.
✅ Visiting the home page with no token sends you to `/login`.
✅ Log out removes the token and sends you back to `/login`.
✅ No errors in the browser console.

## If you finish early

- Protect a backend route. Add a `GET /profile` endpoint in `back/index.js` that
  only answers if you send the token in an `Authorization: Bearer <token>` header,
  then call it from the home page and show the logged in email.
- Handle an expired token gracefully (the token from this API expires after an
  hour).
- Decode the token in the browser to show the user's email without another request.
- Make the error and success messages look nice instead of plain text.

## Key concepts to review

- [`useState`](https://react.dev/reference/react/useState), remembering input values.
- [`useEffect`](https://react.dev/reference/react/useEffect), running code after the page mounts (where you read `localStorage`).
- [`'use client'`](https://nextjs.org/docs/app/api-reference/directives/use-client), opting a component into the browser.
- [`useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router), redirecting in code.
- [`Window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), the storage you are using.
- [jwt.io](https://jwt.io), see what is inside a JWT.

## Delivering the lab

Work in your assigned groups. Everyone opens a Pull Request and shares the link in
the students portal. Make sure your README in the PR says how to run both the
backend and the frontend.
