# backend/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
import shutil
from pathlib import Path

# 导入检索函数
from backend.scripts.query import query_image

app = FastAPI()

# 允许前端任意 origin 访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/search/image")
async def search_by_image(
    file: UploadFile = File(...),
    topk: int = 5
):
    # 1) 保存上传的图片到临时目录
    tmp_dir = Path("tmp_uploads")
    tmp_dir.mkdir(exist_ok=True)
    tmp_path = tmp_dir / file.filename
    with tmp_path.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    # 2) 调用原脚本里的检索函数（放到线程池以免阻塞）
    try:
        results = await run_in_threadpool(query_image, str(tmp_path), topk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"检索失败：{e}")

    # 3) 返回 JSON
    return {"results": results}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}
