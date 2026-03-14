// shape coming from API
export interface ApiTrack {
  id: string;
  nom_song: string;
  autor: string;
  logo: string;
  link: string;
}

// API response
export interface TracksApiResponse {
  data: ApiTrack[];
}

// Transform ApiTrack → Track once
export interface Track {
  id: string;
  url: string;        
  title: string;      
  artist: string;     
  artwork: string;    
  duration?: number;  // filled automatically
}

// Possible player states
export type PlaybackState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'error';