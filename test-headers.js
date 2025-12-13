import { request } from 'http';

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDZiZjljMS02YjU1LTRiODQtYWNhMC05NzQ0MDUxNjU1MzEiLCJsb2dpbiI6IlRFU1RfQVVUSF9MT0dJTiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjU1NzY0OTEsImV4cCI6MTc2NTU4MDA5MX0.Ul6u4dENxYVt1cZnGL7sPLA_jGabC97CJDpQpfA86w0';

function makeRequest(path, authHeader) {
  return new Promise((resolve) => {
    const req = request(
      {
        hostname: 'localhost',
        port: 4000,
        path,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          console.log(`${path} - Status: ${res.statusCode}`);
          console.log('Response:', data.substring(0, 100));
          resolve(res.statusCode);
        });
      },
    );

    req.on('error', console.error);
    req.end();
  });
}

async function test() {
  console.log('1. Без токена (должен быть 401):');
  await makeRequest('/track', null);

  console.log('\n2. С токеном (должен быть 200 или 404):');
  await makeRequest('/track', token);

  console.log('\n3. Проверка users (должен быть 200):');
  await makeRequest('/user', token);
}

test();
