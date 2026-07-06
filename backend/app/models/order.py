import uuid
from datetime import datetime, timezone
from typing import List

from pydantic import BaseModel, ConfigDict, Field


class OrderItem(BaseModel):
    product_slug: str
    variant_label: str
    quantity: int
    unit_price: float


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    pickup_time: str
    items: List[OrderItem]
    notes: str = ""


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    pickup_time: str
    items: List[OrderItem]
    notes: str = ""
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))