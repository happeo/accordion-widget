# Happeo Accordion Widget App

## About The Project

The Accordion widget enables page editors to add an accordion to Happeo pages.

The Accordion Widget is a Happeo App and is built using the Widget SDK.

### Built With

- [Happeo](https://app.happeo.com/)
- [Happeo WidgetSDK](https://www.npmjs.com/package/@happeo/widget-sdk)

## Getting Started

### Prerequisites

Happeo Admin access rights

Tools

- npm
  ```
  npm install npm@latest -g
  ```
- node version >16
  ```
  node -v
  ```

### Installation

#### Prerequisite

You have created a Custom app in Happeo admin and slug is copied to clipboard.

#### In development mode

1. Clone the repo
2. Replace slug in index.js with the clipboard version
3. Install NPM packages
   ```
   npm install
   ```
4. Start widget
   ```
   npm run start
   ```
5. Open Happeo
6. Goto pages and edit or create page
7. Add Accordion widget
8. Start editing and adding content.

#### In testing or Published mode

1. Clone the repo
2. Replace slug in index.js with the clipboard version
3. Install NPM packages
   ```
   npm install
   ```
4. Build widget
   ```
   npm run build
   ```
5. Open Happeo admin and upload bundle to your app.

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
