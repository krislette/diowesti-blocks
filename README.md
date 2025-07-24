<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/krislette/diowesti-blocks">
    <img src="public/blocks.png" alt="Logo" width="80" height="80">
  </a>
  
  <h1 align="center">Blocks</h1>
  <p align="center">
    Reusable React Components for Internal Audit Information Management System
    <br />
    <a href="#demo">View Demo</a>
    ·
    <a href="https://github.com/krislette/diowesti-blocks/issues">Report Bug</a>
    ·
    <a href="https://github.com/krislette/diowesti-blocks/pulls">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

> This project is a collection of 8 reusable React components I designed for the Internal Audit Information Management System of DOST. The components follow DOST's design system while incorporating my personal modern UI/UX enhancements and additional features. The library includes a complete dashboard, login, and registration system to demonstrate the components in action at the very least. Why blocks you might ask? I treated the components as building blocks... plus it is also a good baseline for my logo idea!

<!-- TABLE OF CONTENTS -->
### Table Of Contents
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#table-of-contents">Table Of Contents</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#technologies-used">Technologies Used</a></li>
    </ul>
  </li>
  <li>
    <a href="#web-snapshots">Web Snapshots</a>
  </li>
  <li>
    <a href="#folder-structure">Folder Structure</a>
  </li>
  <li>
    <a href="#installation">Installation</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#cloning-the-repository">Cloning the Repository</a></li>
      <li><a href="#environment-setup">Environment Setup</a></li>
    </ul>
  </li>
  <li>
    <a href="#run">Run</a>
  </li>
  <li>
    <a href="#components">Components</a>
  </li>
  <li>
    <a href="#license">License</a>
  </li>
</ol> 

### Features
- **8 Reusable Components**: Modular and customizable React components
- **DOST Design System**: Styled according to DOST's official design guidelines
- **Enhanced UI/UX**: Modern features and improvements beyond the base design
- **TypeScript Support**: Full type safety and better developer experience
- **Dashboard System**: Complete dashboard interface for audit management
- **Component Library**: Easy-to-integrate components for future projects

### Technologies Used
This project uses modern web technologies for optimal performance and maintainability:
- [React](https://reactjs.org/) - JavaScript Library for User Interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Fast Build Tool and Development Server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework

<!-- WEB SNAPSHOTS -->
## Web Snapshots

### Dashboard Page
<img width="1365" height="716" alt="image" src="https://github.com/user-attachments/assets/170a10f9-2bd2-43cf-bc16-6e1d4a6c3daa" />
<img width="1365" height="717" alt="image" src="https://github.com/user-attachments/assets/26095d32-47de-4050-8540-0358f5d1b142" />

### Login Page
<img width="1365" height="716" alt="image" src="https://github.com/user-attachments/assets/0bf56dfc-61e2-461a-ac2a-832d2ed967f1" />

### Registration Page
<img width="1365" height="716" alt="image" src="https://github.com/user-attachments/assets/4fac1e25-bbd6-4d4a-803f-764321a89b4b" />

### Card Components Showcase
<img width="663" height="313" alt="image" src="https://github.com/user-attachments/assets/fda872ce-9c41-4b81-85d5-1ac06729f3fb" />
<img width="660" height="312" alt="image" src="https://github.com/user-attachments/assets/e12dfc56-d6fb-428d-84b7-f4763ba2b0a6" />
<img width="438" height="350" alt="image" src="https://github.com/user-attachments/assets/71934754-258e-4756-a483-403f4ed484a4" />
<img width="441" height="346" alt="image" src="https://github.com/user-attachments/assets/74763876-24b6-4c92-be10-27497a6c6aea" />
<img width="440" height="349" alt="image" src="https://github.com/user-attachments/assets/01b5f5cc-70a9-4443-8264-8c07ed1357c8" />

<!-- FOLDER STRUCTURE -->
## Folder Structure

    src/
    ├── components/               # Reusable React components (8 components)
    ├── data/                    # Static data and mock data files  
    ├── fonts/                   # Noto sans font files
    └── pages/                   # Main application pages
        ├── dashboard/           # Dashboard page
        ├── login/              # Login page
        └── register/           # Registration page
    
    public/                      # Static assets
    
    package.json                 # Project dependencies and scripts
    vite.config.ts              # Vite configuration
    tailwind.config.js          # Tailwind CSS configuration
    tsconfig.json               # TypeScript configuration

<!-- INSTALLATION -->
## Installation

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** - Package manager

### Cloning the Repository

1. Fork this repository.

2. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dost-components.git
   cd dost-components
   ```

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

<!-- RUN -->
## Run

1. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

2. Visit `http://localhost:5173` in your browser.

### Building for Production

1. Build the project:
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```
   or
   ```bash
   yarn preview
   ```

<!-- COMPONENTS -->
## Components

This library includes 8 reusable components designed for the DOST Internal Audit Information Management System:

*Component details and usage examples will be documented as the library grows. (I think)*

### Pages

- **Dashboard**: Main interface for audit management and data visualization
- **Login**: Authentication page with DOST branding and enhanced UX
- **Register**: User registration with form *slight* validation

## License
Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License. See [LICENSE](LICENSE) for more information.

<p align="right">[<a href="#readme-top">Back to top</a>]</p>
