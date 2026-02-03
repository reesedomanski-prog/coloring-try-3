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

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Generate a coloring book page image for: ${prompt}

Style: Black and white line art coloring page for adults. Clean black outlines on pure white background. Detailed and intricate but with clear spaces to color. Professional illustration quality. No shading or gray tones - only black lines on white.`,
        },
      ],
      tools: [
        {
          name: "image_generation",
          type: "image_generation_2025_04_14",
        },
      ],
    });

    // Find the image in the response
    let imageData = null;
    for (const block of response.content) {
      if (block.type === "image") {
        imageData = block.source?.data;
        break;
      }
    }

    if (!imageData) {
      // Check if there's a text response explaining why
      const textBlock = response.content.find((b) => b.type === "text");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: textBlock?.text || "No image was generated",
        }),
      };
    }

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
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Failed to generate image",
      }),
    };
  }
};
