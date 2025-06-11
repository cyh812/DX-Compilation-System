# scripts/query.py
import os
from pathlib import Path
import numpy as np
import faiss
import torch
from PIL import Image
# from transformers import CLIPProcessor, CLIPModel
from transformers import ChineseCLIPProcessor, ChineseCLIPModel

# 允许重复加载 OpenMP runtime（不推荐用于生产，只作临时解决）
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# 加载模型
device = "cuda" if torch.cuda.is_available() else "cpu"
# model = CLIPModel.from_pretrained("OFA-Sys/chinese-clip-vit-base-patch16").to(device)
# processor = CLIPProcessor.from_pretrained("OFA-Sys/chinese-clip-vit-base-patch16")

model = ChineseCLIPModel.from_pretrained(
    "OFA-Sys/chinese-clip-vit-base-patch16",
    cache_dir=cache_directory,       # 可选：直接以半精度加载，节省显存
).to(device)
processor = ChineseCLIPProcessor.from_pretrained(
    "OFA-Sys/chinese-clip-vit-base-patch16",
    cache_dir=cache_directory
)

# 动态定位 index 目录（项目根/backend/index）
BASE_DIR = Path(__file__).resolve().parent.parent   # backend/scripts → backend
INDEX_DIR = BASE_DIR / "index"

# 加载索引与文件列表
index_path = INDEX_DIR / "clip.index"
file_list_path = INDEX_DIR / "file_list.txt"

if not index_path.exists() or not file_list_path.exists():
    raise FileNotFoundError(f"Cannot find index files in {INDEX_DIR!r}")

index = faiss.read_index(str(index_path))
with open(file_list_path, "r", encoding="utf-8") as f:
    file_list = [line.strip() for line in f]

def query_image(path: str, topk: int = 5):
    img = Image.open(path).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        q_emb = model.get_image_features(**inputs).cpu().numpy().astype(np.float32)
    faiss.normalize_L2(q_emb)
    D, I = index.search(q_emb, topk)
    return [(file_list[i].split('.npy')[0], round(float(D[0][j]),2)) for j, i in enumerate(I[0])]


# 示例
# results = query_image("C:/Users/cyh/Desktop/D004423.jpg", topk=8)
# for fname, score in results:
#     print(f"{fname} (sim={score:.4f})")
