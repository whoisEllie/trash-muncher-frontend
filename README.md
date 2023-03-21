# Trash Munchers Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contents

- [Backend](https://github.com/whoisEllie/trash-muncher-frontend#backend)

- [Deployment](https://github.com/whoisEllie/trash-muncher-frontend#deployement)

- [Contributors](https://github.com/whoisEllie/trash-muncher-frontend/tree/malik-readme#contributors-computer)


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

## Contributors :computer: 

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/KermityOwen"><img src="https://avatars.githubusercontent.com/u/47197696?v=4" width="100px;" alt="Owen Lee"/><br /><sub><b>Owen Lee</b></sub></a></td>
      <td align="center"><a href="https://github.com/whoisEllie"><img src="https://avatars.githubusercontent.com/u/37041249?v=4" width="100px;" alt="Ellie Kelemen"/><br /><sub><b>Ellie Kelemen</b></sub></a></td>
      <td align="center"><a href="https://github.com/TerraTree"><img src="https://avatars.githubusercontent.com/u/22399437?v=4" width="100px;" alt="William Liversidge"/><br /><sub><b>William Liversidge</b></sub></a></td>
      <td align="center"><a href="https://github.com/vigneshmohan2002"><img src="https://avatars.githubusercontent.com/u/85409344?v=4" width="100px;" alt="Vignesh Mohanarajan"/><br /><sub><b>Vignesh Mohanarajan</b></sub></a></td>
      <td align="center"><a href="https://github.com/scarlettp1619"><img src="https://avatars.githubusercontent.com/u/95775118?v=4" width="100px;" alt="Scarlett Parker"/><br /><sub><b>Scarlett Parker</b></sub></a></td>
      <td align="center"><a href="https://github.com/FBWWTeto"><img src="https://avatars.githubusercontent.com/u/93519490?v=4" width="100px;" alt="Malik Besta"/><br /><sub><b>Malik Besta</b></sub></a></td>
      </tr>
  </tbody>
</table>
