import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

// ─── helpers ──────────────────────────────────────────────
const STATUS_LABEL = { confirmado: 'Confirmado', pendente: 'Talvez', nao: 'Não vem' };
const STATUS_CLASS  = { confirmado: 'badge-confirmado', pendente: 'badge-pendente', nao: 'badge-nao' };

function BowSVG({ size = 48 }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 100 80" style={{ display: 'block', margin: '2px auto', opacity: 0.65 }}>
      <ellipse cx="27" cy="40" rx="25" ry="12" transform="rotate(-27 27 40)" fill="#c8d8e4" opacity=".72"/>
      <ellipse cx="73" cy="40" rx="25" ry="12" transform="rotate(27 73 40)" fill="#c8d8e4" opacity=".72"/>
      <ellipse cx="50" cy="40" rx="6" ry="6" fill="#a8bece"/>
      <line x1="50" y1="40" x2="28" y2="78" stroke="#b8c8d8" strokeWidth="1.7"/>
      <line x1="50" y1="40" x2="72" y2="78" stroke="#b8c8d8" strokeWidth="1.7"/>
    </svg>
  );
}

function DividerBow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', maxWidth: 300, margin: '2px auto' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
      <svg width="22" height="18" viewBox="0 0 60 48">
        <ellipse cx="16" cy="24" rx="14" ry="7" transform="rotate(-24 16 24)" fill="#c0d0dc" opacity=".8"/>
        <ellipse cx="44" cy="24" rx="14" ry="7" transform="rotate(24 44 24)" fill="#c0d0dc" opacity=".8"/>
        <ellipse cx="30" cy="24" rx="5" ry="5" fill="#a0b8c8"/>
      </svg>
      <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <div style={{
      position: 'fixed', bottom: 26, left: '50%',
      transform: msg ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)',
      background: 'var(--slate-dark)', color: '#fff',
      borderRadius: 50, padding: '11px 22px',
      fontSize: '.77rem', letterSpacing: '.4px',
      transition: 'transform .4s cubic-bezier(.175,.885,.32,1.275)',
      zIndex: 999, pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>{msg}</div>
  );
}

// ─── Background Bows ──────────────────────────────────────
function BgBows() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg width="300" height="300" style={{ position: 'absolute', top: -50, left: -70, animation: 'float 9s ease-in-out infinite' }} viewBox="0 0 200 200">
        <ellipse cx="58" cy="100" rx="54" ry="26" transform="rotate(-35 58 100)" fill="#c8d8e4" opacity=".37"/>
        <ellipse cx="142" cy="100" rx="54" ry="26" transform="rotate(35 142 100)" fill="#c8d8e4" opacity=".37"/>
        <ellipse cx="100" cy="100" rx="10" ry="10" fill="#a8bece" opacity=".48"/>
        <line x1="100" y1="100" x2="42" y2="178" stroke="#b8c8d8" strokeWidth="2.2" opacity=".42"/>
        <line x1="100" y1="100" x2="158" y2="178" stroke="#b8c8d8" strokeWidth="2.2" opacity=".42"/>
      </svg>
      <svg width="110" height="90" style={{ position: 'absolute', top: 55, left: '50%', transform: 'translateX(-50%)', animation: 'float 7s 1s ease-in-out infinite' }} viewBox="0 0 110 85">
        <ellipse cx="32" cy="42" rx="30" ry="14" transform="rotate(-28 32 42)" fill="#c8d8e4" opacity=".44"/>
        <ellipse cx="78" cy="42" rx="30" ry="14" transform="rotate(28 78 42)" fill="#c8d8e4" opacity=".44"/>
        <ellipse cx="55" cy="42" rx="7" ry="7" fill="#b0c4d4" opacity=".58"/>
      </svg>
      <svg width="220" height="220" style={{ position: 'absolute', top: 180, right: -50, animation: 'float 11s 2s ease-in-out infinite' }} viewBox="0 0 200 200">
        <ellipse cx="60" cy="100" rx="50" ry="24" transform="rotate(-38 60 100)" fill="#c0d0dc" opacity=".35"/>
        <ellipse cx="140" cy="100" rx="50" ry="24" transform="rotate(38 140 100)" fill="#c0d0dc" opacity=".35"/>
        <ellipse cx="100" cy="100" rx="9" ry="9" fill="#a0b8c8" opacity=".48"/>
      </svg>
      <svg width="130" height="110" style={{ position: 'absolute', bottom: 130, left: 10, animation: 'float 8s .5s ease-in-out infinite' }} viewBox="0 0 130 105">
        <ellipse cx="38" cy="52" rx="34" ry="16" transform="rotate(-26 38 52)" fill="#c8d8e4" opacity=".4"/>
        <ellipse cx="92" cy="52" rx="34" ry="16" transform="rotate(26 92 52)" fill="#c8d8e4" opacity=".4"/>
        <ellipse cx="65" cy="52" rx="7" ry="7" fill="#b0c4d4" opacity=".56"/>
      </svg>
    </div>
  );
}

// ─── PAGE: Convite ─────────────────────────────────────────
function PageConvite({ goToConfirmar }) {
  return (
    <div className="page-inner">
      <div style={{ textAlign: 'center', padding: '58px 32px 28px', maxWidth: 440 }}>
        <div className="script" style={{ fontSize: 'clamp(3.4rem,14vw,5.2rem)', color: 'var(--rose)', lineHeight: 1.05 }}>
          Williany faz<br />18
        </div>
        <div className="serif" style={{ fontSize: '.82rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--text-light)', marginTop: 14, fontWeight: 300, fontStyle: 'italic' }}>
          Você é convidado para uma tarde de encantos
        </div>
      </div>

      <BowSVG size={48} />

      <div style={{ textAlign: 'center', padding: '20px 32px' }}>
        <div style={{ fontSize: '.67rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 7, fontWeight: 300 }}>Data</div>
        <div className="serif" style={{ fontSize: '1.42rem', color: 'var(--slate-dark)', letterSpacing: 3, fontWeight: 600 }}>29 DE ABRIL</div>
        <div style={{ fontSize: '.87rem', color: 'var(--text-light)', letterSpacing: 1.5, marginTop: 3 }}>18:00</div>
      </div>

      <DividerBow />

      <div style={{ textAlign: 'center', padding: '20px 32px' }}>
        <div style={{ fontSize: '.67rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 7, fontWeight: 300 }}>Local</div>
        <div className="serif" style={{ fontSize: '1.42rem', color: 'var(--slate-dark)', letterSpacing: 3, fontWeight: 600 }}>ESPAÇO SARAH REBEKA</div>
        <div style={{ fontSize: '.87rem', color: 'var(--text-light)', letterSpacing: 1.5, marginTop: 3 }}>Rua São Francisco, 55 — Montanhês</div>
      </div>

      <DividerBow />

      <div style={{ textAlign: 'center', padding: '20px 32px' }}>
        <div style={{ fontSize: '.67rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 7, fontWeight: 300 }}>Traje</div>
        <div className="serif" style={{ fontSize: '1rem', color: 'var(--slate-dark)', letterSpacing: 2, fontWeight: 600 }}>NORMAL</div>
        <div style={{ fontSize: '.87rem', color: 'var(--text-light)', letterSpacing: 1.5, marginTop: 3 }}>Apenas leve roupa de banho</div>
      </div>

      <div className="serif" style={{ maxWidth: 300, margin: '10px 32px', textAlign: 'center', fontStyle: 'italic', fontSize: '1.07rem', color: 'var(--text-light)', lineHeight: 1.8, padding: '20px 0', borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)' }}>
        "Há momentos que se tornam eternos quando compartilhados com quem amamos. Espero por você para celebrar a vida e a doçura de um novo ciclo."
      </div>

      <button className="btn-primary" onClick={goToConfirmar} style={{ marginTop: 26 }}>
        Confirmar Presença
      </button>
    </div>
  );
}

// ─── PAGE: Confirmar ───────────────────────────────────────
function PageConfirmar({ showToast }) {
  const [nome, setNome]     = useState('');
  const [phone, setPhone]   = useState('');
  const [status, setStatus] = useState('confirmado');
  const [acompInput, setAcompInput] = useState('');
  const [acomps, setAcomps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  function addAcomp() {
    const name = acompInput.trim();
    if (!name) return;
    if (acomps.includes(name)) { showToast('Já adicionado!'); return; }
    setAcomps(prev => [...prev, name]);
    setAcompInput('');
  }
  function removeAcomp(i) { setAcomps(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit() {
    if (!nome.trim() || nome.trim().length < 2) { showToast('Por favor, insira seu nome.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), phone, status, acomps }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error === 'Convidado já confirmado' ? 'Você já confirmou presença! 🎀' : data.error);
        return;
      }
      setSuccess(nome.trim());
      setNome(''); setPhone(''); setStatus('confirmado'); setAcomps([]);
      setTimeout(() => setSuccess(''), 7000);
    } catch {
      showToast('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-inner">
      <div className="form-wrap">
        <div className="script" style={{ fontSize: '3rem', color: 'var(--rose)', marginBottom: 4 }}>Confirmar</div>
        <p style={{ fontSize: '.82rem', color: 'var(--text-light)', marginBottom: 18 }}>Preencha os dados abaixo para confirmar sua presença ✦</p>

        <div className="notice-box">
          <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>🎀</span>
          <p style={{ fontSize: '.78rem', color: 'var(--rose)', lineHeight: 1.6 }}>
            <strong style={{ display: 'block', fontWeight: 500, marginBottom: 3, fontSize: '.8rem' }}>Atenção, convidado!</strong>
            Este convite é pessoal e intransferível. <strong>Convidado não convida</strong> — somente você e os seus familiares diretos listados abaixo estão autorizados a comparecer.
          </p>
        </div>

        <div className="field">
          <label>Seu nome completo</label>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome e Sobrenome" />
        </div>
        <div className="field">
          <label>WhatsApp (opcional)</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(xx) 9xxxx-xxxx" />
        </div>
        <div className="field">
          <label>Você virá?</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="confirmado">Sim, estarei lá! 🎉</option>
            <option value="pendente">Talvez, ainda não sei</option>
            <option value="nao">Não poderei comparecer</option>
          </select>
        </div>

        <div className="field">
          <label>Familiares que virão com você (opcional)</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1, marginBottom: 0 }}>
              <input
                value={acompInput}
                onChange={e => setAcompInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addAcomp()}
                placeholder="Nome do familiar"
              />
            </div>
            <button className="btn-add" onClick={addAcomp}>+</button>
          </div>
        </div>

        {acomps.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '7px 0 3px' }}>
            {acomps.map((a, i) => (
              <div key={i} className="chip">
                {a}
                <button onClick={() => removeAcomp(i)}>×</button>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', marginTop: 10, opacity: loading ? .7 : 1 }}
        >
          {loading ? 'Enviando…' : 'Confirmar Presença'}
        </button>

        {success && (
          <div className="msg-success">
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎀</div>
            <strong style={{ display: 'block', fontSize: '1rem', marginBottom: 4, color: '#1a5036' }}>
              {success}, presença confirmada! 🎉
            </strong>
            <p style={{ fontSize: '.87rem', color: '#2d6a48' }}>
              Williany mal pode esperar para celebrar com você.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: Convidados (público) ────────────────────────────
function PageConvidados({ showToast }) {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState('');

  // Public: guests confirm themselves; we show a count only
  // We load count via a lightweight public route — for now we show the local list
  // The public page just shows names (no sensitive data)
  useEffect(() => {
    async function loadPublic() {
      try {
        const res = await fetch('/api/guests');
        if (!res.ok) return;
        const data = await res.json();
        const norm = data.map(g => ({
          ...g,
          acomps: Array.isArray(g.acomps) ? g.acomps : (typeof g.acomps === 'string' ? JSON.parse(g.acomps || '[]') : []),
        }));
        setGuests(norm);
      } catch (err) {
        // silent
      }
    }
    loadPublic();
  }, []);

  return (
    <div className="page-inner">
      <div className="guests-wrap">
        <div className="script" style={{ fontSize: '3rem', color: 'var(--rose)', marginBottom: 14 }}>Convidados</div>
        {guests.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,.75)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid rgba(90,112,128,.1)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎀</div>
            <p className="serif" style={{ fontSize: '1.05rem', color: 'var(--text-light)', fontStyle: 'italic', lineHeight: 1.7 }}>
              A lista de convidados é visível<br />apenas para a aniversariante.
            </p>
            <p style={{ fontSize: '.78rem', color: 'var(--text-light)', marginTop: 10 }}>
              Confirme sua presença na aba <strong>Confirmar</strong> ✦
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {guests.map((g, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.95)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(90,112,128,.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '.95rem', fontWeight: 500 }}>{g.nome}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--text-light)' }}>{STATUS_LABEL[g.status] || g.status}</div>
                </div>
                {g.acomps && g.acomps.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: '.8rem', color: 'var(--text-light)' }}>
                    Acompanhantes: {g.acomps.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: Presentes ──────────────────────────────────────
function PagePresentes() {
  const sections = [
    { title: 'Calçados', items: [
      { icon: '👠', name: 'Sapatos & Sandálias', tags: ['Nº 38'] },
      { icon: '👟', name: 'Tênis & Slides', tags: ['Nº 38'] },
    ]},
    { title: 'Roupas', items: [
      { icon: '👗', name: 'Vestidos & Blusas', tags: ['Tam. 40', 'M / G'] },
      { icon: '👚', name: 'Conjuntos & Calças', tags: ['Tam. 40', 'M / G'] },
    ]},
    { title: 'Perfumes', items: [
      { icon: '🌸', name: 'Florais Doces', tags: ['Doce & Floral'], highlight: true },
      { icon: '🍬', name: 'Gourmand & Frutais', tags: ['Doce & Intenso'], highlight: true },
    ]},
    { title: 'Joias & Acessórios', items: [
      { icon: '💍', name: 'Anéis & Pulseiras', tags: ['Prata 925'], silver: true },
      { icon: '✨', name: 'Colares & Brincos', tags: ['Prata 925'], silver: true },
    ]},
  ];

  return (
    <div className="page-inner">
      <div className="gifts-wrap">
        <div className="script" style={{ fontSize: '3rem', color: 'var(--rose)', marginBottom: 5 }}>Presentes</div>
        <p className="serif" style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-light)', marginBottom: 28 }}>
          Ideias para quem quiser presentear com carinho ✦
        </p>

        {sections.map(sec => (
          <div key={sec.title} style={{ marginBottom: 26 }}>
            <div style={{ fontSize: '.67rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 11, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 10 }}>
              {sec.title}
              <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {sec.items.map(item => (
                <div key={item.name} className={`gift-card${item.highlight ? ' highlight' : ''}${item.silver ? ' silver' : ''}`}>
                  <span style={{ fontSize: '1.75rem', marginBottom: 8, display: 'block' }}>{item.icon}</span>
                  <div style={{ fontSize: '.88rem', color: 'var(--text)', fontWeight: 400, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {item.tags.map(tag => (
                      <span key={tag} className={`gc-tag${item.highlight ? ' tag-rose' : ''}${item.silver ? ' tag-silver' : ''}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="gifts-note">
          <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 2 }}>💛</span>
          <span>O presente mais especial já é a sua presença! Qualquer lembrança vinda com carinho será recebida com muito amor e gratidão. ✨</span>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: Admin ──────────────────────────────────────────
function PageAdmin({ showToast }) {
  const [pw, setPw]         = useState('');
  const [token, setToken]   = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [editingId, setEditingId] = useState(null);

  const isAuth = !!token;

  async function login() {
    const res = await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) { setToken(pw); setPw(''); loadGuests(pw); }
    else { showToast('Senha incorreta'); setPw(''); }
  }

  const loadGuests = useCallback(async (t = token) => {
    setLoading(true);
    try {
      const res = await fetch('/api/guests', { headers: { 'x-admin-token': t } });
      if (!res.ok) { showToast('Erro ao carregar'); return; }
      const data = await res.json();
      const norm = data.map(g => ({
        ...g,
        acomps: Array.isArray(g.acomps) ? g.acomps : (typeof g.acomps === 'string' ? JSON.parse(g.acomps || '[]') : []),
      }));
      setGuests(norm);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (isAuth) loadGuests(); }, [isAuth]);

  async function handleDelete(id) {
    if (!confirm('Remover este convidado?')) return;
    const res = await fetch(`/api/guests/${id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    if (res.ok) { setGuests(prev => prev.filter(g => g.id !== id)); showToast('Removido ✓'); }
    else showToast('Erro ao remover');
  }

  async function handleStatusChange(id, newStatus) {
    const res = await fetch(`/api/guests/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setGuests(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
      setEditingId(null);
      showToast('Status atualizado ✓');
    }
  }

  function exportCSV() {
    if (!guests.length) { showToast('Nenhum dado'); return; }
    const rows = [
      'Nome,WhatsApp,Status,Familiares,Data',
      ...guests.map(g => `"${g.nome}","${g.phone}","${g.status}","${(g.acomps||[]).join(' | ')}","${g.created_at}"`),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv;charset=utf-8;' }));
    a.download = 'convidados-williany18.csv';
    a.click();
  }

  const filtered = guests.filter(g => {
    const matchSearch = !search || g.nome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'todos' || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalConf    = guests.filter(g => g.status === 'confirmado').length;
  const totalPessoas = guests.reduce((acc, g) => acc + 1 + (g.acomps?.length || 0), 0);

  // ── Login screen ──
  if (!isAuth) return (
    <div className="page-inner">
      <div className="admin-wrap login">
        <div className="script" style={{ fontSize: '3rem', color: 'var(--rose)', marginBottom: 20 }}>Admin</div>
        <div className="admin-lock">
          <div style={{ fontSize: '2rem', marginBottom: 13 }}>🔐</div>
          <p style={{ fontSize: '.82rem', color: 'var(--text-light)', marginBottom: 16 }}>Digite a senha para acessar o painel</p>
          <div className="field" style={{ margin: '0 auto 14px' }}>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Senha"
              onKeyDown={e => e.key === 'Enter' && login()}
            />
          </div>
          <button className="btn-primary" onClick={login}>Entrar</button>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ──
  return (
    <div className="page-inner">
      <div className="admin-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div className="script" style={{ fontSize: '3rem', color: 'var(--rose)' }}>Admin</div>
          <button onClick={() => setToken('')} style={{ background: 'none', border: '1px solid var(--divider)', borderRadius: 8, padding: '6px 14px', fontSize: '.72rem', color: 'var(--text-light)', cursor: 'pointer', letterSpacing: 1 }}>
            Sair
          </button>
        </div>

        {/* Stats */}
        <div className="guests-stats" style={{ marginBottom: 22 }}>
          <div className="stat"><div className="stat-num">{guests.length}</div><div className="stat-label">Respostas</div></div>
          <div className="stat"><div className="stat-num" style={{ color: '#2d7a4a' }}>{totalConf}</div><div className="stat-label">Confirmados</div></div>
          <div className="stat"><div className="stat-num" style={{ color: 'var(--slate-dark)' }}>{totalPessoas}</div><div className="stat-label">Pessoas</div></div>
          <div className="stat"><div className="stat-num" style={{ color: '#b06020' }}>{guests.filter(g=>g.status==='pendente').length}</div><div className="stat-label">Talvez</div></div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <input
            className="guest-search"
            style={{ flex: 1, minWidth: 160, marginBottom: 0 }}
            placeholder="Buscar convidado…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ background: 'rgba(255,255,255,.78)', border: '1px solid rgba(90,112,128,.22)', borderRadius: 12, padding: '12px 14px', fontSize: '.85rem', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="todos">Todos</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendente">Talvez</option>
            <option value="nao">Não vem</option>
          </select>
          <button className="btn-refresh" onClick={() => loadGuests()} title="Atualizar">↻</button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)', fontSize: '.9rem' }}>Carregando…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: .5 }}>📋</div><p>Nenhum convidado encontrado.</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>Status</th>
                  <th>Fam.</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 400 }}>{g.nome}</td>
                    <td style={{ fontSize: '.8rem', color: 'var(--text-light)' }}>{g.phone}</td>
                    <td>
                      {editingId === g.id ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['confirmado','pendente','nao'].map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(g.id, s)}
                              style={{ fontSize: '.6rem', padding: '3px 8px', borderRadius: 50, border: '1px solid', cursor: 'pointer',
                                background: g.status === s ? 'var(--slate)' : 'transparent',
                                color: g.status === s ? '#fff' : 'var(--text-light)',
                                borderColor: g.status === s ? 'var(--slate)' : 'var(--divider)',
                              }}
                            >{STATUS_LABEL[s]}</button>
                          ))}
                          <button onClick={() => setEditingId(null)} style={{ fontSize: '.65rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </div>
                      ) : (
                        <span
                          className={`guest-badge ${STATUS_CLASS[g.status]}`}
                          onClick={() => setEditingId(g.id)}
                          style={{ cursor: 'pointer' }}
                          title="Clique para editar"
                        >
                          {STATUS_LABEL[g.status]}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '.8rem', color: 'var(--text-light)' }}>
                      {g.acomps?.length ? g.acomps.join(', ') : '—'}
                    </td>
                    <td style={{ fontSize: '.72rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{g.created_at}</td>
                    <td>
                      <button className="btn-del" onClick={() => handleDelete(g.id)}>Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button className="btn-export" onClick={exportCSV}>↓ Exportar CSV</button>
          <button className="btn-clear" onClick={async () => {
            if (!confirm('Apagar TODOS os convidados? Não pode ser desfeito.')) return;
            await Promise.all(guests.map(g => fetch(`/api/guests/${g.id}`, { method: 'DELETE', headers: { 'x-admin-token': token } })));
            setGuests([]);
            showToast('Lista limpa');
          }}>✕ Limpar tudo</button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
const TABS = ['convite', 'confirmar', 'convidados', 'presentes', 'admin'];
const TAB_LABELS = { convite: 'Convite', confirmar: 'Confirmar', convidados: 'Convidados', presentes: 'Presentes', admin: 'Admin' };

export default function Home() {
  const [tab, setTab]       = useState('convite');
  const [visible, setVisible] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function goToTab(t) {
    setVisible(false);
    setTimeout(() => { setTab(t); setVisible(true); }, 200);
  }

  return (
    <>
      <Head>
        <title>Williany faz 18 ✦</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <BgBows />

      <nav>
        {TABS.map(t => (
          <a key={t} className={tab === t ? 'active' : ''} onClick={() => goToTab(t)}>
            {TAB_LABELS[t]}
          </a>
        ))}
      </nav>

      <main style={{
        minHeight: '100vh', paddingTop: 60, position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 80,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity .3s ease, transform .3s ease',
      }}>
        {tab === 'convite'    && <PageConvite     goToConfirmar={() => goToTab('confirmar')} />}
        {tab === 'confirmar'  && <PageConfirmar   showToast={showToast} />}
        {tab === 'convidados' && <PageConvidados  showToast={showToast} />}
        {tab === 'presentes'  && <PagePresentes   />}
        {tab === 'admin'      && <PageAdmin       showToast={showToast} />}
      </main>

      <Toast msg={toastMsg} />

      <style jsx global>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0); }
          50%      { transform: translateY(-10px) rotate(1.5deg); }
        }
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: center;
          background: rgba(238,241,245,0.93);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(90,112,128,0.1);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
        }
        nav::-webkit-scrollbar { display: none; }
        nav a {
          font-size: .67rem; letter-spacing: 2px; text-transform: uppercase;
          text-decoration: none; color: var(--text-light); font-weight: 400;
          padding: 17px 13px; border-bottom: 2px solid transparent;
          transition: color .2s, border-color .2s, background .2s;
          cursor: pointer; white-space: nowrap; user-select: none;
          -webkit-tap-highlight-color: transparent; display: inline-block;
        }
        nav a.active { color: var(--rose); border-bottom-color: var(--rose); background: rgba(158,90,90,.04); }
        nav a:hover:not(.active) { color: var(--slate); background: rgba(90,112,128,.05); }

        .page-inner { width: 100%; display: flex; flex-direction: column; align-items: center; }
        .form-wrap   { width: 100%; max-width: 420px; padding: 46px 28px 20px; }
        .guests-wrap { width: 100%; max-width: 460px; padding: 46px 28px 20px; }
        .gifts-wrap  { width: 100%; max-width: 460px; padding: 46px 28px 20px; }
        .admin-wrap  { width: 100%; max-width: 540px; padding: 46px 28px 20px; }

        .btn-primary {
          background: var(--slate); color: #fff; border: none;
          border-radius: 60px; padding: 14px 46px;
          font-family: inherit; font-size: .7rem;
          letter-spacing: 3px; text-transform: uppercase; cursor: pointer;
          transition: background .25s, transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(46,64,80,.18);
          -webkit-tap-highlight-color: transparent; display: block;
        }
        .btn-primary:hover:not(:disabled) { background: var(--slate-dark); transform: translateY(-2px); box-shadow: 0 8px 26px rgba(46,64,80,.25); }
        .btn-primary:disabled { cursor: not-allowed; }

        .notice-box {
          background: rgba(158,90,90,.07); border: 1px solid rgba(158,90,90,.22);
          border-radius: 14px; padding: 14px 16px; margin-bottom: 22px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .field { margin-bottom: 15px; }
        .field label { display: block; font-size: .65rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); margin-bottom: 7px; font-weight: 400; }
        .field input, .field select {
          width: 100%; background: rgba(255,255,255,.78);
          border: 1px solid rgba(90,112,128,.22); border-radius: 12px;
          padding: 13px 16px; font-family: inherit; font-size: .88rem;
          color: var(--text); outline: none;
          transition: border-color .2s, box-shadow .2s;
          -webkit-appearance: none; appearance: none;
        }
        .field select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a6a78' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; cursor: pointer;
        }
        .field input:focus, .field select:focus { border-color: var(--slate); box-shadow: 0 0 0 3px rgba(90,112,128,.1); }
        .btn-add {
          background: none; border: 1.5px solid var(--bow); border-radius: 10px;
          padding: 0 14px; cursor: pointer; color: var(--slate); font-size: 1.3rem;
          height: 48px; display: flex; align-items: center; justify-content: center;
          transition: background .2s; flex-shrink: 0;
        }
        .btn-add:hover { background: rgba(90,112,128,.08); }
        .chip {
          background: rgba(90,112,128,.1); border-radius: 50px;
          padding: 5px 10px 5px 14px; font-size: .77rem; color: var(--slate-dark);
          display: flex; align-items: center; gap: 5px;
        }
        .chip button { background: none; border: none; cursor: pointer; color: var(--text-light); font-size: 1rem; line-height: 1; padding: 0 2px; transition: color .2s; }
        .chip button:hover { color: var(--rose); }
        .msg-success {
          background: linear-gradient(135deg,#e8f4ed,#d4ebe0);
          border: 1px solid #a8d4b8; border-radius: 16px;
          padding: 22px 20px; text-align: center; margin-top: 20px;
          animation: fadeUp .5s ease both;
        }

        .guests-stats { display: flex; gap: 11px; flex-wrap: wrap; }
        .stat { background: rgba(255,255,255,.78); border-radius: 14px; padding: 13px 16px; flex: 1; min-width: 80px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,.06); }
        .stat-num { font-size: 1.85rem; font-weight: 600; color: var(--slate-dark); }
        .stat-label { font-size: .64rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-light); }
        .guest-search { width: 100%; background: rgba(255,255,255,.78); border: 1px solid rgba(90,112,128,.2); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: .87rem; outline: none; margin-bottom: 13px; transition: border-color .2s; }
        .guest-search:focus { border-color: var(--slate); }

        .guest-badge { font-size: .6rem; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 50px; font-weight: 500; flex-shrink: 0; display: inline-block; }
        .badge-confirmado { background: #e0f2e8; color: #2d7a4a; }
        .badge-pendente   { background: #fff3e0; color: #b06020; }
        .badge-nao        { background: #fce8e8; color: #9e3030; }
        .empty-state { text-align: center; padding: 50px 20px; color: var(--text-light); font-size: .9rem; }

        .gift-card {
          background: rgba(255,255,255,.78); border: 1px solid rgba(90,112,128,.12);
          border-radius: 16px; padding: 16px 17px; flex: 1; min-width: 140px;
          transition: transform .2s, box-shadow .2s;
        }
        .gift-card:hover { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(90,112,128,.12); }
        .gift-card.highlight { background: linear-gradient(135deg,rgba(255,240,245,.92),rgba(245,230,240,.92)); border-color: rgba(158,90,90,.18); }
        .gift-card.silver    { background: linear-gradient(135deg,rgba(234,238,245,.92),rgba(224,230,242,.92)); border-color: rgba(90,112,128,.2); }
        .gc-tag { display: inline-block; background: rgba(90,112,128,.1); color: var(--slate-dark); border-radius: 50px; padding: 3px 10px; font-size: .7rem; font-weight: 500; letter-spacing: .4px; }
        .gc-tag.tag-rose   { background: rgba(158,90,90,.1); color: var(--rose); }
        .gc-tag.tag-silver { background: rgba(90,112,128,.12); color: var(--slate-dark); }
        .gifts-note { background: rgba(158,90,90,.06); border: 1px solid rgba(158,90,90,.15); border-radius: 14px; padding: 15px 17px; margin-top: 8px; font-size: .8rem; color: var(--rose); line-height: 1.6; display: flex; gap: 10px; align-items: flex-start; }

        .admin-lock {
          background: rgba(255,255,255,.75);
          border-radius: 20px; padding: 30px 24px;
          text-align: center; border: 1px solid rgba(90,112,128,.14);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .admin-lock .field { width: 100%; max-width: 320px; margin: 0; }
        .admin-lock .btn-primary { display: inline-block; width: auto; padding: 10px 30px; }
        .admin-wrap.login { min-height: calc(100vh - 80px); display:flex; align-items:center; justify-content:center; }
        table { width: 100%; border-collapse: collapse; font-size: .79rem; }
        th { font-size: .62rem; letter-spacing: 2px; text-transform: uppercase; color: var(--text-light); padding: 9px 10px; text-align: left; border-bottom: 1.5px solid var(--divider); font-weight: 400; }
        td { padding: 11px 10px; border-bottom: 1px solid rgba(90,112,128,.07); color: var(--text); vertical-align: middle; }
        tr:hover td { background: rgba(255,255,255,.5); }
        .btn-del { background: none; border: 1px solid #e0a0a0; color: var(--rose); border-radius: 8px; padding: 4px 10px; font-size: .7rem; cursor: pointer; transition: background .2s; }
        .btn-del:hover { background: #fde8e8; }
        .btn-refresh { background: none; border: 1.5px solid var(--divider); border-radius: 10px; padding: 0 14px; height: 46px; color: var(--slate); font-size: 1.1rem; cursor: pointer; transition: background .2s; }
        .btn-refresh:hover { background: rgba(90,112,128,.08); }
        .btn-export, .btn-clear { display: inline-flex; align-items: center; gap: 7px; border-radius: 12px; padding: 10px 17px; font-family: inherit; font-size: .7rem; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: background .2s; }
        .btn-export { background: none; border: 1.5px solid var(--slate); color: var(--slate); }
        .btn-export:hover { background: rgba(90,112,128,.08); }
        .btn-clear { background: none; border: 1.5px solid #e0a0a0; color: var(--rose); }
        .btn-clear:hover { background: #fde8e8; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:380px){ nav a{font-size:.6rem;letter-spacing:1.4px;padding:15px 9px} }
      `}</style>
    </>
  );
}
