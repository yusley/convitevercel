(async function(){
  const tests = [
    { nome: 'batch-1', phone: '6800000001', status: 'confirmado', acomps: [] },
    { nome: 'batch-2', phone: '6800000002', status: 'confirmado', acomps: [{ nome: 'A' }] },
    { nome: 'b', phone: '6800000003', status: 'confirmado', acomps: [] }, // invalid short name
    { nome: 'batch-1', phone: '6800000001', status: 'confirmado', acomps: [] }, // duplicate
    { /* missing nome */ phone: '6800000004', status: 'confirmado', acomps: [] },
    { nome: 'batch-3', phone: '', status: 'confirmado', acomps: [] },
  ];

  const ports = [3000, 3001];
  const results = [];

  for (const port of ports) {
    for (const t of tests) {
      const url = `http://localhost:${port}/api/guests`;
      try {
        console.log(`\nPOST ${url} payload:`, JSON.stringify(t));
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', text || '<empty>');
        results.push({ url, status: res.status, body: text });
      } catch (err) {
        console.error('Request failed for', url, err && err.message ? err.message : err);
        results.push({ url, error: String(err) });
      }
      // small pause
      await new Promise(r => setTimeout(r, 250));
    }
  }

  console.log('\nSummary:');
  for (const r of results) console.log(JSON.stringify(r));
  // cleanup file if desired
  try { /* no-op */ } catch(e){}
  process.exit(0);
})();
