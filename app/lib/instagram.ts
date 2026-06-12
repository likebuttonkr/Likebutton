// Instagram Graph API 연동
// 참고: Instagram API는 비즈니스/크리에이터 계정만 조회 가능
// 일반 계정은 접근 불가 (Meta 정책)

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  display_name: string;
  biography: string;
  bio_description: string;
  avatar_url: string;
  followers_count: number;
  media_count: number;
  profile_picture_url: string;
  website: string;
  account_type: string;
  // 가공 필드
  followersFormatted: string;
  rating: string;
  reviewCount: string;
  estimatedPrice: string;
  category: string;
}

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
}

// 팔로워 수 포맷
function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toString();
}

// 예상 광고비 계산 (팔로워 기반)
function estimatePrice(followers: number): string {
  if (followers >= 1000000) return '1,000만원~';
  if (followers >= 500000) return '500만원~';
  if (followers >= 100000) return '100만원~';
  if (followers >= 50000) return '50만원~';
  if (followers >= 10000) return '10만원~';
  return '협의';
}

// Instagram 사용자 프로필 조회 (액세스 토큰 필요)
export async function getInstagramProfile(accessToken: string, userId: string = 'me'): Promise<InstagramProfile | null> {
  try {
    const fields = 'id,username,name,biography,followers_count,media_count,profile_picture_url,website,account_type';
    const res = await fetch(
      `https://graph.instagram.com/${userId}?fields=${fields}&access_token=${accessToken}`
    );
    if (!res.ok) return null;
    const data = await res.json();

    return {
      ...data,
      followersFormatted: formatFollowers(data.followers_count || 0),
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      reviewCount: String(Math.floor(Math.random() * 50) + 5),
      estimatedPrice: estimatePrice(data.followers_count || 0),
      category: '인스타그램',
    };
  } catch {
    return null;
  }
}

// Instagram 미디어 목록 조회
export async function getInstagramMedia(accessToken: string, limit: number = 9): Promise<InstagramMedia[]> {
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp';
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Instagram OAuth 로그인 URL 생성
export function getInstagramAuthUrl(redirectUri: string): string {
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const scope = 'instagram_basic,instagram_content_publish,pages_show_list';
  return `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
}

// 인스타그램 목업 데이터 (API 승인 전까지 사용)
export const INSTAGRAM_MOCK_PROFILES: InstagramProfile[] = [
  {
    id: 'ig_1', username: 'beauty_kr', name: '뷰티인플루언서 김미소',
    display_name: '뷰티인플루언서 김미소', bio_description: '뷰티, 패션, 라이프스타일 | 협찬/광고 문의 DM', avatar_url: 'https://i.pravatar.cc/150?img=1',
    biography: '뷰티, 패션, 라이프스타일 | 협찬/광고 문의 DM',
    followers_count: 285000, media_count: 342,
    profile_picture_url: 'https://i.pravatar.cc/150?img=1',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '28.5만', rating: '4.8',
    reviewCount: '32', estimatedPrice: '100만원~', category: '뷰티/패션',
  },
  {
    id: 'ig_2', username: 'food_korea', name: '맛집탐방 이지호',
    display_name: '맛집탐방 이지호', bio_description: '서울 맛집 | 먹스타그램 | 광고문의 DM', avatar_url: 'https://i.pravatar.cc/150?img=2',
    biography: '서울 맛집 | 먹스타그램 | 광고문의 DM',
    followers_count: 156000, media_count: 521,
    profile_picture_url: 'https://i.pravatar.cc/150?img=2',
    website: '', account_type: 'CREATOR',
    followersFormatted: '15.6만', rating: '4.7',
    reviewCount: '18', estimatedPrice: '50만원~', category: '음식',
  },
  {
    id: 'ig_3', username: 'fitness_seoul', name: '피트니스 박강민',
    display_name: '피트니스 박강민', bio_description: '헬스 | 다이어트 | 운동루틴 공유', avatar_url: 'https://i.pravatar.cc/150?img=3',
    biography: '헬스 | 다이어트 | 운동루틴 공유',
    followers_count: 98000, media_count: 215,
    profile_picture_url: 'https://i.pravatar.cc/150?img=3',
    website: '', account_type: 'CREATOR',
    followersFormatted: '9.8만', rating: '4.9',
    reviewCount: '41', estimatedPrice: '50만원~', category: '운동/스포츠',
  },
  {
    id: 'ig_4', username: 'travel_with_me', name: '여행하는 최수빈',
    display_name: '여행하는 최수빈', bio_description: '세계여행 중 🌍 | 여행 팁 공유', avatar_url: 'https://i.pravatar.cc/150?img=4',
    biography: '세계여행 중 🌍 | 여행 팁 공유',
    followers_count: 432000, media_count: 689,
    profile_picture_url: 'https://i.pravatar.cc/150?img=4',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '43.2만', rating: '4.6',
    reviewCount: '55', estimatedPrice: '100만원~', category: '여행',
  },
  {
    id: 'ig_5', username: 'fashion_daily', name: '패션 데일리 윤서연',
    display_name: '패션 데일리 윤서연', bio_description: '데일리룩 | 코디 | 쇼핑정보', avatar_url: 'https://i.pravatar.cc/150?img=5',
    biography: '데일리룩 | 코디 | 쇼핑정보',
    followers_count: 72000, media_count: 445,
    profile_picture_url: 'https://i.pravatar.cc/150?img=5',
    website: '', account_type: 'CREATOR',
    followersFormatted: '7.2만', rating: '4.5',
    reviewCount: '23', estimatedPrice: '50만원~', category: '패션',
  },
  {
    id: 'ig_6', username: 'interior_life', name: '인테리어 한지민',
    display_name: '인테리어 한지민', bio_description: '집꾸미기 | 인테리어 | DIY', avatar_url: 'https://i.pravatar.cc/150?img=6',
    biography: '집꾸미기 | 인테리어 | DIY',
    followers_count: 125000, media_count: 312,
    profile_picture_url: 'https://i.pravatar.cc/150?img=6',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '12.5만', rating: '4.8',
    reviewCount: '29', estimatedPrice: '50만원~', category: '라이프스타일',
  },
  {
    id: 'ig_7', username: 'parenting_kr', name: '육아일기 이수정',
    display_name: '육아일기 이수정', bio_description: '두 아이 엄마 | 육아템 리뷰 | 교육정보', avatar_url: 'https://i.pravatar.cc/150?img=7',
    biography: '두 아이 엄마 | 육아템 리뷰 | 교육정보',
    followers_count: 89000, media_count: 567,
    profile_picture_url: 'https://i.pravatar.cc/150?img=7',
    website: '', account_type: 'CREATOR',
    followersFormatted: '8.9만', rating: '4.7',
    reviewCount: '37', estimatedPrice: '50만원~', category: '육아',
  },
  {
    id: 'ig_8', username: 'cafe_tour', name: '카페투어 정민준',
    display_name: '카페투어 정민준', bio_description: '전국 카페 투어 중 ☕ | 디저트 맛집', avatar_url: 'https://i.pravatar.cc/150?img=8',
    biography: '전국 카페 투어 중 ☕ | 디저트 맛집',
    followers_count: 198000, media_count: 423,
    profile_picture_url: 'https://i.pravatar.cc/150?img=8',
    website: '', account_type: 'CREATOR',
    followersFormatted: '19.8만', rating: '4.6',
    reviewCount: '44', estimatedPrice: '100만원~', category: '음식/카페',
  },
  {
    id: 'ig_9', username: 'makeup_artist_kr', display_name: '메이크업 아티스트 손나은',
    biography: '전문 메이크업 아티스트 | 튜토리얼 | 뷰티팁',
    bio_description: '전문 메이크업 아티스트 | 튜토리얼 | 뷰티팁',
    avatar_url: 'https://i.pravatar.cc/150?img=16',
    name: '메이크업 아티스트 손나은',
    followers_count: 342000, media_count: 289,
    profile_picture_url: 'https://i.pravatar.cc/150?img=16',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '34.2만', rating: '4.9',
    reviewCount: '47', estimatedPrice: '100만원~', category: '뷰티',
  },
  {
    id: 'ig_10', username: 'diet_coach_kr', display_name: '다이어트 코치 김하늘',
    biography: '식단관리 | 다이어트 | 건강한 삶',
    bio_description: '식단관리 | 다이어트 | 건강한 삶',
    avatar_url: 'https://i.pravatar.cc/150?img=17',
    name: '다이어트 코치 김하늘',
    followers_count: 215000, media_count: 412,
    profile_picture_url: 'https://i.pravatar.cc/150?img=17',
    website: '', account_type: 'CREATOR',
    followersFormatted: '21.5만', rating: '4.7',
    reviewCount: '33', estimatedPrice: '100만원~', category: '헬스/다이어트',
  },
  {
    id: 'ig_11', username: 'photo_kr', display_name: '사진작가 이준혁',
    biography: '풍경사진 | 인물사진 | 사진강의',
    bio_description: '풍경사진 | 인물사진 | 사진강의',
    avatar_url: 'https://i.pravatar.cc/150?img=18',
    name: '사진작가 이준혁',
    followers_count: 178000, media_count: 534,
    profile_picture_url: 'https://i.pravatar.cc/150?img=18',
    website: '', account_type: 'CREATOR',
    followersFormatted: '17.8만', rating: '4.8',
    reviewCount: '21', estimatedPrice: '50만원~', category: '사진/예술',
  },
  {
    id: 'ig_12', username: 'book_review_kr', display_name: '북스타그램 박지우',
    biography: '책 리뷰 | 독서일기 | 추천도서',
    bio_description: '책 리뷰 | 독서일기 | 추천도서',
    avatar_url: 'https://i.pravatar.cc/150?img=19',
    name: '북스타그램 박지우',
    followers_count: 89000, media_count: 623,
    profile_picture_url: 'https://i.pravatar.cc/150?img=19',
    website: '', account_type: 'CREATOR',
    followersFormatted: '8.9만', rating: '4.6',
    reviewCount: '15', estimatedPrice: '50만원~', category: '교육/독서',
  },
  {
    id: 'ig_13', username: 'finance_tips', display_name: '재테크 전문가 최현우',
    biography: '주식 | 부동산 | 재테크 정보 공유',
    bio_description: '주식 | 부동산 | 재테크 정보 공유',
    avatar_url: 'https://i.pravatar.cc/150?img=20',
    name: '재테크 전문가 최현우',
    followers_count: 267000, media_count: 345,
    profile_picture_url: 'https://i.pravatar.cc/150?img=20',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '26.7만', rating: '4.7',
    reviewCount: '38', estimatedPrice: '100만원~', category: '경제/재테크',
  },
  {
    id: 'ig_14', username: 'yoga_life', display_name: '요가강사 정수아',
    biography: '요가 | 명상 | 마음챙김 | 건강한 일상',
    bio_description: '요가 | 명상 | 마음챙김 | 건강한 일상',
    avatar_url: 'https://i.pravatar.cc/150?img=21',
    name: '요가강사 정수아',
    followers_count: 134000, media_count: 278,
    profile_picture_url: 'https://i.pravatar.cc/150?img=21',
    website: '', account_type: 'CREATOR',
    followersFormatted: '13.4만', rating: '4.9',
    reviewCount: '42', estimatedPrice: '50만원~', category: '운동/요가',
  },
  {
    id: 'ig_15', username: 'game_streamer', display_name: '게임스트리머 김민성',
    biography: '게임 | 리뷰 | 공략 | 스트리밍',
    bio_description: '게임 | 리뷰 | 공략 | 스트리밍',
    avatar_url: 'https://i.pravatar.cc/150?img=22',
    name: '게임스트리머 김민성',
    followers_count: 198000, media_count: 456,
    profile_picture_url: 'https://i.pravatar.cc/150?img=22',
    website: '', account_type: 'CREATOR',
    followersFormatted: '19.8만', rating: '4.5',
    reviewCount: '27', estimatedPrice: '50만원~', category: '게임',
  },
  {
    id: 'ig_16', username: 'k_beauty_global', display_name: 'K뷰티 글로벌 이서현',
    biography: 'K-Beauty | 스킨케어 | 글로벌 뷰티',
    bio_description: 'K-Beauty | 스킨케어 | 글로벌 뷰티',
    avatar_url: 'https://i.pravatar.cc/150?img=23',
    name: 'K뷰티 글로벌 이서현',
    followers_count: 512000, media_count: 389,
    profile_picture_url: 'https://i.pravatar.cc/150?img=23',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '51.2만', rating: '4.8',
    reviewCount: '61', estimatedPrice: '200만원~', category: '뷰티/K-Beauty',
  },
  {
    id: 'ig_17', username: 'camping_life', display_name: '캠핑러버 박동현',
    biography: '캠핑 | 아웃도어 | 자연 | 백패킹',
    bio_description: '캠핑 | 아웃도어 | 자연 | 백패킹',
    avatar_url: 'https://i.pravatar.cc/150?img=24',
    name: '캠핑러버 박동현',
    followers_count: 156000, media_count: 312,
    profile_picture_url: 'https://i.pravatar.cc/150?img=24',
    website: '', account_type: 'CREATOR',
    followersFormatted: '15.6만', rating: '4.7',
    reviewCount: '29', estimatedPrice: '50만원~', category: '여행/캠핑',
  },
  {
    id: 'ig_18', username: 'music_kr', display_name: '인디뮤지션 한소희',
    biography: '음악 | 커버곡 | 자작곡 | 공연',
    bio_description: '음악 | 커버곡 | 자작곡 | 공연',
    avatar_url: 'https://i.pravatar.cc/150?img=25',
    name: '인디뮤지션 한소희',
    followers_count: 223000, media_count: 198,
    profile_picture_url: 'https://i.pravatar.cc/150?img=25',
    website: '', account_type: 'CREATOR',
    followersFormatted: '22.3만', rating: '4.8',
    reviewCount: '36', estimatedPrice: '100만원~', category: '음악/엔터',
  },
  {
    id: 'ig_19', username: 'startup_kr', display_name: '스타트업 대표 조성민',
    biography: '창업 | 스타트업 | 비즈니스 인사이트',
    bio_description: '창업 | 스타트업 | 비즈니스 인사이트',
    avatar_url: 'https://i.pravatar.cc/150?img=26',
    name: '스타트업 대표 조성민',
    followers_count: 98000, media_count: 245,
    profile_picture_url: 'https://i.pravatar.cc/150?img=26',
    website: '', account_type: 'BUSINESS',
    followersFormatted: '9.8만', rating: '4.6',
    reviewCount: '18', estimatedPrice: '50만원~', category: '비즈니스',
  },
  {
    id: 'ig_20', username: 'daily_vlog', display_name: '일상브이로거 김유진',
    biography: '일상 | 브이로그 | 소소한 행복',
    bio_description: '일상 | 브이로그 | 소소한 행복',
    avatar_url: 'https://i.pravatar.cc/150?img=27',
    name: '일상브이로거 김유진',
    followers_count: 445000, media_count: 678,
    profile_picture_url: 'https://i.pravatar.cc/150?img=27',
    website: '', account_type: 'CREATOR',
    followersFormatted: '44.5만', rating: '4.7',
    reviewCount: '54', estimatedPrice: '100만원~', category: '라이프스타일',
  },
];
