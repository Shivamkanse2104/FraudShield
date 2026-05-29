from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/fraudshield"
    SECRET_KEY: str = "change-this-secret-key-in-production-must-be-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    APP_NAME: str = "Fraud Shield API"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
