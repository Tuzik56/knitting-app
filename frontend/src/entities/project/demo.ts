import type { Project } from './types';

export const demoProjects: Project[] = [
  {
    id: '100',
    name: 'свитер',
    description: 'спицы 5 мм, лицевая гладь',
    status: 'В процессе',
    progress: 50,
    yarnIds: ['1', '2'],
    notes: 'провязано 30 рядов',
  },
  {
    id: '200',
    name: 'шарф',
    description: 'спицы 7 мм, резинка 2 на 2',
    status: 'В планах',
    progress: 0,
    yarnIds: ['3'],
    notes: 'ширина 40 петель',
  },
];