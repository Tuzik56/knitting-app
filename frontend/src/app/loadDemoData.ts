import type { Yarn } from '../entities/yarn/types';
import type { Project } from '../entities/project/types';

import { demoYarns } from '../entities/yarn/demo';
import { demoProjects } from '../entities/project/demo';

interface DemoData {
  yarns: Yarn[];
  projects: Project[];
}

const demoOptions = {
  fail: false,
  empty: false,
};

export async function loadDemoData(): Promise<DemoData> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 600);
  });

  if (demoOptions.fail) {
    throw new Error('Не удалось загрузить данные. Попробуйте ещё раз');
  }

  return {
    yarns: demoOptions.empty ? [] : structuredClone(demoYarns),
    projects: demoOptions.empty ? [] : structuredClone(demoProjects),
  };
}