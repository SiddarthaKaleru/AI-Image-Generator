import * as dotenv from "dotenv";
import { createError } from "../error.js";
import fetch from "node-fetch"; 

dotenv.config();

// Controller to generate Image with Clipdrop API
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // Formulate the form data
    const form = new FormData();
    form.append('prompt', prompt);

    // Make the POST request to Clipdrop API
    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY, // Use Clipdrop API key
      },
      body: form,
    });

    if (response.ok) {
      // Convert response buffer to a base64 string
      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      
      res.status(200).json({ photo: base64Image });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Image generation failed');
    }
  } catch (error) {
    next(
      createError(
        error.status || 500,
        error.message || "An unexpected error occurred"
      )
    );
  }
};
