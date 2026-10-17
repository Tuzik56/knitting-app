import { useEffect, useState } from 'react';

import type { AuthSession } from '../shared/api/client';
import type { Yarn } from '../entities/yarn/types';
import type { Project } from '../entities/project/types';

type LoadingStatus = 'loading' | 'success' | 'error';

type YarnResponse = Omit<Yarn, 'id'> & { id: number };

type ProjectResponse = Omit<Project, 'id' | 'yarnIds'> & {
  id: number;
  yarnIds: number[];
};

function toYarn(data: YarnResponse): Yarn {
  return { ...data, id: String(data.id) };
}

function toProject(data: ProjectResponse): Project {
  return {
    ...data,
    id: String(data.id),
    yarnIds: data.yarnIds.map(String),
  };
}

export function useKnittingData(session: AuthSession) {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [yarnData, projectData] = await Promise.all([
          session.request<YarnResponse[]>('/yarns'),
          session.request<ProjectResponse[]>('/projects'),
        ]);

        if (ignore) return;

        setYarns(yarnData.map(toYarn));
        setProjects(projectData.map(toProject));
        setStatus('success');
      } catch (error) {
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
  }, [session, attempt]);

  function retry() {
    setError('');
    setStatus('loading');
    setAttempt((current) => current + 1);
  }

  async function saveYarn(data: Yarn): Promise<Yarn> {
    const { id, ...body } = data;

    const saved = toYarn(
      await session.request<YarnResponse>(
        id ? `/yarns/${id}` : '/yarns',
        {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(body),
        },
      ),
    );

    setYarns((current) =>
      id
        ? current.map((item) => (item.id === id ? saved : item))
        : [...current, saved],
    );

    return saved;
  }

  async function saveProject(data: Project): Promise<Project> {
    const { id, yarnIds, ...fields } = data;

    const saved = toProject(
      await session.request<ProjectResponse>(
        id ? `/projects/${id}` : '/projects',
        {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify({
            ...fields,
            yarnIds: yarnIds.map(Number),
          }),
        },
      ),
    );

    setProjects((current) =>
      id
        ? current.map((item) => (item.id === id ? saved : item))
        : [...current, saved],
    );

    return saved;
  }

  async function deleteYarn(id: string): Promise<void> {
    await session.request<void>(`/yarns/${id}`, {
      method: 'DELETE',
    });

    setYarns((current) => current.filter((item) => item.id !== id));
  }

  async function deleteProject(id: string): Promise<void> {
    await session.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });

    setProjects((current) => current.filter((item) => item.id !== id));
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