from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Project, Yarn, project_yarns
from .schemas import ProjectWrite, YarnWrite


def get_yarns(db: Session):
    return db.scalars(select(Yarn).order_by(Yarn.id)).all()


def get_yarn(db: Session, yarn_id: int):
    return db.get(Yarn, yarn_id)


def create_yarn(db: Session, data: YarnWrite):
    yarn = Yarn(**data.model_dump())
    db.add(yarn)
    db.commit()
    db.refresh(yarn)
    return yarn


def update_yarn(db: Session, yarn: Yarn, data: YarnWrite):
    for field, value in data.model_dump().items():
        setattr(yarn, field, value)

    db.commit()
    db.refresh(yarn)
    return yarn


def yarn_is_used(db: Session, yarn_id: int):
    query = (
        select(project_yarns.c.project_id)
        .where(project_yarns.c.yarn_id == yarn_id)
        .limit(1)
    )
    return db.execute(query).first() is not None


def delete_yarn(db: Session, yarn: Yarn):
    db.delete(yarn)
    db.commit()


def get_projects(db: Session):
    return db.scalars(select(Project).order_by(Project.id)).all()


def get_project(db: Session, project_id: int):
    return db.get(Project, project_id)


def get_yarns_by_ids(db: Session, yarn_ids: list[int]):
    return db.scalars(
        select(Yarn).where(Yarn.id.in_(yarn_ids))
    ).all()


def create_project(
    db: Session,
    data: ProjectWrite,
    yarns: list[Yarn],
):
    project = Project(**data.model_dump(exclude={"yarnIds"}))
    project.yarns = yarns

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(
    db: Session,
    project: Project,
    data: ProjectWrite,
    yarns: list[Yarn],
):
    for field, value in data.model_dump(exclude={"yarnIds"}).items():
        setattr(project, field, value)

    project.yarns = yarns

    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()