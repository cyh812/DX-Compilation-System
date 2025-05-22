# scripts/query.py
import os
import numpy as np
import faiss
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# 允许重复加载 OpenMP runtime（不推荐用于生产，只作临时解决）
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# 加载模型
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 加载索引与文件列表
index = faiss.read_index("index/clip.index")
file_list = open("index/file_list.txt").read().splitlines()

def query_image(path, topk=5):
    img = Image.open(path).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        q_emb = model.get_image_features(**inputs).cpu().numpy().astype(np.float32)
    faiss.normalize_L2(q_emb)
    D, I = index.search(q_emb, topk)
    return [(file_list[i], float(D[0][j])) for j, i in enumerate(I[0])]

# 示例
results = query_image("C:/Users/cyh/Desktop/jianding/1.jpg", topk=8)
for fname, score in results:
    print(f"{fname} (sim={score:.4f})")
