from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import (
    date as date_type,
    time as time_type,
    datetime,
    timedelta,
)

from database import get_db_connection
from dependencies import get_current_user

router = APIRouter(prefix="/api/events", tags=["events"])

# =========================
# Utils
# =========================

def timedelta_to_time(td: timedelta) -> time_type:
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return time_type(hour=hours, minute=minutes, second=seconds)


def normalize_event(event: dict) -> dict:
    """Convert MySQL TIME (timedelta) to datetime.time"""
    if event and isinstance(event.get("time"), timedelta):
        event["time"] = timedelta_to_time(event["time"])
    return event


def normalize_events(events: List[dict]) -> List[dict]:
    for event in events:
        normalize_event(event)
    return events


# =========================
# Pydantic models
# =========================

class EventBase(BaseModel):
    title: str
    date: date_type
    time: time_type
    location: str
    description: str


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[date_type] = None
    time: Optional[time_type] = None
    location: Optional[str] = None
    description: Optional[str] = None


class EventResponse(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int]

    class Config:
        from_attributes = True


# =========================
# Routes CRUD
# =========================

@router.post("/", response_model=EventResponse)
def create_event(
    event: EventCreate,
    current_user: dict = Depends(get_current_user),
):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO events (title, date, time, location, description, created_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    event.title,
                    event.date,
                    event.time,
                    event.location,
                    event.description,
                    current_user["id"],
                ),
            )
            event_id = cursor.lastrowid
            connection.commit()

            cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            new_event = cursor.fetchone()

        connection.close()

        if not new_event:
            raise HTTPException(status_code=500, detail="Échec de la création de l'événement")

        return normalize_event(new_event)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")


@router.get("/", response_model=List[EventResponse])
def get_all_events():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM events
                ORDER BY date DESC, time DESC
                """
            )
            events = cursor.fetchall()

        connection.close()
        return normalize_events(events)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            event = cursor.fetchone()

        connection.close()

        if not event:
            raise HTTPException(status_code=404, detail="Événement non trouvé")

        return normalize_event(event)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")


@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            existing_event = cursor.fetchone()

            if not existing_event:
                raise HTTPException(status_code=404, detail="Événement non trouvé")

            update_fields = []
            values = []

            if event_update.title is not None:
                update_fields.append("title = %s")
                values.append(event_update.title)

            if event_update.date is not None:
                update_fields.append("date = %s")
                values.append(event_update.date)

            if event_update.time is not None:
                update_fields.append("time = %s")
                values.append(event_update.time)

            if event_update.location is not None:
                update_fields.append("location = %s")
                values.append(event_update.location)

            if event_update.description is not None:
                update_fields.append("description = %s")
                values.append(event_update.description)

            if update_fields:
                values.append(event_id)
                query = f"""
                    UPDATE events
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                """
                cursor.execute(query, values)
                connection.commit()

            cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            updated_event = cursor.fetchone()

        connection.close()
        return normalize_event(updated_event)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM events WHERE id = %s", (event_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Événement non trouvé")

            cursor.execute("DELETE FROM events WHERE id = %s", (event_id,))
            connection.commit()

        connection.close()
        return {"message": "Événement supprimé avec succès"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")
