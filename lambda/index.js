const QRCode = require("qrcode");

exports.handler = async (event, context) => {
  // Handle OPTIONS requests for CORS
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

  try {
    // Parse the request body
    const body = JSON.parse(event.body || "{}");
    const { text, size = 200, format = "png" } = body;

    // Validate input
    if (!text) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: JSON.stringify({
          error: "Text parameter is required",
        }),
      };
    }

    // QR code options
    const options = {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    };

    let qrCodeData;
    let contentType;

    if (format === "svg") {
      // Generate SVG format
      qrCodeData = await QRCode.toString(text, {
        ...options,
        type: "svg",
      });
      contentType = "image/svg+xml";
    } else {
      // Generate PNG format (base64)
      qrCodeData = await QRCode.toDataURL(text, {
        ...options,
        type: "image/png",
      });
      contentType = "image/png";
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        success: true,
        qrCode: qrCodeData,
        format: format,
        contentType: contentType,
      }),
    };
  } catch (error) {
    console.error("Error generating QR code:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
