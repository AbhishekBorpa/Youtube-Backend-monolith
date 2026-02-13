# Yu - YouTube Clone Backend

A robust, feature-rich backend for a video-sharing and social interaction platform (YouTube Clone) built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

### 🎞️ Video Management
- **Video Upload**: Seamless integration with **Cloudinary** for video and thumbnail storage.
- **Transcoding Ready**: Metadata extraction (duration, title, etc.) and toggle-able publishing.
- **Watch Progress**: Keep track of user's watch state for every video.
- **Playlists**: Create and manage custom video collections.

### 👥 Social & Community
- **Communities [NEW]**: Create groups, join/leave, and participate in community-specific discussions.
- **Tweets**: Share text-based updates and polls with your audience.
- **Subscriptions**: Robust channel subscription system.
- **Likes & Comments**: Interactive discussion threads and like/unlike functionality for videos, tweets, and comments.

### 🔍 Content Discovery
- **Refined Search [NEW]**: Flexible regex-based fuzzy search for videos, titles, and descriptions.
- **Search History**: Intelligent tracking and management of user searches.
- **Dashboard**: Advanced analytics for creators to track channel performance.

### 🛠️ Advanced Tools
- **Real-time Notifications**: Powered by **Socket.io** for instant alerts.
- **Healthchecks**: Built-in monitoring for system vitals.
- **Admin Tools**: Dedicated oversight endpoints for platform management.

## 🛠️ Tech Stack

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **File Storage**: Cloudinary
- **Auth**: JWT with Access & Refresh Token strategy
- **Real-time**: Socket.io
- **Middleware**: Multer (file handling), Helmet (security), CORS, Cookie-parser

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (Atlas or local)
- Cloudinary Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbhishekBorpa/Youtube-Backend-monolith.git
   cd yu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root and add the following:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 License
This project is licensed under the ISC License.

---
Built with ❤️ by [Abhishek Borpa](https://github.com/AbhishekBorpa)
