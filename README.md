# To-Do App

A simple CRUD to-do app built with HTML, CSS, and JavaScript.

## Features
- Add a new task
- View all tasks
- Edit an existing task
- Delete a task
- Mark a task as complete
- Tasks are stored in localStorage

## Run locally

Open the app directly in a browser, or run a local static server:

```bash
cd /Users/shaikjabeerbasha/Desktop/CRUD\ App
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Run Playwright tests

```bash
cd /Users/shaikjabeerbasha/Desktop/CRUD\ App
npm test
```

## Notes
- The app uses browser localStorage instead of a backend database.
- The Playwright suite covers the main user flows for CRUD behavior and validation.
