# readme_writer

allows you to write READMEs for your GitHub projects simply and quickly

## Installation

To set up the `readme_writer` project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://https://github.com/LeoLaborie/readme_writer.git
    cd readme_writer
    ```

2.  **Install dependencies:**
    Use npm to install the required packages.
    ```bash
    npm install
    ```

## Usage

After installation, you can run the development server or build the project for production.

1.  **Run the development server:**
    To start the application in development mode with hot-reloading:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

2.  **Build for production:**
    To create an optimized production build:
    ```bash
    npm run build
    ```

3.  **Start the production server:**
    After building, start the production server:
    ```bash
    npm run start
    ```

4.  **Lint the codebase:**
    To check for code quality and style issues:
    ```bash
    npm run lint
    ```

## Features

Based on the detected dependencies and project structure, this project includes the following capabilities:

*   **AI Integration:** Utilizes `@google/generative-ai` for generative AI functionalities.
*   **Markdown Rendering:** Supports rendering of Markdown content, including GitHub Flavored Markdown (GFM), via `react-markdown` and `remark-gfm`.
*   **Modern Web Application:** Developed as a Next.js and React application for a contemporary web experience.
*   **Styling:** Implements Tailwind CSS for utility-first styling.

## Tech Stack

The `readme_writer` project is built using the following technologies:

*   **Languages:** TypeScript
*   **Frameworks:** Next.js, React, Tailwind CSS
*   **Tools:** ESLint
*   **Package Manager:** npm

## Configuration

The project utilizes several configuration files for various aspects of its operation:

*   **`next.config.ts`**: Configures Next.js specific options.
*   **`tsconfig.json`**: Defines TypeScript compiler options.
*   **`postcss.config.mjs`**: Configures PostCSS for CSS processing, typically used by Tailwind CSS.
*   **`eslint.config.mjs`**: Specifies ESLint rules for code linting.
*   **`.gitignore`**: Lists files and directories to be ignored by Git.


---

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/badge/Package%20Manager-npm-red.svg)](https://www.npmjs.com/)