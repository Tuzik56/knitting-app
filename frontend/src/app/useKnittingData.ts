import { useEffect, useState } from 'react';

import type { Yarn } from '../entities/yarn/types';
import type { Project } from '../entities/project/types';

import { loadDemoData } from './loadDemoData';

type LoadingStatus = 'loading' | 'success' | 'error';

export function useKnittingData() {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await loadDemoData();

        if (ignore) return;

        setYarns(data.yarns);
        setProjects(data.projects);
        setStatus('success');
      } catch (error: unknown) {
        if (ignore) return;

        setError(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить данные.',
        );
        setStatus('error');
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setError('');
    setStatus('loading');
    setAttempt((current) => current + 1);
  }

  function saveYarn(savedYarn: Yarn) {
    setYarns((currentYarns) => {
      const exists = currentYarns.some(
        (yarn) => yarn.id === savedYarn.id,
      );

      if (exists) {
        return currentYarns.map((yarn) =>
          yarn.id === savedYarn.id ? savedYarn : yarn,
        );
      }

      return [...currentYarns, savedYarn];
    });
  }

  function saveProject(savedProject: Project) {
    setProjects((currentProjects) => {
      const exists = currentProjects.some(
        (project) => project.id === savedProject.id,
      );

      if (exists) {
        return currentProjects.map((project) =>
          project.id === savedProject.id ? savedProject : project,
        );
      }

      return [...currentProjects, savedProject];
    });
  }

  function deleteYarn(id: string): boolean {
    const isUsed = projects.some((project) =>
      project.yarnIds.includes(id),
    );

    if (isUsed) {
      return false;
    }

    setYarns((currentYarns) =>
      currentYarns.filter((yarn) => yarn.id !== id),
    );

    return true;
  }

  function deleteProject(id: string) {
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== id),
    );
  }

  return {
    yarns,
    projects,
    status,
    error,
    retry,
    saveYarn,
    saveProject,
    deleteYarn,
    deleteProject,
  };
}