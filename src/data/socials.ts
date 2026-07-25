export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  bgColor: string;
  hoverBg: string;
  textColor: string;
  ringColor: string;
  icon: 'instagram' | 'tiktok' | 'pinterest' | 'facebook';
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sassha_steele',
    handle: '@sassha_steele',
    bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    hoverBg: 'hover:opacity-90',
    textColor: 'text-white',
    ringColor: 'focus:ring-[#dc2743]',
    icon: 'instagram',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@sasha_steele.ai',
    handle: '@sasha_steele.ai',
    bgColor: 'bg-neutral-900 border border-neutral-700',
    hoverBg: 'hover:bg-black',
    textColor: 'text-white',
    ringColor: 'focus:ring-neutral-900',
    icon: 'tiktok',
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/sofiahonzalezoff',
    handle: '@sofiahonzalezoff',
    bgColor: 'bg-[#e60023]',
    hoverBg: 'hover:bg-[#ad001a]',
    textColor: 'text-white',
    ringColor: 'focus:ring-[#e60023]',
    icon: 'pinterest',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/sashasteele.official',
    handle: 'sashasteele.official',
    bgColor: 'bg-[#1877f2]',
    hoverBg: 'hover:bg-[#0c63d4]',
    textColor: 'text-white',
    ringColor: 'focus:ring-[#1877f2]',
    icon: 'facebook',
  },
];
