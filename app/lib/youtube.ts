const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  country: string;
  customUrl: string;
  publishedAt: string;
  category?: string;
  estimatedPrice?: string;
  rating?: number;
  reviewCount?: number;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: string;
  likeCount: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
}

function formatNumber(n: string): string {
  const num = parseInt(n);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + '만';
  if (num >= 10000) return Math.floor(num / 10000) + '만';
  if (num >= 1000) return (num / 1000).toFixed(1) + '천';
  return n;
}

function estimatePrice(subscribers: string): string {
  const n = parseInt(subscribers);
  if (n >= 1000000) return `${Math.floor(n / 1000000) * 300}만원~`;
  if (n >= 500000) return `${Math.floor(n / 500000) * 100}만원~`;
  if (n >= 100000) return `${Math.floor(n / 100000) * 30}만원~`;
  if (n >= 10000) return `${Math.floor(n / 10000) * 5}만원~`;
  return '50만원~';
}

export async function searchChannels(query: string, maxResults = 12): Promise<YoutubeChannel[]> {
  if (!API_KEY) {
    throw new Error('YOUTUBE_API_KEY_MISSING');
  }
  try {
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    );
    const searchData = await searchRes.json();
    if (searchData.error) {
      throw new Error(`YOUTUBE_API_ERROR: ${searchData.error.message || searchData.error.status}`);
    }
    if (!searchData.items?.length) return [];

    const channelIds = searchData.items.map((i: any) => i.snippet.channelId).join(',');
    const statsRes = await fetch(
      `${BASE}/channels?part=snippet,statistics,brandingSettings&id=${channelIds}&key=${API_KEY}`
    );
    const statsData = await statsRes.json();
    if (statsData.error) {
      throw new Error(`YOUTUBE_API_ERROR: ${statsData.error.message || statsData.error.status}`);
    }

    return (statsData.items || []).map((ch: any) => ({
      id: ch.id,
      title: ch.snippet.title,
      description: ch.snippet.description,
      thumbnail: ch.snippet.thumbnails?.high?.url || ch.snippet.thumbnails?.default?.url,
      subscriberCount: formatNumber(ch.statistics?.subscriberCount || '0'),
      videoCount: ch.statistics?.videoCount || '0',
      viewCount: formatNumber(ch.statistics?.viewCount || '0'),
      country: ch.snippet.country || 'KR',
      customUrl: ch.snippet.customUrl || '',
      publishedAt: ch.snippet.publishedAt,
      estimatedPrice: estimatePrice(ch.statistics?.subscriberCount || '0'),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 80 + 5),
    }));
  } catch (e) {
    if (e instanceof Error && (e.message.startsWith('YOUTUBE_API_ERROR') || e.message === 'YOUTUBE_API_KEY_MISSING')) {
      throw e;
    }
    throw new Error('YOUTUBE_API_NETWORK_ERROR');
  }
}

export async function getChannelById(id: string): Promise<YoutubeChannel | null> {
  try {
    const res = await fetch(`${BASE}/channels?part=snippet,statistics,brandingSettings&id=${id}&key=${API_KEY}`);
    const data = await res.json();
    if (!data.items?.[0]) return null;
    const ch = data.items[0];
    return {
      id: ch.id,
      title: ch.snippet.title,
      description: ch.snippet.description,
      thumbnail: ch.snippet.thumbnails?.high?.url,
      subscriberCount: formatNumber(ch.statistics?.subscriberCount || '0'),
      videoCount: ch.statistics?.videoCount || '0',
      viewCount: formatNumber(ch.statistics?.viewCount || '0'),
      country: ch.snippet.country || 'KR',
      customUrl: ch.snippet.customUrl || '',
      publishedAt: ch.snippet.publishedAt,
      estimatedPrice: estimatePrice(ch.statistics?.subscriberCount || '0'),
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 80 + 5),
    };
  } catch (e) {
    return null;
  }
}

export async function getChannelVideos(channelId: string, maxResults = 6): Promise<YoutubeVideo[]> {
  try {
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=${maxResults}&key=${API_KEY}`
    );
    const searchData = await searchRes.json();
    if (!searchData.items?.length) return [];

    const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',');
    const statsRes = await fetch(`${BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
    const statsData = await statsRes.json();

    return (statsData.items || []).map((v: any) => ({
      id: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.medium?.url,
      viewCount: formatNumber(v.statistics?.viewCount || '0'),
      likeCount: formatNumber(v.statistics?.likeCount || '0'),
      publishedAt: new Date(v.snippet.publishedAt).toLocaleDateString('ko-KR'),
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
    }));
  } catch (e) {
    return [];
  }
}

export async function getTrendingVideos(maxResults = 8): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(
      `${BASE}/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=${maxResults}&key=${API_KEY}`
    );
    const data = await res.json();
    return (data.items || []).map((v: any) => ({
      id: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.medium?.url,
      viewCount: formatNumber(v.statistics?.viewCount || '0'),
      likeCount: formatNumber(v.statistics?.likeCount || '0'),
      publishedAt: new Date(v.snippet.publishedAt).toLocaleDateString('ko-KR'),
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
    }));
  } catch (e) {
    return [];
  }
}
