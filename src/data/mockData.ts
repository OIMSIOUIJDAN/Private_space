export interface Message {
  id: string;
  sender: 'me' | 'him';
  text: string;
  time: Date;
  type?: 'text' | 'hug' | 'kiss';
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  height: number;
}

export interface LoveNote {
  id: string;
  text: string;
  date: string;
}

export const mockMessages: Message[] = [
  { id: '1', sender: 'him', text: 'Good morning, beautiful 🌸', time: new Date('2024-01-15T08:30:00') },
  { id: '2', sender: 'me', text: 'Morning my love! Did you sleep well?', time: new Date('2024-01-15T08:32:00') },
  { id: '3', sender: 'him', text: 'Better knowing you exist in this world 💕', time: new Date('2024-01-15T08:33:00') },
  { id: '4', sender: 'me', text: 'You always know how to make me blush', time: new Date('2024-01-15T08:35:00') },
  { id: '5', sender: 'him', text: 'I can\'t wait to see you tonight', time: new Date('2024-01-15T08:36:00') },
  { id: '6', sender: 'me', text: 'Me neither! I\'ll be counting the hours', time: new Date('2024-01-15T08:38:00') },
  { id: '7', sender: 'him', text: 'Sending you a virtual hug 🤗', time: new Date('2024-01-15T08:40:00'), type: 'hug' },
  { id: '8', sender: 'me', text: 'Caught it! Sending one back with extra love 💗', time: new Date('2024-01-15T08:41:00') },
  { id: '9', sender: 'him', text: 'You are my favorite notification', time: new Date('2024-01-15T12:15:00') },
  { id: '10', sender: 'me', text: 'And you are my favorite everything', time: new Date('2024-01-15T12:17:00') },
];

export const mockPhotos: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop', caption: 'Our first sunset together', date: 'March 14, 2023', height: 280 },
  { id: '2', url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=300&fit=crop', caption: 'Coffee dates are the best dates', date: 'April 2, 2023', height: 200 },
  { id: '3', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=450&fit=crop', caption: 'Walking hand in hand', date: 'May 20, 2023', height: 320 },
  { id: '4', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=350&fit=crop', caption: 'That perfect evening', date: 'June 8, 2023', height: 240 },
  { id: '5', url: 'https://images.unsplash.com/photo-1507894009497-8637d6275f1c?w=400&h=400&fit=crop', caption: 'Adventures with you', date: 'July 15, 2023', height: 260 },
  { id: '6', url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop', caption: 'Lazy Sunday mornings', date: 'August 3, 2023', height: 200 },
  { id: '7', url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=500&fit=crop', caption: 'Our special place', date: 'September 12, 2023', height: 300 },
  { id: '8', url: 'https://images.unsplash.com/photo-1501901609772-df0848060f33?w=400&h=350&fit=crop', caption: 'Dancing in the rain', date: 'October 1, 2023', height: 240 },
];

export const mockLoveNotes: LoveNote[] = [
  { id: '1', text: 'The way you laugh at my terrible jokes', date: 'Jan 10, 2024' },
  { id: '2', text: 'How you always remember how I take my coffee', date: 'Jan 12, 2024' },
  { id: '3', text: 'Your warm hugs after a long day', date: 'Jan 14, 2024' },
  { id: '4', text: 'The way your eyes light up when you see me', date: 'Jan 15, 2024' },
  { id: '5', text: 'How you make even grocery shopping feel like an adventure', date: 'Jan 16, 2024' },
  { id: '6', text: 'Your gentle voice when you\'re worried about me', date: 'Jan 17, 2024' },
  { id: '7', text: 'The little notes you leave in my bag', date: 'Jan 18, 2024' },
  { id: '8', text: 'How you hold my hand in your sleep', date: 'Jan 19, 2024' },
  { id: '9', text: 'Your passion when you talk about things you love', date: 'Jan 20, 2024' },
  { id: '10', text: 'The way you make me feel safe and loved every single day', date: 'Jan 21, 2024' },
];

// Relationship dates
export const relationshipData = {
  metDate: new Date('2023-02-14'), // Valentine's Day 2023
  nextDate: new Date('2024-02-14'), // Valentine's Day 2024
  petName: 'my love',
  partnerName: 'babe',
};
