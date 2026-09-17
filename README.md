# SPECTRA

SPECTRA is an interactive eyewear configurator. Users can view and rotate a 3D glasses model, change frame and lens colours, choose a size, select attachments, reset the configuration, and generate a random configuration with the shuffle button. 

Created as a Yrgo group project designed by Digital Designers Ellinor K. Lek, Nichapa Wangchanajai (Punch), and Iryna Voitsikhovska. Models and video/audio were created by Computer Graphic Designers David Ludewig and Kristofer Mårdstedt. Coded by web developers Wilma Reistad and Emma Backman.

## Tech Stack

- React
- Vite
- Three.js
- React Three Fiber
- Drei
- CSS Modules

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL shown by Vite.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Main Features

- Interactive Three.js glasses model with orbit controls
- Camera focus changes based on the selected attachment
- Frame colour, lens colour, and size selection
- Attachment selection with dynamic pricing
- Reset configuration button
- Shuffle button for random colours, lens options, and attachments
- Optional intro video that can be enabled or disabled in `src/App.jsx`
- Loading indicator while the 3D model is loading
- Responsive layout with a mobile-specific configurator scroll area
- The intro video starts muted; click once to enable sound.

## Project Structure

```text
src/
	App.jsx                         Main application state and layout
	App.css                         Global styles and design tokens
	App.module.css                  Application layout and shared UI styling
	components/
		Scene.jsx                     Three.js canvas, camera, lights, and controls
		Model.jsx                     GLB loading, materials, and model presentation
		useModelAttachments.js        Attachment visibility and animation logic
		ConfiguratorPanel/            Colour, lens, size, attachment, and price UI

public/
	assets/                         Logos, icons, background, and intro video
	*.glb                           3D model files
	*.png                           Attachment and lens images
```

## Assets

Static assets in `public` are referenced from the site root. For example:

```jsx
<video src="/assets/spectra_header_vid_01.mov" />
```

The main 3D model is loaded from `public`, while attachment and colour data is defined in the configurator data files under `src/components/ConfiguratorPanel`.

## Development Notes

The main configuration state lives in `App.jsx` and is passed to both the configurator panel and the 3D scene. Keep new configuration options in this shared state so panel controls, model materials, attachments, pricing, reset, and shuffle remain synchronised.
