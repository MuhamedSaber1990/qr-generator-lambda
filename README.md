# QR Generator Lambda

A simple AWS Lambda function that generates QR codes on demand. Built with Node.js and the `qrcode` library, this Lambda can be hooked up to API Gateway (or any other HTTP trigger) to provide a lightweight QR code–generation endpoint.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Deployment](#deployment)
5. [Usage](#usage)
   - [HTTP Endpoint](#http-endpoint)
   - [Example cURL](#example-curl)
6. [CORS Support](#cors-support)
7. [Project Structure](#project-structure)
8. [Scripts](#scripts)
9. [License](#license)

---

## Features

- Generates QR codes (PNG) from a simple JSON payload.
- Returns a Base64-encoded PNG data URL in the response.
- Built-in CORS support for easy integration into web applications.
- Easy to deploy as an AWS Lambda function (works with API Gateway or any Lambda-based HTTP trigger).

---

## Prerequisites

- **Node.js** (>= 12.x) and **npm** installed locally.
- An **AWS account** with permissions to create/update Lambda functions.
- **AWS CLI** installed and configured (optional, but recommended for deployment).

---

## Installation

1. **Clone the repository** (or download/​unzip the project folder).

   ```bash
   git clone https://github.com/Muhamed.Saber.1990/qr-generator-lambda.git
   cd qr-generator-lambda
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   > This will install:
   >
   > - [qrcode](https://www.npmjs.com/package/qrcode) (for generating QR codes)
   > - Any other dependencies listed in `package.json`

---

## Deployment

You can deploy the Lambda either manually via the AWS Console or by using the provided `npm run zip` script and the AWS CLI.

### 1. Create a ZIP Package

```bash
npm run zip
```

- This will bundle everything (including `node_modules/`) into `qr-generator.zip`.

  ```text
  qr-generator.zip
  ├─ index.js
  ├─ package.json
  └─ node_modules/
      └─ qrcode/
      └─ (other dependencies)
  ```

### 2. Create or Update an AWS Lambda Function

1. **Manually (AWS Console):**

   - Go to the AWS Lambda Console.
   - Click “Create function” (or select an existing function to update).
   - Choose “Upload a .zip file” and upload `qr-generator.zip`.
   - Set “Handler” to `index.handler`.
   - Ensure the Node.js runtime matches your local version (e.g., Node.js 14.x or 16.x).

2. **Using AWS CLI:**

   ```bash
   aws lambda create-function      --function-name qr-generator-lambda      --runtime nodejs14.x      --handler index.handler      --zip-file fileb://qr-generator.zip      --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_LAMBDA_EXECUTION_ROLE
   ```

   - If you’re updating an existing function:
     ```bash
     aws lambda update-function-code        --function-name qr-generator-lambda        --zip-file fileb://qr-generator.zip
     ```

> **Note:** Replace `YOUR_ACCOUNT_ID` and `YOUR_LAMBDA_EXECUTION_ROLE` with the appropriate values for your environment.

---

## Usage

Once your Lambda is deployed, you can invoke it via API Gateway (recommended) or any HTTP trigger that forwards requests to Lambda.

### HTTP Endpoint

- **Method**: `POST`
- **Path**: (e.g.) `/generate`
- **Headers**:

  - `Content-Type: application/json`
  - (CORS headers are enabled automatically; see [CORS Support](#cors-support))

- **Request Body (JSON)**:

  ```json
  {
    "text": "https://example.com"
  }
  ```

  - **text** (string, required): The string or URL you want to encode into a QR code.

- **Sample Successful Response** (`200 OK`, `application/json`):

  ```json
  {
    "qrCodeDataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```

  - **qrCodeDataURL**: A Base64-encoded PNG data URL. You can embed this directly into an `<img>` tag on a webpage.

- **Error Response Example** (`400 Bad Request`, `application/json`):
  ```json
  {
    "error": "Bad Request",
    "message": "Missing or invalid \"text\" property in request body."
  }
  ```

### Example cURL

```bash
curl -X POST https://your-api-gateway-domain/production/generate   -H "Content-Type: application/json"   --data '{"text":"Hello, world!"}'
```

- If successful, you’ll get a JSON response containing `qrCodeDataURL`. Copy that value into an `<img>` tag, e.g.:
  ```html
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="QR Code" />
  ```

---

## CORS Support

In `index.js`, the Lambda handler checks for HTTP `OPTIONS` requests and responds with the necessary CORS headers:

```js
if (event.httpMethod === "OPTIONS") {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: "",
  };
}
```

All responses (including errors) include:

```
"Access-Control-Allow-Origin": "*"
"Access-Control-Allow-Headers": "Content-Type"
"Access-Control-Allow-Methods": "POST, OPTIONS"
```

This allows any web client (from any origin) to call the API endpoint.

---

## Project Structure

```
qr-generator-lambda/
├─ index.js          # Main Lambda handler (exports.handler)
├─ package.json
├─ package-lock.json
├─ node_modules/     # Installed dependencies (e.g., qrcode)
└─ README.md         # ← (this file)
```

- **index.js**  
  Contains the Lambda handler logic:

  1. Handle `OPTIONS` (CORS preflight)
  2. Parse incoming JSON (`event.body`)
  3. Use `qrcode.toDataURL(...)` to generate a Base64 PNG
  4. Return a JSON response with `qrCodeDataURL` on success, or an error JSON on failure.

- **package.json**  
  Basic metadata and dependencies:
  ```json
  {
    "name": "qr-generator-lambda",
    "version": "1.0.0",
    "description": "Simple QR code generator using AWS Lambda",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "zip": "zip -r qr-generator.zip index.js node_modules/ package.json"
    },
    "dependencies": {
      "qrcode": "^1.5.3"
    },
    "keywords": ["qr", "generator", "lambda", "aws"],
    "author": "Your Name",
    "license": "MIT"
  }
  ```

---

## Scripts

- **`npm run zip`**  
  Creates `qr-generator.zip` containing:

  ```
  index.js
  package.json
  node_modules/
  ```

  You can then upload this ZIP to AWS Lambda.

- **(Optional) `npm test`**  
  Currently a placeholder (`echo \"Error: no test specified\" && exit 1`). Add your own tests if desired.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to fork and adapt as needed.

---
