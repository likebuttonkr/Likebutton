// TikTok API 연동
// 참고: TikTok Research API는 승인된 연구자만 사용 가능
// 일반 개발자는 TikTok for Developers에서 Content Posting API만 사용 가능

export interface TikTokProfile {
  id: string;
  username: string;
  display_name: string;
  bio_description: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
  avatar_url: string;
  // 가공 필드
  followersFormatted: string;
  rating: string;
  reviewCount: string;
  estimatedPrice: string;
  category: string;
}

export interface TikTokVideo {
  id: string;
  title: string;
  cover_image_url: string;
  share_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  duration: number;
  create_time: number;
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toString();
}

function estimatePrice(followers: number): string {
  if (followers >= 1000000) return '500만원~';
  if (followers >= 500000) return '200만원~';
  if (followers >= 100000) return '50만원~';
  if (followers >= 50000) return '20만원~';
  return '협의';
}

// TikTok OAuth URL 생성
export function getTikTokAuthUrl(redirectUri: string): string {
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '';
  const scope = 'user.info.basic,video.list';
  return `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
}

// 틱톡 목업 데이터 (API 승인 전까지 사용)
export const TIKTOK_MOCK_PROFILES: TikTokProfile[] = [
  {
    id: 'tt_1', username: 'dance_kr', display_name: '댄스크루 김태양',
    bio_description: '댄스 커버 | 안무 영상 | 틱톡댄스',
    follower_count: 520000, following_count: 312, likes_count: 8200000, video_count: 234,
    avatar_url: 'https://i.pravatar.cc/150?img=10',
    followersFormatted: '52만', rating: '4.7',
    reviewCount: '28', estimatedPrice: '200만원~', category: '댄스/엔터',
  },
  {
    id: 'tt_2', username: 'cook_simple', display_name: '쉬운요리 이정은',
    bio_description: '5분 요리 | 간단 레시피 | 자취요리',
    follower_count: 312000, following_count: 156, likes_count: 4500000, video_count: 312,
    avatar_url: 'https://i.pravatar.cc/150?img=11',
    followersFormatted: '31.2만', rating: '4.8',
    reviewCount: '35', estimatedPrice: '100만원~', category: '음식/요리',
  },
  {
    id: 'tt_3', username: 'funny_moments', display_name: '개그맨 박우진',
    bio_description: '웃긴 영상 | 일상 코미디 | 유머',
    follower_count: 890000, following_count: 89, likes_count: 15600000, video_count: 445,
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    followersFormatted: '89만', rating: '4.6',
    reviewCount: '52', estimatedPrice: '200만원~', category: '엔터/코미디',
  },
  {
    id: 'tt_4', username: 'skincare_tips', display_name: '피부관리 최예린',
    bio_description: '피부과 꿀팁 | 스킨케어 루틴 | 뷰티',
    follower_count: 245000, following_count: 203, likes_count: 3200000, video_count: 187,
    avatar_url: 'https://i.pravatar.cc/150?img=13',
    followersFormatted: '24.5만', rating: '4.9',
    reviewCount: '41', estimatedPrice: '100만원~', category: '뷰티',
  },
  {
    id: 'tt_5', username: 'study_with_me', display_name: '공부자극 한도윤',
    bio_description: '스터디윗미 | 공부자극 | 수험생응원',
    follower_count: 178000, following_count: 421, likes_count: 2100000, video_count: 289,
    avatar_url: 'https://i.pravatar.cc/150?img=14',
    followersFormatted: '17.8만', rating: '4.7',
    reviewCount: '19', estimatedPrice: '50만원~', category: '교육',
  },
  {
    id: 'tt_6', username: 'pet_life_kr', display_name: '반려동물 강민서',
    bio_description: '강아지 고양이 일상 | 펫 용품 리뷰',
    follower_count: 423000, following_count: 267, likes_count: 7800000, video_count: 356,
    avatar_url: 'https://i.pravatar.cc/150?img=15',
    followersFormatted: '42.3만', rating: '4.8',
    reviewCount: '63', estimatedPrice: '100만원~', category: '반려동물',
  },
];
