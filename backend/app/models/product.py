import uuid
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductVariant(BaseModel):
    label: str
    price: Optional[float] = None


class ProductBase(BaseModel):
    name: str
    slug: str
    category_slug: str
    description: str = ""
    note: str = ""
    image: str = ""
    price: Optional[float] = None
    variants: List[ProductVariant] = []
    rating: float = 5.0
    is_best_seller: bool = False
    is_available: bool = True
    order: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_slug: Optional[str] = None
    description: Optional[str] = None
    note: Optional[str] = None
    image: Optional[str] = None
    price: Optional[float] = None
    variants: Optional[List[ProductVariant]] = None
    rating: Optional[float] = None
    is_best_seller: Optional[bool] = None
    is_available: Optional[bool] = None
    order: Optional[int] = None


class Product(ProductBase):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))