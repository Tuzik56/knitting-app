export interface Yarn {
  id: string;
  name: string;
  brand: string;
  composition: string;
  color: string;
  weight: number;
  length: number;
  quantity: number;
  notes: string;
}

export type ProjectStatus = 'В планах' | 'В процессе' | 'Завершен';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  yarnIds: string[];
  notes: string;
}