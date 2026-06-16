export interface TimelineEvent {
  phase: string;
  time: string;
  description: string;
}

export interface LaunchImage {
  url: string;
  caption: string;
}

export interface Launch {
  id: string;
  title: string;
  slug: string;
  status: string;
  missionType: string;
  vehicle: string;
  site: string;
  launchDate: string;
  launchTime: string;
  year: string;
  description: string;
  astronauts: string;
  webcastPlatform: string;
  webcastId: string;
  success: boolean;
  hasLanding: boolean;
  images: LaunchImage[];
  timeline: TimelineEvent[];
}
