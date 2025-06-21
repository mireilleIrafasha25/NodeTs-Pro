import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'My OpenRouter App',
  },
  timeout: 30000,
});

export const generateMealPlanFromAI = async (prompt: string): Promise<any[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful nutritionist AI. Only return the response as a JSON array of 7 days, with each day containing breakfast, snack, lunch, and dinner.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '';

    // 🔍 Try to parse the AI response as JSON
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        console.warn("AI returned unexpected format. Wrapping in array.");
        return [parsed];
      }
    } catch (err) {
      console.error('❌ Failed to parse AI response as JSON:', err);
      console.log('Raw content:', content);
      return [];
    }
  } catch (error: any) {
    console.error('Error generating meal plan:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    return [];
  }
};
