
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
}

export interface AnalyticsData {
  time: string;
  moisture: number;
  temperature: number;
  nitrogen: number;
}
