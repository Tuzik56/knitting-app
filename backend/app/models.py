from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class ProjectYarn(Base):
    __tablename__ = "project_yarns"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
    )

    yarn_id: Mapped[int] = mapped_column(
        ForeignKey("yarns.id", ondelete="RESTRICT"),
        primary_key=True,
    )


class Yarn(Base):
    __tablename__ = "yarns"

    __table_args__ = (
        CheckConstraint("weight > 0", name="yarn_weight_positive"),
        CheckConstraint("length > 0", name="yarn_length_positive"),
        CheckConstraint("quantity >= 0", name="yarn_quantity_nonnegative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    brand: Mapped[str] = mapped_column(String(200))
    composition: Mapped[str] = mapped_column(String(300))
    color: Mapped[str] = mapped_column(String(50))
    weight: Mapped[int] = mapped_column(Integer)
    length: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer)
    notes: Mapped[str] = mapped_column(Text, default="")

    projects: Mapped[list["Project"]] = relationship(
        secondary=ProjectYarn.__table__,
        back_populates="yarns",
        passive_deletes="all",
    )


class Project(Base):
    __tablename__ = "projects"

    __table_args__ = (
        CheckConstraint(
            "progress BETWEEN 0 AND 100",
            name="project_progress_range",
        ),
        CheckConstraint(
            "status IN ('В планах', 'В процессе', 'Завершен')",
            name="project_status_allowed",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(30), default="В планах")
    progress: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str] = mapped_column(Text, default="")

    yarns: Mapped[list["Yarn"]] = relationship(
        secondary=ProjectYarn.__table__,
        back_populates="projects",
        passive_deletes=True,
    )