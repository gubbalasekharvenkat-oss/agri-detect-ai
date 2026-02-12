
export interface ProjectNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: ProjectNode[];
  description?: string;
}

export type UserRole = 'user' | 'admin';

export interface DetectionResult {
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: string[];
  severity: 'low' | 'medium' | 'high';
  latitude?: number;
  longitude?: number;
  // Multilingual Support
  regionalName?: string;
  regionalDescription?: string;
  regionalTreatment?: string[];
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

export interface ModelMetric {
  version: string;
  precision: number;
  recall: number;
  f1: number;
  date: string;
}

export interface DiseaseStat {
  name: string;
  count: number;
}
