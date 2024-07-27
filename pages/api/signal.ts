import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sdp } = req.body;

    try {
      const response = await fetch('https://customer-e0ksx71mz4nqibcu.cloudflarestream.com/815582766c21f4fbad2260b77965c53fkf3517e33688be73544771ea9ea026a55/webRTC/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sdp }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao publicar sinal: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(400).json({ message: `Erro ao publicar sinal: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
