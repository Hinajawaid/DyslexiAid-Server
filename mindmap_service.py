# # mindmap_service.py
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import base64
# import io
# import matplotlib.pyplot as plt
# import networkx as nx
# import numpy as np
# import random

# app = FastAPI()

# # Add CORS middleware to allow requests from your React Native app
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class TextRequest(BaseModel):
#     text: str

# @app.post("/generate-mindmap")
# async def generate_mindmap(request: TextRequest):
#     try:
#         # Your existing mind map generation code here
#         # ... (all the code you provided)
        
#         # Return the base64 encoded image
#         return {
#             "success": True,
#             "image": data_uri,
#             "keywords": keywords
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))