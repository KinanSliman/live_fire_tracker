# 🌍🔥 Real-Time Wildfire Tracker

A live global wildfire tracking web app powered by NASA FIRMS data, WebSockets, and MapLibre GL (3D) + multiple 2D map tilers.

---

## 🚀 Overview

The **Real-Time Wildfire Tracker** visualizes all wildfires detected worldwide in the past **24 hours**, using NASA’s FIRMS satellite data.

The system includes a **Node.js and WebSocket backend** and a **React + MapLibre GL frontend** with support for multiple 3D/2D map styles.  
When a user clicks a wildfire marker, the app reverse-geocodes the coordinates to display the country, state, and city using OpenStreetMap’s Nominatim API. Caching is used to avoid repeated lookups.

---

## ✨ Key Features

### 🔥 Live NASA FIRMS Wildfire Data

- Server fetches global wildfire activity for the past 24 hours.
- No database used — results are stored in memory for high performance.

### 📡 Real-time Updates with WebSockets

- Users receive the latest wildfire data instantly when they open the app.
- Eliminates unnecessary polling.

### 🗺️ Advanced Mapping (3D + 2D)

- **MapLibre GL** for immersive **3D visualization**.
- Multiple **MapTiler 2D styles** available for user preference.
- Users can switch map layouts seamlessly.

### 🌏 Reverse Geocoding (with Caching)

- Clicking a wildfire pin displays its nearest city, state/region, and country.
- Results are cached to minimize external API calls.

---

## 🏗️ Tech Stack

### **Backend**

- Node.js
- WebSocket (`ws`)
- NASA FIRMS API
- In-memory data caching

### **Frontend**

- React.js
- Redux Toolkit
- MapLibre GL JS
- MapTiler
- SASS/SCSS

## 🧩 Architecture

NASA FIRMS API → Node.js Server → WebSocket → React Frontend → MapLibre / MapTiler
↘ Reverse Geocode (client-side)

---

## ⚡ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/KinanSliman/wildfire-tracker.git
cd wildfire-tracker
```

### 2. Install dependencies

```bash

cd server
npm install
```

### 3. Add environment variables

Create .env file like this:

```bash

VITE_MAPTILER_KEY="your_maptiller_key"
MAP_KEY="your_nasa_firms_api_key"
```

### 4. Start server:

```bash

nodemon src/server/main.js
```

### 5. Start Web App:

```bash

npm run dev
```
