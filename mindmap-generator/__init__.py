# # main.py
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from mindmap_generator.generator import MindMapGenerator

# app = FastAPI()

# # Allow React Native to call this
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# generator = MindMapGenerator()

# @app.post("/generate-mindmap")
# async def generate_mindmap(text: str):
#     result = generator.generate(text)
#     return result