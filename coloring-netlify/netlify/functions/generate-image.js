const Anthropic = require("@anthropic-ai/sdk").default;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API key not configured. Please add ANTHROPIC_API_KEY to your Netlify environment variables.",
      }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    const client = new Anthropic({
      apiKey: apiKey,
    });

    // Use the images.generate endpoint for image generation
    const response = await client.images.generate({
      model: "claude-3-5-sonnet-20241022",
      prompt: `Create a black and white coloring book page for adults: ${prompt}. Style: Clean black outlines on pure white background. Detailed line art with clear spaces to color. Professional illustration quality. No shading, no gray tones - only black lines on white. Make it intricate but with distinct areas to fill in with color.`,
    });

    // Get the base64 image data from the response
    if (response.images && response.images.length > 0) {
      const imageData = response.images[0].base64;
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: true,
          imageData: imageData,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No image was generated",
        }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    
    // Check if it's an API error with more details
    const errorMessage = error.message || "Failed to generate image";
    const statusCode = error.status || 500;
    
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        error: errorMessage,
        details: error.error?.message || null
      }),
    };
  }
};
