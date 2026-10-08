'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Lock, ArrowRight } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // O utilizador já chega autenticado pelo link do e-mail
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setMessage('Erro ao atualizar: ' + error.message);
      setLoading(false);
    } else {
      setMessage('Senha atualizada com sucesso!');
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  return (
    <div className="portage-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAF8' }}>
      <form onSubmit={handleUpdatePassword} style={{ background: '#FFF', padding: '40px', borderRadius: '16px', border: '1px solid #E5EDE8', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2420', marginBottom: '8px' }}>Nova Senha</h1>
        <p style={{ fontSize: '0.88rem', color: '#627268', marginBottom: '24px' }}>Digite a sua nova senha de acesso clínico seguro.</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#46534B' }}>Senha Segura</label>
          <div style={{ position: 'relative', marginTop: '6px' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: '#83938A' }} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '8px', border: '1px solid #D2DDD6', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {message && (
          <div style={{ fontSize: '0.85rem', color: message.includes('Erro') ? '#DC2626' : '#15803D', marginBottom: '16px', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '12px', background: '#26533A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
        >
          {loading ? 'A atualizar...' : 'Confirmar Nova Senha'} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}