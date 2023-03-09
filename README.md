# Trash Munchers Frontend

Hi! Welcome to the frontend for Trash Munchers, an interactive game about saving the planet by feeding trash-munching monsters.

You're currently looking at the frontend of the project, which is built with [SvelteKit](https://kit.svelte.dev/).

The folder structure looks as follows:

- `node_modules` holds any installed modules
- `src` holds the source code
- `static` holds any static files, such as images or 3d assets used in the project

Within `src`,  you'll find the following:

- `lib`, which holds components and helper functions used in the app
- `routes`, which holds all the pages. SvelteKit uses file system routing, so the URL of any given page will correspond to it's file path from the `routes` directory. E.g. the path `./about` will be found at [trashmunchers.co.uk/about](https://www.trashmunchers.co.uk/about), `./gamekeeper/image-approve` will be found at [trashmunchers.co.uk/gamekeeper/image-approve](https://www.trashmunchers.co.uk/gamekeeper/image-approve), etc. For a path to be a valid page on the website, it **must**include a valid `+page.svelte` file. Additional logic is implemented in `page.ts` and `page.server.ts` files, which run client-side and server-side respectfully. 

# Backend

The backend for the project is handled by a RESTful API written in Django, and you can find it [here](https://github.com/KermityOwen/Trash-Muncher-Webapp).

# Deployement

This github repository is hooked up to a Vercel server, which automatically stays up to date with the main branch. It deploys to [trashmunchers.co.uk](https://trashmunchers.co.uk). 

## Developing

For development, it is recommended to run a local server to see your changes in real-time. To do so, clone the repository with `git clone https://github.com/whoisEllie/trash-muncher-frontend.git`, then create a new branch to work in with `git checkout -b yourfirstname/feature-being-worked-on`. 

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Manual building is not necessary thanks to Vercel, but should you wish to build a version of the app for deployement, you can follow the instructions below:

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
