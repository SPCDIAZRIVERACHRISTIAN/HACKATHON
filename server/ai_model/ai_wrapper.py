import os
from dotenv import load_dotenv

load_dotenv()

def process_model_request(context: str, app_access_key: str | None, app_secret_key: str | None):
    expected_access_key = os.getenv("appAccessKey")
    expected_secret_key = os.getenv("appSecretKey")

    if (
        app_access_key != expected_access_key
        or app_secret_key != expected_secret_key
    ):
        return {
            "status_code": 401,
            "data": {
                "status": "invalid",
                "message": "invalid app access key or app secret key",
            },
        }

    prompt = context

    return {
        "status_code": 200,
        "data": {
            "status": "ok",
            "prompt": prompt,
        },
    }