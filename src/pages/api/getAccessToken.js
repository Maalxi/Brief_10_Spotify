import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID // Votre client_id
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET // Votre client_secret

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:8888/'); // Assurez-vous que c'est la même URI de redirection que celle que vous avez utilisée pour obtenir le code d'autorisation

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
      },
    });

    const data = await response.data;

    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
