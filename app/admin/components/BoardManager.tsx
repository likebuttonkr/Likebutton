'use client';
import { showToast } from '../../components/Toast';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

// 공지사항
function NoticeManager() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  const save = async () => {
    if (!form.title || !form.content) { alert('제목과 내용을 입력해주세요.'); return; }
    if (editId) {
      await supabase.from('notices').update(form).eq('id', editId);
    } else {
      await supabase.from('notices').insert(form);
    }
    setForm({ title: '', content: '' }); setShowForm(false); setEditId(null); load();
  };
  const del = async (id: number) => {
    if (!confirm('삭제하시겠어요?')) return;
    await supabase.from('notices').delete().eq('id', id); load();
  };
  const edit = (item: any) => { setForm({ title: item.title, content: item.content }); setEditId(item.id); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>공지사항 관리</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> 공지사항 등록
        </button>
      </div>
      {showForm && (
        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>제목</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="제목 입력" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>내용</label>
            <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="내용 입력"
              style={{ width: '100%', minHeight: 120, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editId ? '수정' : '등록'}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
              {['No.', '제목', '등록일', '관리'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>등록된 공지사항이 없어요</td></tr>
            ) : list.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{list.length - i}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.title}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => edit(item)} style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>수정</button>
                    <button onClick={() => del(item.id)} style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 이벤트
function EventManager() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '', start_date: '', end_date: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  const save = async () => {
    if (!form.title) { alert('제목을 입력해주세요.'); return; }
    if (editId) await supabase.from('events').update(form).eq('id', editId);
    else await supabase.from('events').insert(form);
    setForm({ title: '', content: '', start_date: '', end_date: '' }); setShowForm(false); setEditId(null); load();
  };
  const del = async (id: number) => { if (!confirm('삭제?')) return; await supabase.from('events').delete().eq('id', id); load(); };
  const edit = (item: any) => { setForm({ title: item.title, content: item.content, start_date: item.start_date || '', end_date: item.end_date || '' }); setEditId(item.id); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>이벤트 관리</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '', start_date: '', end_date: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> 이벤트 등록
        </button>
      </div>
      {showForm && (
        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>제목</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="이벤트 제목" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>시작일</label><input type="date" value={form.start_date} onChange={e => setForm(f => ({...f, start_date: e.target.value}))} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>종료일</label><input type="date" value={form.end_date} onChange={e => setForm(f => ({...f, end_date: e.target.value}))} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>내용</label>
            <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="이벤트 내용"
              style={{ width: '100%', minHeight: 100, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editId ? '수정' : '등록'}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '제목', '기간', '등록일', '관리'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.length === 0 ? <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>등록된 이벤트가 없어요</td></tr>
            : list.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{list.length - i}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.title}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{item.start_date || '-'} ~ {item.end_date || '-'}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => edit(item)} style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>수정</button>
                    <button onClick={() => del(item.id)} style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// FAQ
function FAQManager() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  const save = async () => {
    if (!form.question || !form.answer) { alert('질문과 답변을 입력해주세요.'); return; }
    if (editId) await supabase.from('faqs').update(form).eq('id', editId);
    else await supabase.from('faqs').insert(form);
    setForm({ question: '', answer: '' }); setShowForm(false); setEditId(null); load();
  };
  const del = async (id: number) => { if (!confirm('삭제?')) return; await supabase.from('faqs').delete().eq('id', id); load(); };
  const edit = (item: any) => { setForm({ question: item.question, answer: item.answer }); setEditId(item.id); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>FAQ 관리</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ question: '', answer: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> FAQ 등록
        </button>
      </div>
      {showForm && (
        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 10 }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>질문</label><input value={form.question} onChange={e => setForm(f => ({...f, question: e.target.value}))} placeholder="자주 묻는 질문" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>답변</label>
            <textarea value={form.answer} onChange={e => setForm(f => ({...f, answer: e.target.value}))} placeholder="답변 내용"
              style={{ width: '100%', minHeight: 100, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editId ? '수정' : '등록'}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '질문', '등록일', '관리'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.length === 0 ? <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>등록된 FAQ가 없어요</td></tr>
            : list.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{list.length - i}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.question}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => edit(item)} style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>수정</button>
                    <button onClick={() => del(item.id)} style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Q&A 관리
function QnAManager() {
  const [list, setList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number|null>(null);
  const [answer, setAnswer] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('qna').select('*, profiles(name, email)').order('created_at', { ascending: false });
    setList(data || []);
  };
  const saveAnswer = async (id: number) => {
    await supabase.from('qna').update({ answer, status: '답변완료', answered_at: new Date().toISOString() }).eq('id', id);
    setSelectedId(null); setAnswer(''); load();
  };
  const deleteQna = async (id: number) => { if (!confirm('삭제?')) return; await supabase.from('qna').delete().eq('id', id); load(); };

  const filtered = filterStatus === '전체' ? list : list.filter(q => q.status === filterStatus);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>Q&A 관리</h2>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
          {['전체', '답변대기', '답변완료'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '질문인', '분류', '문의 제목', '등록일', '답변여부', '관리'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Q&A가 없어요</td></tr>
            : filtered.map((item, i) => (
              <>
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                  <td style={{ padding: '10px 14px' }}>{item.profiles?.name || item.profiles?.email || '-'}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20 }}>{item.category}</span></td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.status === '답변완료' ? '#00C896' : '#FFB800', background: item.status === '답변완료' ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 8px', borderRadius: 20 }}>{item.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setSelectedId(selectedId === item.id ? null : item.id); setAnswer(item.answer || ''); }}
                        style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>답변</button>
                      <button onClick={() => deleteQna(item.id)} style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>
                    </div>
                  </td>
                </tr>
                {selectedId === item.id && (
                  <tr key={`answer-${item.id}`} style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,200,150,0.03)' }}>
                    <td colSpan={7} style={{ padding: '12px 14px' }}>
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>문의 내용: {item.content}</p>
                      </div>
                      <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="답변 내용을 입력하세요"
                        style={{ width: '100%', minHeight: 80, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', marginBottom: 8 }} />
                      <button onClick={() => saveAnswer(item.id)}
                        style={{ padding: '7px 16px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>답변 등록</button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 약관 관리
function TermsManager() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('terms').select('*').order('created_at', { ascending: false });
    setList(data || []);
  };
  const save = async () => {
    if (!form.title || !form.content) { alert('제목과 내용을 입력해주세요.'); return; }
    if (editId) await supabase.from('terms').update(form).eq('id', editId);
    else await supabase.from('terms').insert(form);
    setForm({ title: '', content: '' }); setShowForm(false); setEditId(null); load();
  };
  const del = async (id: number) => { if (!confirm('삭제?')) return; await supabase.from('terms').delete().eq('id', id); load(); };
  const edit = (item: any) => { setForm({ title: item.title, content: item.content }); setEditId(item.id); setShowForm(true); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>약관 관리</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', content: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> 약관 등록
        </button>
      </div>
      {showForm && (
        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 10 }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>약관 제목</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="약관 제목" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>약관 내용</label>
            <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} placeholder="약관 내용"
              style={{ width: '100%', minHeight: 150, padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editId ? '수정' : '등록'}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '제목', '등록일', '관리'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.length === 0 ? <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>등록된 약관이 없어요</td></tr>
            : list.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{list.length - i}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.title}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => edit(item)} style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>수정</button>
                    <button onClick={() => del(item.id)} style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { NoticeManager, EventManager, FAQManager, QnAManager, TermsManager };
