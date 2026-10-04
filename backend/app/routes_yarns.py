from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import crud
from .database import get_db
from .schemas import YarnRead, YarnWrite

router = APIRouter(prefix="/yarns", tags=["Пряжа"])


def find_yarn_or_404(db: Session, yarn_id: int):
    yarn = crud.get_yarn(db, yarn_id)

    if yarn is None:
        raise HTTPException(
            status_code=404,
            detail="Пряжа не найдена",
        )

    return yarn


@router.get("", response_model=list[YarnRead])
def list_yarns(db: Session = Depends(get_db)):
    return crud.get_yarns(db)


@router.get("/{yarn_id}", response_model=YarnRead)
def read_yarn(yarn_id: int, db: Session = Depends(get_db)):
    return find_yarn_or_404(db, yarn_id)


@router.post("", response_model=YarnRead, status_code=201)
def create_yarn(data: YarnWrite, db: Session = Depends(get_db)):
    return crud.create_yarn(db, data)


@router.put("/{yarn_id}", response_model=YarnRead)
def update_yarn(
    yarn_id: int,
    data: YarnWrite,
    db: Session = Depends(get_db),
):
    yarn = find_yarn_or_404(db, yarn_id)
    return crud.update_yarn(db, yarn, data)


@router.delete("/{yarn_id}", status_code=204)
def delete_yarn(yarn_id: int, db: Session = Depends(get_db)):
    yarn = find_yarn_or_404(db, yarn_id)

    if crud.yarn_is_used(db, yarn_id):
        raise HTTPException(
            status_code=409,
            detail="Сначала уберите пряжу из проектов",
        )

    try:
        crud.delete_yarn(db, yarn)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Пряжу нельзя удалить: она связана с другими записями",
        ) from None

    return Response(status_code=204)