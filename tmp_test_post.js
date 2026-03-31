(async function(){
  const payload = { nome: 'script-test', phone: '6800000000', status: 'confirmado', acomps: [] };
  const ports = [3000, 3001];
  for (const port of ports) {
    const url = `http://localhost:${port}/api/guests`;
    try {
      console.log('Trying', url);
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const text = await res.text();
      console.log('URL:', url);
      console.log('Status:', res.status);
      console.log('Response body:', text);
      process.exit(0);
    } catch (err) {
      console.error('Request to', url, 'failed:', err.message || err);
    }
  }
  console.error('All requests failed. Is the dev server running?');
  process.exit(1);
})();
