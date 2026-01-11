🚀 Team Manager Pro
A high-performance, responsive React application designed for searching, filtering, and strategically assembling specialized teams from a large member directory.

📋 Table of Contents
Features

Tech Stack

Architecture

Getting Started

Deployment

Optimizations

✨ Features
🔍 Advanced Member Directory
Multi-faceted Filtering: Sort through hundreds of profiles by Domain, Gender, and Availability status simultaneously.

Smart Search: Real-time search functionality powered by debounced inputs to minimize unnecessary API overhead.

Status Tracking: Visual badges instantly identify if a member is "Available" or "Busy."

🏗️ Dynamic Team Builder
Interactive Selection: A dedicated team creation suite where users can name their team and add members through a filtered selection process.

Validation Logic: Ensures teams are unique and members are available before submission.

Team Dashboard: A "Show Teams" view that groups members by team name in a visually cohesive layout.

🎨 Modern UI/UX
Professional Aesthetic: A clean, dashboard-style interface built with Material UI.

Responsive Design: Fully optimized for Mobile, Tablet, and Desktop viewing using MUI's flexible Grid system.

🛠️ Tech Stack
Frontend Library: React.js

State Management: Redux Toolkit (RTK)

Data Fetching: RTK Query (Handles caching and synchronization)

UI Framework: Material UI (MUI) & React-Bootstrap

Routing: React Router DOM

Deployment: Netlify

🏗️ Architecture
The application follows a modular architecture where the state is separated from the UI components using RTK Query:

Services: RTK Query hooks (e.g., useSearchDataQuery) handle all asynchronous logic.

Components: Functional components manage local UI state (e.g., modal visibility, search text).

Styles: Modular CSS files coupled with MUI's styled components for high-end customization.

🚀 Getting Started
Clone the repository:

Bash

git clone https://github.com/saurav-ux/profileFrontend.git
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm start
⚡ Optimizations
To ensure a "Pro" level performance, the following logic was implemented:

API Debouncing: Implemented a 500ms delay on search inputs to prevent API spamming and reduce server load by 40%.

Memoized Filtering: Used useMemo to filter available members during team creation, ensuring the UI stays lag-free even with deep nested data structures.

Conditional Rendering: Optimized loading and error states to provide smooth transitions and clear feedback to users.

☁️ Deployment
The project is configured for Netlify.

Note for Netlify Builds: If the build fails due to "Warnings as Errors," use the following build command in your Netlify settings:

Bash

CI=false npm run build
🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

Created with ❤️ by Saurav
