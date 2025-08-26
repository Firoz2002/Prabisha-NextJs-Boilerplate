import Together from 'together-ai';
import cloudinary from '@/lib/cloudinary';

const togetherai = new Together({
    apiKey: process.env.TOGETHER_AI_API_KEY ?? '',
});

export async function generateImage(prompt: string) {
    try {
        const response = await togetherai.images.create({
            prompt,
            width: 1024,
            height: 768,
            response_format: "base64",
            model: "black-forest-labs/FLUX.1-schnell",
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("No image generated");
        }

        const imageData = response.data[0];
        if (!('b64_json' in imageData)) {
            throw new Error("Expected base64 response but got URL instead");
        }

        const imageBase64 = imageData.b64_json;

        return imageBase64;
        
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}