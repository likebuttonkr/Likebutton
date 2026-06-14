'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchChannels, YoutubeChannel } from '../lib/youtube';
import { INSTAGRAM_MOCK_PROFILES, InstagramProfile } from '../lib/instagram';
import { TIKTOK_MOCK_PROFILES, TikTokProfile } from '../lib/tiktok';
import { Search, Filter, Star, Users, ChevronDown, X, RotateCcw, TrendingUp } from 'lucide-react';

const CATEGORIES = {
  '뷰티/패션': { icon: '💄', sub: ['메이크업', '스킨케어', '패션/코디', '헤어'] },
  '음식/요리': { icon: '🍳', sub: ['요리 레시피', '먹방', '카페/디저트', '다이어트 식단'] },
  '게임': { icon: '🎮', sub: ['FPS', 'RPG', '모바일게임', '스트리밍'] },
  '여행': { icon: '✈️', sub: ['국내여행', '해외여행', '캠핑', '맛집투어'] },
  '운동/스포츠': { icon: '💪', sub: ['헬스/피트니스', '필라테스/요가', '스포츠', '다이어트'] },
  '엔터테인먼트': { icon: '🎬', sub: ['드라마/영화', '음악', '코미디', '버라이어티'] },
  'IT/테크': { icon: '💻', sub: ['스마트폰', '가전제품', '앱/소프트웨어', '개발'] },
  '교육': { icon: '📚', sub: ['영어', '자격증', '입시', '직무교육'] },
  '라이프스타일': { icon: '🏠', sub: ['인테리어', '반려동물', '육아', '자기계발'] },
  '경제/비즈니스': { icon: '💰', sub: ['주식/투자', '창업', '부동산', '재테크'] },
};

const SUBSCRIBER_FILTERS = ['1천 미만', '1천~1만', '1만~5만', '5만~10만', '10만~30만', '30만~50만', '50만~100만', '100만 이상'];
const AGE_FILTERS = ['13~17세', '18~24세', '25~34세', '35~44세', '45~54세', '55~64세', '65세 이상'];
const GENDER_FILTERS = ['여성', '남성'];
const VIEW_FILTERS = ['1천 미만', '1천~1만', '1만~5만', '5만~10만', '10만~30만', '30만~50만', '50만~100만', '100만 이상'];
const BUDGET_FILTERS = ['100만원 미만', '100만원~300만원', '300만원~500만원', '500만원~1,000만원', '1,000만원~1,500만원', '1,500만원 이상'];
const SORT_OPTIONS = ['구독자수 많은순', '구독자수 적은순', '평점 높은순', '가격 낮은순', '가격 높은순'];
const PLATFORM_TABS = ['유튜브', '인스타그램', '틱톡'];
const TOP_TABS = ['전체 카테고리', 'Top 100', '급상승 인플루언서'];

function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${selected ? '#FF2D55' : 'var(--border)'}`, background: selected ? 'rgba(255,45,85,0.1)' : 'transparent', color: selected ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontWeight: selected ? 600 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const initialQuery = params.get('q') || '';
  const [platform, setPlatform] = useState('유튜브');
  const [topTab, setTopTab] = useState('전체 카테고리');
  const [query, setQuery] = useState(initialQuery);
  const [inputVal, setInputVal] = useState(initialQuery);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [igProfiles, setIgProfiles] = useState<InstagramProfile[]>(INSTAGRAM_MOCK_PROFILES);
  const [ttProfiles, setTtProfiles] = useState<TikTokProfile[]>(TIKTOK_MOCK_PROFILES);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [autoCompleteList, setAutoCompleteList] = useState<string[]>([]);
  const [isAdvertiser, setIsAdvertiser] = useState(false);

  useEffect(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        supabase.from('profiles').select('user_type').eq('id', session.user.id).single()
          .then(({ data }) => { if (data?.user_type === 'advertiser') setIsAdvertiser(true); });
      });
    });
  }, []);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  // 필터 카테고리
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategorySelected, setAllCategorySelected] = useState(true);
  const [categorySearchVal, setCategorySearchVal] = useState('');
  const [showCategoryAC, setShowCategoryAC] = useState(false);
  const [categoryACList, setCategoryACList] = useState<string[]>([]);
  // 광고비 직접입력
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  const CATEGORY_KEYWORDS = [
    '뷰티', '메이크업', '스킨케어', '헤어', '네일',
    '게임', 'FPS게임', '모바일게임', 'RPG',
    '음식', '먹방', '요리', '베이킹', '카페',
    '여행', '해외여행', '국내여행', '캠핑',
    '운동', '헬스', '요가', '필라테스', '러닝',
    'IT', '테크', '스마트폰', '노트북', '앱리뷰',
    '패션', '코디', '하울', '명품',
    '교육', '영어', '자격증', '독서',
    '라이프스타일', '육아', '반려동물', '인테리어',
    '엔터', '음악', '댄스', '영화', '드라마',
  ];

  const handleCategoryInput = (val: string) => {
    setCategorySearchVal(val);
    if (val.length > 0) {
      const filtered = CATEGORY_KEYWORDS.filter(k => k.includes(val) && !selectedCategories.includes(k)).slice(0, 8);
      setCategoryACList(filtered);
      setShowCategoryAC(filtered.length > 0);
    } else {
      setShowCategoryAC(false);
    }
  };

  const addCategory = (cat: string) => {
    if (!selectedCategories.includes(cat)) {
      setSelectedCategories(prev => [...prev, cat]);
      setAllCategorySelected(false);
    }
    setCategorySearchVal('');
    setShowCategoryAC(false);
  };

  const removeCategory = (cat: string) => {
    const next = selectedCategories.filter(c => c !== cat);
    setSelectedCategories(next);
    if (next.length === 0) setAllCategorySelected(true);
  };

  const handleSearchInput = (val: string) => {
    setQuery(val);
    if (val.length > 0) {
      const filtered = CATEGORY_KEYWORDS.filter(k => k.includes(val)).slice(0, 6);
      setAutoCompleteList(filtered);
      setShowAutoComplete(filtered.length > 0);
    } else {
      setShowAutoComplete(false);
    }
  };
  const [sortBy, setSortBy] = useState('구독자수 많은순');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  // Filters
  const [subFilters, setSubFilters] = useState<string[]>([]);
  const [ageFilters, setAgeFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [viewFilters, setViewFilters] = useState<string[]>([]);
  const [budgetFilters, setBudgetFilters] = useState<string[]>([]);

  const totalFilters = subFilters.length + ageFilters.length + genderFilters.length + viewFilters.length + budgetFilters.length + selectedCategories.length + (budgetMin || budgetMax ? 1 : 0);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const resetFilters = () => {
    setSubFilters([]); setAgeFilters([]); setGenderFilters([]); setViewFilters([]); setBudgetFilters([]);
  };

  useEffect(() => {
    const searchTerm = query || selectedCategory || (topTab === 'Top 100' ? '유튜브 인기' : topTab === '급상승 인플루언서' ? '급상승 유튜브' : '한국 유튜브');
    if (!searchTerm) return;
    setLoading(true);
    searchChannels(searchTerm, 12).then(data => { setChannels(data); setLoading(false); });
  }, [query, selectedCategory, topTab]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px' }}>
      {/* Platform tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {PLATFORM_TABS.map(tab => (
          <button key={tab} onClick={() => setPlatform(tab)}
            style={{ padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, background: platform === tab ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card)', color: platform === tab ? 'white' : 'var(--text-muted)', border: platform === tab ? 'none' : '1px solid var(--border)', transition: 'all 0.2s' }}>
            {tab === '유튜브' ? '📺' : tab === '인스타그램' ? '📸' : '🎵'} {tab}

          </button>
        ))}
      </div>

      {platform === '인스타그램' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>인스타그램 인플루언서 <strong style={{ color: '#FF2D55' }}>{igProfiles.length}명</strong></p>
            <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>✓ 서비스 운영중</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill, minmax(220px,1fr))', gap: isMobile ? 10 : 14 }}>
            {igProfiles.map(p => (
              <Link key={p.id} href={`/influencer/instagram/${p.id}`} style={{ textDecoration: 'none', display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <img src={p.avatar_url} alt={p.display_name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{p.display_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{p.username}</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.bio_description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>팔로워</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.followersFormatted}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>최소광고비</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#FF2D55' }}>{p.estimatedPrice}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 10, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>📸 인스타그램</span>
                  <span style={{ fontSize: 10, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 20 }}>{p.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : platform === '틱톡' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>틱톡 인플루언서 <strong style={{ color: '#FF2D55' }}>{ttProfiles.length}명</strong></p>
            <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>✓ 서비스 운영중</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill, minmax(220px,1fr))', gap: isMobile ? 10 : 14 }}>
            {ttProfiles.map(p => (
              <Link key={p.id} href={`/influencer/tiktok/${p.id}`} style={{ textDecoration: 'none', display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <img src={p.avatar_url} alt={p.display_name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{p.display_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{p.username}</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.bio_description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>팔로워</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.followersFormatted}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>최소광고비</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#FF2D55' }}>{p.estimatedPrice}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.3)', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>🎵 틱톡</span>
                  <span style={{ fontSize: 10, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 20 }}>{p.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: 16 }}>
          {/* Left sidebar - category tree */}
          {!isMobile && <aside>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', position: 'sticky', top: 88 }}>
              {TOP_TABS.map(tab => (
                <button key={tab} onClick={() => { setTopTab(tab); setSelectedCategory(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 14px', border: 'none', cursor: 'pointer', background: topTab === tab && !selectedCategory ? 'rgba(255,45,85,0.08)' : 'transparent', color: topTab === tab && !selectedCategory ? '#FF2D55' : 'var(--text-muted)', borderLeft: topTab === tab && !selectedCategory ? '3px solid #FF2D55' : '3px solid transparent', textAlign: 'left', fontSize: 13, fontWeight: topTab === tab && !selectedCategory ? 700 : 400, borderBottom: '1px solid var(--border)' }}>
                  {tab === 'Top 100' ? '🏆' : tab === '급상승 인플루언서' ? '🚀' : '📋'} {tab}
                </button>
              ))}
              <div style={{ padding: '8px' }}>
                {Object.entries(CATEGORIES).map(([cat, { icon, sub }]) => (
                  <div key={cat}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', cursor: 'pointer', borderRadius: 6, background: selectedCategory === cat ? 'rgba(255,45,85,0.08)' : 'transparent' }}
                      onClick={() => { setSelectedCategory(cat); setTopTab(''); }}>
                      <span style={{ fontSize: 13, fontWeight: selectedCategory === cat ? 700 : 400, color: selectedCategory === cat ? '#FF2D55' : 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {icon} {cat}
                      </span>
                      <button onClick={e => { e.stopPropagation(); setExpandedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px', fontSize: 12 }}>
                        {expandedCats.includes(cat) ? '▲' : '▼'}
                      </button>
                    </div>
                    {expandedCats.includes(cat) && sub.map(s => (
                      <button key={s} onClick={() => { setSelectedCategory(s); setTopTab(''); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 6px 6px 28px', fontSize: 12, border: 'none', cursor: 'pointer', borderRadius: 6, background: selectedCategory === s ? 'rgba(255,45,85,0.08)' : 'transparent', color: selectedCategory === s ? '#FF2D55' : 'var(--text-muted)' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </aside>}

          {/* Main content */}
          <div>
            {/* Search bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input value={inputVal}
                  onChange={e => { setInputVal(e.target.value); handleSearchInput(e.target.value); }}
                  onKeyDown={e => { if (e.key === 'Enter') { setQuery(inputVal); setShowAutoComplete(false); } }}
                  onBlur={() => setTimeout(() => setShowAutoComplete(false), 150)}
                  onFocus={() => inputVal && handleSearchInput(inputVal)}
                  placeholder="채널명, 카테고리로 검색..." style={{ paddingLeft: 38, fontSize: 14, height: 42 }} />
                {showAutoComplete && autoCompleteList.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, zIndex: 100, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginTop: 4 }}>
                    {autoCompleteList.map(keyword => (
                      <button key={keyword} onMouseDown={() => { setInputVal(keyword); setQuery(keyword); setShowAutoComplete(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 14, color: 'var(--text)', textAlign: 'left' }}>
                        <Search size={13} color="var(--text-muted)" />
                        <span>{keyword}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setQuery(inputVal)} style={{ padding: '0 20px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>검색</button>
              <button onClick={() => setFilterOpen(!filterOpen)}
                style={{ padding: '0 14px', background: filterOpen ? 'rgba(255,45,85,0.1)' : 'var(--bg-card)', border: `1px solid ${filterOpen ? '#FF2D55' : 'var(--border)'}`, color: filterOpen ? '#FF2D55' : 'var(--text)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                <Filter size={14} /> 필터 {totalFilters > 0 && <span style={{ background: '#FF2D55', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{totalFilters}</span>}
              </button>
            </div>

            {/* Filter panel */}
            {filterOpen && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 16, overflow: 'hidden' }}>
                {/* 필터 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Filter size={15} color="#FF2D55" />
                    <p style={{ fontWeight: 700, fontSize: 14 }}>필터</p>
                    {totalFilters > 0 && <span style={{ background: '#FF2D55', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{totalFilters}개 선택</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                      <RotateCcw size={11} /> 초기화
                    </button>
                    <button onClick={() => setFilterOpen(false)} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                      적용하기
                    </button>
                  </div>
                </div>
                {/* 필터 내용 */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* 구독자 수 */}
                  {[
                    { label: '구독자 수', items: SUBSCRIBER_FILTERS, selected: subFilters, setter: setSubFilters },
                    { label: '구독자 연령', items: AGE_FILTERS, selected: ageFilters, setter: setAgeFilters },
                    { label: '구독자 성별', items: GENDER_FILTERS, selected: genderFilters, setter: setGenderFilters },
                    { label: '예상 조회수', items: VIEW_FILTERS, selected: viewFilters, setter: setViewFilters },
                  ].map(group => (
                    <div key={group.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 80, paddingTop: 5, flexShrink: 0 }}>{group.label}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
                        {group.items.map(f => <FilterChip key={f} label={f} selected={group.selected.includes(f)} onClick={() => toggle(group.selected, group.setter, f)} />)}
                      </div>
                    </div>
                  ))}

                  {/* 광고비 예산 */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 80, paddingTop: 5, flexShrink: 0 }}>광고비 예산</p>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {BUDGET_FILTERS.map(f => <FilterChip key={f} label={f} selected={budgetFilters.includes(f)} onClick={() => toggle(budgetFilters, setBudgetFilters, f)} />)}
                      </div>
                      {/* 최소/최대 직접 입력 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input value={budgetMin} onChange={e => setBudgetMin(e.target.value)}
                          placeholder="최소 금액" type="number"
                          style={{ width: 120, fontSize: 12, padding: '6px 10px', height: 'auto' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>~</span>
                        <input value={budgetMax} onChange={e => setBudgetMax(e.target.value)}
                          placeholder="최대 금액" type="number"
                          style={{ width: 120, fontSize: 12, padding: '6px 10px', height: 'auto' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>원</span>
                      </div>
                    </div>
                  </div>

                  {/* 카테고리 */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 80, paddingTop: 5, flexShrink: 0 }}>카테고리</p>
                    <div style={{ flex: 1 }}>
                      {/* 전체 카테고리 버튼 */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => { setAllCategorySelected(true); setSelectedCategories([]); }}
                          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${allCategorySelected ? '#FF2D55' : 'var(--border)'}`, background: allCategorySelected ? 'rgba(255,45,85,0.1)' : 'transparent', color: allCategorySelected ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: allCategorySelected ? 700 : 400, cursor: 'pointer' }}>
                          전체 카테고리
                        </button>
                        {selectedCategories.map(cat => (
                          <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, fontSize: 12, color: '#FF2D55', fontWeight: 600 }}>
                            {cat}
                            <button onClick={() => removeCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF2D55', padding: 0, display: 'flex', alignItems: 'center' }}>
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                      {/* 카테고리 검색 자동완성 */}
                      <div style={{ position: 'relative' }}>
                        <input value={categorySearchVal}
                          onChange={e => handleCategoryInput(e.target.value)}
                          onBlur={() => setTimeout(() => setShowCategoryAC(false), 150)}
                          placeholder="카테고리를 검색하세요"
                          style={{ width: '100%', fontSize: 13, padding: '8px 12px', height: 'auto', boxSizing: 'border-box' }} />
                        {showCategoryAC && categoryACList.length > 0 && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 50, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', marginTop: 4 }}>
                            {categoryACList.map(cat => (
                              <button key={cat} onMouseDown={() => addCategory(cat)}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--text)', textAlign: 'left' }}>
                                <Search size={11} color="var(--text-muted)" />
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active filters */}
            {totalFilters > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {[...subFilters, ...ageFilters, ...genderFilters, ...viewFilters, ...budgetFilters].map(f => (
                  <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, fontSize: 12, color: '#FF2D55' }}>
                    {f}
                    <button onClick={() => {
                      if (subFilters.includes(f)) toggle(subFilters, setSubFilters, f);
                      else if (ageFilters.includes(f)) toggle(ageFilters, setAgeFilters, f);
                      else if (genderFilters.includes(f)) toggle(genderFilters, setGenderFilters, f);
                      else if (viewFilters.includes(f)) toggle(viewFilters, setViewFilters, f);
                      else toggle(budgetFilters, setBudgetFilters, f);
                    }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF2D55', padding: 0, display: 'flex' }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button onClick={resetFilters} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>전체 해제</button>
              </div>
            )}

            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {selectedCategory ? <><strong style={{ color: 'var(--text)' }}>{selectedCategory}</strong> 카테고리 </> : query ? <><strong style={{ color: 'var(--text)' }}>"{query}"</strong> 검색 결과 </> : <strong style={{ color: 'var(--text)' }}>{topTab} </strong>}
                <strong style={{ color: '#FF2D55' }}>{channels.length}건</strong>
              </p>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setSortOpen(!sortOpen)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  {sortBy} <ChevronDown size={14} />
                </button>
                {sortOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 160, zIndex: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', background: sortBy === opt ? 'rgba(255,45,85,0.1)' : 'transparent', color: sortBy === opt ? '#FF2D55' : 'var(--text)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? 10 : 14 }}>
                {[...Array(6)].map((_, i) => <div key={i} style={{ height: 180, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }} />)}
              </div>
            ) : channels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>검색 결과가 없어요</p>
                <p style={{ fontSize: 14 }}>다른 검색어나 카테고리를 시도해보세요</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? 10 : 14 }}>
                {channels.map((ch, idx) => (
                  <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 18, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {(topTab === 'Top 100' || topTab === '급상승 인플루언서') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <span style={{ width: 24, height: 24, borderRadius: 6, background: idx < 3 ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: idx < 3 ? 'white' : 'var(--text-muted)' }}>{idx + 1}</span>
                          {topTab === '급상승 인플루언서' && <span style={{ fontSize: 11, color: '#00C896', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}><TrendingUp size={10} /> 상승중</span>}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                        <img src={ch.thumbnail} alt={ch.title} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{ch.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, background: 'rgba(255,45,85,0.12)', color: '#FF2D55', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>유튜브</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Users size={9} />{ch.subscriberCount}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{ch.description || '채널 설명이 없습니다.'}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={11} fill="#FFB800" color="#FFB800" />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{ch.rating}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({ch.reviewCount})</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#FF2D55', fontWeight: 700 }}>{ch.estimatedPrice}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
