from datetime import datetime


def _serialize_dates(doc: dict) -> dict:
    for k in ("created_at", "updated_at", "timestamp"):
        v = doc.get(k)
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def _deserialize_dates(doc: dict) -> dict:
    for k in ("created_at", "updated_at", "timestamp"):
        v = doc.get(k)
        if isinstance(v, str):
            try:
                doc[k] = datetime.fromisoformat(v)
            except ValueError:
                pass
    return doc