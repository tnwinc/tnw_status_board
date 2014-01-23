## Pivotal Status Board

A read-only client for Pivotal Tracker optimized for use on a status board.

### Contributing

Prerequisites:

* npm

Run:

```
npm install -g gulp
npm install
npm start
```

`npm start` will run a task that watches CoffeeScript, SCSS, and Handlebars(.hbs) files and compiles them when you change one. Currently, if you add a new file, you have to restart the watch (`ctrl+C` then run `npm start` again). `npm start` also runs a server on port 4567, so you can view the app at http://localhost:4567.
