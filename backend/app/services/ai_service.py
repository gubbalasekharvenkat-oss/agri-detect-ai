
import os
import cv2
import numpy as np
import tensorflow as tf
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
import logging

# Setup logging
logger = logging.getLogger(__name__)

class AIModelManager:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model: Optional[tf.keras.Model] = None
        self.input_shape = (224, 224)  # Standard CNN input size
        
        # Mapping class indices to disease names (Example mapping)
        self.class_names = [
            "Healthy Leaf",
            "Tomato Bacterial Spot",
            "Potato Early Blight",
            "Corn Common Rust",
            "Apple Scab",
            "Grape Black Rot",
            "Wheat Leaf Rust"
        ]
        
        # Knowledge Base for treatments
        self.treatment_db = {
            "Tomato Bacterial Spot": [
                "Apply copper-based fungicides",
                "Avoid overhead irrigation",
                "Remove and destroy infected debris"
            ],
            "Potato Early Blight": [
                "Practice 3-year crop rotation",
                "Apply chlorothalonil or mancozeb",
                "Space plants to improve air circulation"
            ],
            "Corn Common Rust": [
                "Plant resistant hybrids",
                "Apply foliar fungicides early in the season",
                "Manage weeds that host rust fungi"
            ],
            "Apple Scab": [
                "Prune trees to increase sun exposure",
                "Rake and destroy fallen leaves",
                "Apply sulfur-based sprays during dormant season"
            ],
            "Grape Black Rot": [
                "Remove mummified berries",
                "Apply fungicides starting at bud break",
                "Improve drainage around the vine"
            ],
            "Wheat Leaf Rust": [
                "Use rust-resistant wheat varieties",
                "Early planting to avoid peak spore levels",
                "Foliar fungicide application if infection > 5%"
            ],
            "Healthy Leaf": [
                "Maintain current fertilization schedule",
                "Monitor for new pests weekly",
                "Ensure consistent watering"
            ]
        }

    def load_model(self):
        """Loads the .h5 model file into memory."""
        if not os.path.exists(self.model_path):
            logger.warning(f"Model file not found at {self.model_path}. Running in mock mode.")
            return

        try:
            self.model = tf.keras.models.load_model(self.model_path)
            logger.info("TensorFlow model loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise RuntimeError("Failed to initialize AI model engine.")

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Decodes, resizes, and normalizes the input image."""
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Convert BGR (OpenCV) to RGB (TensorFlow/Keras)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize to model input size
        img = cv2.resize(img, self.input_shape)
        
        # Normalize to [0, 1]
        img = img.astype(np.float32) / 255.0
        
        # Add batch dimension
        img = np.expand_dims(img, axis=0)
        return img

    def get_severity(self, confidence: float, disease_name: str) -> str:
        """Heuristic-based severity determination."""
        if "Healthy" in disease_name:
            return "low"
        
        if confidence > 0.90:
            return "high"
        elif confidence > 0.75:
            return "medium"
        else:
            return "low"

    async def predict(self, image_bytes: bytes) -> Dict[str, Any]:
        """Runs the end-to-end inference pipeline."""
        if self.model is None:
            # Fallback for development if .h5 is missing
            return self._mock_predict()

        try:
            # 1. Preprocess
            input_data = self.preprocess_image(image_bytes)
            
            # 2. Inference
            predictions = self.model.predict(input_data)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx])
            
            # 3. Post-process
            disease_name = self.class_names[class_idx]
            severity = self.get_severity(confidence, disease_name)
            treatment = self.treatment_db.get(disease_name, ["Consult local agricultural expert"])
            
            return {
                "disease_name": disease_name,
                "confidence": round(confidence, 4),
                "severity": severity,
                "treatment": treatment
            }
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise HTTPException(status_code=500, detail="AI Inference failed")

    def _mock_predict(self) -> Dict[str, Any]:
        """Provides simulated results when no model file is present."""
        import random
        disease = random.choice(list(self.treatment_db.keys()))
        confidence = round(random.uniform(0.75, 0.98), 4)
        return {
            "disease_name": disease,
            "confidence": confidence,
            "severity": self.get_severity(confidence, disease),
            "treatment": self.treatment_db[disease]
        }

# Global manager instance
model_manager = AIModelManager(model_path="app/static/models/plant_disease_model.h5")
