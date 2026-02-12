
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import os
import uuid

from ...db.session import get_db
from ...core.security import get_current_user
from ...models.models import User, Detection
from ...schemas.schemas import DetectionResponse
from ...services.ai_service import ai_service

router = APIRouter()

UPLOAD_DIR = "uploads/detections"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/predict", response_model=DetectionResponse)
async def create_detection(
    file: UploadFile = File(...),
    latitude: float = Form(None),
    longitude: float = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Secure file upload handling
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # 2. Perform AI Inference
    prediction = await ai_service.predict_disease(content)
    
    # 3. Store in PostgreSQL via SQLAlchemy
    db_detection = Detection(
        user_id=current_user.id,
        image_path=file_path,
        disease_name=prediction["disease_name"],
        confidence=prediction["confidence"],
        severity=prediction["severity"],
        treatment=prediction["treatment"],
        latitude=latitude,
        longitude=longitude
    )
    
    db.add(db_detection)
    await db.commit()
    await db.refresh(db_detection)
    
    return db_detection

@router.get("/history", response_model=List[DetectionResponse])
async def get_detection_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Simplified query for brevity
    from sqlalchemy import select
    result = await db.execute(select(Detection).where(Detection.user_id == current_user.id))
    return result.scalars().all()
