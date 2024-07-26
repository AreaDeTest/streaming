import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.cloudflare.com/client/v4/accounts/f80e0a4c91b51162c9b453ea234c3799/stream/direct_upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer gW2kW5ZyPCBXutorvb8cE5WNYjCOLxWiAuGCK0OD`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxDurationSeconds: 3600 }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter URL de upload: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json({ uploadURL: data.result.uploadURL });
    } catch (error) {
      console.error('Erro ao obter URL de upload:', error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
