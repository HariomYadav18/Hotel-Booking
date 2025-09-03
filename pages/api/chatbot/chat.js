import { replyFor } from './intents';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message = '' } = req.body || {};
  const reply = replyFor(String(message));
  return res.status(200).json({ reply });
}


