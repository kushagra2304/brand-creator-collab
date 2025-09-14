export interface Creator {
  id: number;
  name: string;
  platform: string;
  followers: number;
  engagementRate: number;
  keywords: string[];
}

export interface Brand {
  id: number;
  brandName: string;
  keywords: string[];
}
