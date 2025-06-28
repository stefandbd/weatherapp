# 🌦️ WeatherApp

<img src="app/assets/images/logo.png" alt="WeatherApp Logo" width="80" height="80">

A modern, feature-rich weather application built with React Native that provides real-time weather information and forecasts.

# 🌦️ Demo & FPS performance analysis

- Demo: https://drive.google.com/file/d/1YLZ0AVpxT77wdg_bX4OrbhqyUDq1xH58/view?usp=sharing
- JS/UI FPS performance analysis: https://drive.google.com/file/d/1YLZ0AVpxT77wdg_bX4OrbhqyUDq1xH58/view?usp=sharing

  <img src="https://i.ibb.co/twyTCy6S/Simulator-Screenshot-i-Phone-16-Pro-2025-04-20-at-11-37-28.png" alt="Simulator-Screenshot-i-Phone-16-Pro-2025-04-20-at-11-37-28" width="300">

## 📑 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [TODOs](#TODOs)
- [License](#license)

## ✨ Features

- **Real-time Weather Data**: Get current weather conditions including temperature, humidity, wind speed, and more
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
- **Location-based Weather**: Automatically fetch weather for your current location
- **Location Search**: Search for weather in any city worldwide using Google Places Autocomplete
- **Recent Searches**: Access your search history for quick navigation
- **Dynamic UI**: Background and UI elements adapt based on current weather conditions and time of day
- **Offline Support**: Cache weather data for offline access
- **Pull-to-Refresh**: Easily update weather data with pull-to-refresh functionality
- **Error Handling**: Robust error handling with user-friendly error messages
- **Responsive Design**: Works on various screen sizes and orientations

## 🏗️ Architecture

The WeatherApp follows a modern React Native architecture with a focus on maintainability, scalability, and performance.

### 🔍 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                           UI Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Screens   │  │  Components │  │ Navigation & Routes │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                       Business Logic                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Hooks    │  │    Redux    │  │    Query Client     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         Data Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Services  │  │ HTTP Client │  │   Storage Utils     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🧩 Key Architectural Patterns

1. **Custom Hooks**: Encapsulate business logic and state management in reusable hooks
2. **Redux State Management**: Centralized state management with Redux Toolkit
3. **React Query**: Data fetching, caching, and state management for API calls
4. **Service Layer**: Abstraction for external API interactions
5. **Component Composition**: Reusable UI components with clear responsibilities

## 📁 Project Structure

```
app/
├── App.tsx                 # Main application component
├── assets/                 # Images, fonts, and other static assets
├── components/             # Reusable UI components
│   ├── forecast-card/      # 5-day forecast card component
│   ├── recent-searches-modal/ # Recent searches modal component
│   └── weather-display/    # Main weather display component
├── hooks/                  # Custom React hooks
│   ├── useGooglePlaces.ts  # Google Places Autocomplete hook
│   ├── useLocation.ts      # Location services hook
│   ├── useWeather.ts       # Weather data fetching hook
│   └── useWeatherUI.ts     # Weather UI state management hook
├── httpclient/             # HTTP client configuration
│   ├── createAxiosInstance.ts # Axios instance creator
│   ├── createQueryClient.ts # React Query client setup
│   ├── endpoints.ts        # API endpoints
│   └── queries/            # React Query query definitions
│       └── weatherQueries.ts # Weather-related queries
├── navigation/             # Navigation configuration
│   ├── app-routes.ts       # Route definitions
│   ├── root-navigator.tsx  # Root navigation stack
│   └── types.ts            # Navigation type definitions
├── screens/                # Application screens
│   └── home-screen/        # Main weather screen
├── services/               # API service layer
│   └── weatherService.ts   # Weather API service
├── store/                  # Redux store configuration
│   ├── hooks.ts            # Redux hooks
│   ├── index.ts            # Store setup
│   └── locationSlice.ts    # Location state slice
├── theming/                # Theme configuration
│   ├── Colors.ts           # Color definitions
│   ├── Constants.ts        # Theme constants
│   ├── Images.ts           # Image references
│   └── Sizes.ts            # Size definitions
└── utils/                  # Utility functions
    ├── geolocation.ts      # Geolocation utilities
    └── storage.ts          # Storage utilities
```

## 🛠️ Technologies Used

### 🧠 Core

- **React Native**: v0.79.1
- **TypeScript**: v5.0.4
- **React**: v19.0.0

### 📊 State Management & Data Fetching

- **Redux Toolkit**: v2.7.0
- **React Redux**: v9.2.0
- **TanStack Query (React Query)**: v5.74.4
- **Axios**: v1.8.4

### 🎨 UI & Styling

- **Emotion Native**: v11.11.0
- **React Native Linear Gradient**: v2.8.3
- **React Native Safe Area Context**: v5.4.0

### 🧭 Navigation

- **React Navigation**: v7.1.6
- **React Navigation Native Stack**: v7.3.10

### 💾 Storage & Persistence

- **React Native MMKV**: v3.2.0
- **TanStack Query Persist Client**: v5.74.4

### 📍 Location Services

- **React Native Community Geolocation**: v3.4.0
- **React Native Google Places Autocomplete**: v2.5.7
- **React Native Permissions**: v5.3.0

### 🧪 Development & Testing

- **Jest**: v29.6.3
- **React Testing Library**: v13.2.0
- **ESLint**: v8.19.0
- **Prettier**: v2.8.8

## 📥 Installation

### 📋 Prerequisites

- Node.js (v18 or newer)
- Yarn or npm
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### 📝 Steps

1. Clone the repository:

```sh
git clone https://github.com/yourusername/WeatherApp.git
cd WeatherApp
```

2. Install dependencies:

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

3. Install iOS dependencies (iOS development only):

```sh
bundle install
bundle exec pod install
```

## ⚙️ Environment Setup

The app requires API keys for OpenWeatherMap and Google Places. Create a `.env` file in the root directory with the following variables:

```
BASE_URL=https://api.openweathermap.org/data/3.0/
API_KEY=your_openweathermap_api_key
GOOGLE_PLACES_KEY=your_google_places_api_key
```

### 🔑 Getting API Keys

- **OpenWeatherMap API Key**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) and get an API key
- **Google Places API Key**: Create a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the Places API, and generate an API key

## 📱 Running the App

### 🚀 Start Metro Server

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### 🤖 Run on Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### 🍎 Run on iOS

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

## 🧪 Testing

The app includes unit and component tests using Jest and React Testing Library.

```sh
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🔄 Data Flow

### 🌤️ Weather Data Flow

1. User opens the app or searches for a location
2. App fetches location coordinates (from device or search)
3. Weather data is requested from OpenWeatherMap API
4. Data is processed and stored in Redux state
5. UI components render based on the weather data
6. Data is cached for offline access

### 📍 Location Data Flow

1. App requests location permissions on startup
2. If granted, device coordinates are obtained
3. Coordinates are used to fetch weather data
4. Google Places API is used for location search
5. Selected locations are saved to recent searches
6. Recent searches are persisted in MMKV storage

## 🚨 Error Handling

The app implements comprehensive error handling:

- Network connectivity issues
- API errors with specific status codes
- Location permission denials
- Invalid coordinates or search queries
- Data processing errors

Each error type has appropriate user feedback and recovery mechanisms.

## ⚡ Performance Optimizations

- **Memoization**: Components and calculations use React.memo and useMemo
- **Query Caching**: React Query caches API responses
- **Lazy Loading**: Components and assets are loaded as needed
- **Debouncing**: Search queries are debounced to reduce API calls
- **Optimized Rendering**: FlatList for efficient list rendering

## 👥 TODOs

Contributions are welcome! Please feel free to submit a Pull Request.

1. More Unit tests
2. Improve UI

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
