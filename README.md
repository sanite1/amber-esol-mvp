# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Accessibility

The platform serves adult ESOL learners — many on older devices, with visual / motor / literacy challenges. Accessibility is non-negotiable and gated on WCAG 2.1 AA.

The full agreed standard lives in [`docs/WCAG_REQUIREMENTS.md`](../amber-esol-backend/docs/WCAG_REQUIREMENTS.md) in the backend repo — colour contrast ratios, ARIA patterns, keyboard navigation, 44×44 touch targets, font-size toggle, dynamic `<html lang>`, RTL support for Arabic / Dari / Pashto.

### In-app development checks — `@axe-core/react`

The frontend is wired with [`@axe-core/react`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) which runs an automated WCAG audit against the live DOM after every render and prints any violations to the browser console.

- **Active only when `NODE_ENV === "development"`.** Production bundles never ship the analyser.
- Wired in [`src/index.tsx`](src/index.tsx) via a dynamic `import("@axe-core/react")` so the analyser doesn't enter the production chunk graph at all.
- 1-second debounce — router transitions don't fire a scan per render.

When you run `npm start` and open DevTools, accessibility violations appear as grouped console messages with:

- The offending DOM node (clickable in the Elements panel)
- The WCAG rule (e.g. `color-contrast`, `label`, `button-name`)
- A direct deque.com link explaining how to fix it

### Required browser extension — axe DevTools

The in-app check is fast-feedback; it is **not** a substitute for the full audit. Install the browser extension before working on any learner-facing screen:

- Chrome / Edge: <https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd>
- Firefox: <https://addons.mozilla.org/en-GB/firefox/addon/axe-devtools/>

Run the extension on the rendered screen, copy the report, attach it to the PR.

### Definition of Done — every learner-facing PR

A PR that introduces or significantly changes a learner-facing screen MUST include in the description:

- [ ] Screenshot of axe DevTools showing **zero critical** and **zero serious** violations on the new/changed screen
- [ ] Confirmation that the screen was navigated with keyboard only (Tab / Shift+Tab / Enter / Space / Escape)
- [ ] Confirmation that touch targets are ≥ 44×44 px
- [ ] For screens that render in `ar` / `fa-AF` / `ps`: confirmation that RTL layout was verified (toggle `document.documentElement.dir = "rtl"` in the console)

Reviewers should reject PRs that don't include the axe screenshot. The checklist isn't bureaucratic — retrofitting accessibility is significantly more expensive than catching it at review.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
