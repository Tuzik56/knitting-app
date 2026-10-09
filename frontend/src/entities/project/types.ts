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