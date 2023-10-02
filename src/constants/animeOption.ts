export const typeOption = ['UNKNOWN', 'TV', 'OVA', 'MOVIE', 'SPECIAL', 'ONA', 'MUSIC']

export const typeTcOption: Record<string, string> = {
  UNKNOWN: '未知',
  TV_SHORT: '電視短篇',
  TV: '電視',
  OVA: 'OVA',
  MOVIE: '電影',
  SPECIAL: 'SP',
  ONA: 'ONA',
  MUSIC: '音樂',
}

export const statusOption = ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED']

export const statusTcOption: Record<string, string> = {
  FINISHED: '完結',
  RELEASING: '播放中',
  NOT_YET_RELEASED: '未播放',
}

export const sourceOption = [
  'other',
  'original',
  'manga',
  '4_koma_manga',
  'web_manga',
  'digital_manga',
  'novel',
  'light_novel',
  'visual_novel',
  'game',
  'video_game',
  'card_game',
  'book',
  'picture_book',
  'radio',
  'music',
]

export const sourceTcOption: Record<string, string> = {
  other: '其他',
  original: '原創',
  manga: '漫畫',
  '4_koma_manga': '四格漫畫',
  web_manga: '網絡漫畫',
  digital_manga: '電子漫畫',
  novel: '小說',
  light_novel: '輕小說',
  visual_novel: '視覺小說',
  game: '遊戲',
  video_game: '遊戲',
  card_game: '卡牌遊戲',
  book: '書',
  picture_book: '圖畫書',
  radio: '廣播',
  music: '音樂',
}

export const weekdayOption = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const weekdayTcOption: Record<string, string> = {
  sunday: '星期日',
  monday: '星期一',
  tuesday: '星期二',
  wednesday: '星期三',
  thursday: '星期四',
  friday: '星期五',
  saturday: '星期六',
}

export const seasonOption = ['winter', 'spring', 'summer', 'fall']

export const seasonTcOption: Record<string, string> = {
  winter: '冬番',
  spring: '春番',
  summer: '夏番',
  fall: '秋番',
}

export const seasonIntMap: Record<string, number> = {
  winter: 1,
  spring: 2,
  summer: 3,
  fall: 4,
}
