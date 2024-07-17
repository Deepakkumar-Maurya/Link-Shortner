# URL Shortener with QR and Barcode Generator

This project is a web application that allows users to shorten long URLs, as well as generate QR codes and barcodes for their shortened links. It's built with Node.js, Express, and MongoDB.

## Features

- Shorten long URLs to create easy-to-share links
- Generate QR codes for shortened URLs
- Create various types of barcodes for shortened URLs
- User authentication and management
- Analytics for link clicks and usage

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)

## Installation

1. Clone the repository:
   
   https://github.com/Deepakkumar-Maurya/Link-Shortner

2. Navigate to the project directory:
   
   `cd Link-Shortner`

3. Install the dependencies:
   
   `npm install`

4. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:
   
   `npm start`

## API Endpoints

- `POST /api/shorten`: Create a shortened URL
- `GET /api/expand/:shortCode`: Expand a shortened URL
- `POST /api/qr`: Generate a QR code for a URL
- `POST /api/barcode`: Generate a barcode for a URL
- `GET /api/stats/:shortCode`: Get usage statistics for a shortened URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/)
- [JsBarcode](https://github.com/lindell/JsBarcode)

