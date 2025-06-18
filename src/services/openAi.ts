import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1', // ✅ only if you're using OpenRouter
  defaultHeaders: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'My OpenRouter App',
  },
  timeout: 30000,
}
);

export const generateMealPlanFromAI = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a nutritionist AI. Generate personalized weekly meal plans.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'No meal plan generated.';
  } catch (error: any) {
    console.error('Error generating meal plan:', error);

    // Optional: more detailed error messaging
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    return 'An error occurred while generating the meal plan.';
  }
};
