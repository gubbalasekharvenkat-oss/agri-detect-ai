
export interface ProjectNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: ProjectNode[];
  description?: string;
}

export interface DetectionResult {
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: string[];
  severity: 'low' | 'medium' | 'high';
  latitude?: number;
  longitude?: number;
}

export interface AnalyticsData {
  time: string;
  moisture: number;
  temperature: number;
  nitrogen: number;
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}
