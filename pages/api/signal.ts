import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sdp } = req.body;

    if (!sdp) {
      return res.status(400).json({ message: 'SDP is required' });
    }

    try {
      const response = await fetch('https://customer-e0ksx71mz4nqibcu.cloudflarestream.com/f03a60dd94e1bd8ec1cb40c84d0493dek415245fc4d9b1495cf930107bffb4912/webRTC/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sdp }), // Certificando que estamos enviando o SDP corretamente
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
