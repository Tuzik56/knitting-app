from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from . import crud
from .database import get_db
from .models import Project
from .schemas import ProjectRead, ProjectWrite

router = APIRouter(prefix="/projects", tags=["Проекты"])


def find_project_or_404(db: Session, project_id: int):
    project = crud.get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Проект не найден",
        )

    return project


def find_selected_yarns(db: Session, yarn_ids: list[int]):
    yarns = crud.get_yarns_by_ids(db, yarn_ids)

    found_ids = {yarn.id for yarn in yarns}
    missing_ids = sorted(set(yarn_ids) - found_ids)

    if missing_ids:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Указанная пряжа не найдена",
                "yarnIds": missing_ids,
            },
        )

    return yarns


def project_to_response(project: Project):
    return ProjectRead(
        id=project.id,
        name=project.name,
        description=project.description,
        status=project.status,
        progress=project.progress,
        yarnIds=sorted(yarn.id for yarn in project.yarns),
        notes=project.notes,
    )


@router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    projects = crud.get_projects(db)
    return [project_to_response(project) for project in projects]


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = find_project_or_404(db, project_id)
    return project_to_response(project)


@router.post("", response_model=ProjectRead, status_code=201)
def create_project(
    data: ProjectWrite,
    db: Session = Depends(get_db),
):
    yarns = find_selected_yarns(db, data.yarnIds)
    project = crud.create_project(db, data, yarns)
    return project_to_response(project)


@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    data: ProjectWrite,
    db: Session = Depends(get_db),
):
    project = find_project_or_404(db, project_id)
    yarns = find_selected_yarns(db, data.yarnIds)
    project = crud.update_project(db, project, data, yarns)
    return project_to_response(project)


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = find_project_or_404(db, project_id)
    crud.delete_project(db, project)
    return Response(status_code=204)