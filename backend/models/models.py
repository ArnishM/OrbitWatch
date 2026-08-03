from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from backend.database.connection import Base
import uuid
import datetime

class District(Base):
    __tablename__ = "districts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    geometry = Column(Geometry('POLYGON', srid=4326), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

class DistrictMetric(Base):
    __tablename__ = "district_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    district_id = Column(UUID(as_uuid=True), nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer)
    
    ndwi = Column(Float)
    ndvi = Column(Float)
    ndbi = Column(Float)
    
    water_area_sqkm = Column(Float)
    vegetation_area_sqkm = Column(Float)
    urban_area_sqkm = Column(Float)
    temperature_celsius = Column(Float)
    
    sdg_score = Column(Float)
    calculated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
