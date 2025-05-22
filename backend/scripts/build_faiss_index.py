# scripts/build_faiss_index.py
import os
import numpy as np
import faiss

EMB_DIR = "E:/ChenWei/embeddings/"
INDEX_PATH = "../index/clip.index"
LIST_PATH  = "../index/file_list.txt"

os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)

# 读取所有向量和对应文件名
files = sorted([f for f in os.listdir(EMB_DIR) if f.endswith(".npy")])
vecs  = np.vstack([np.load(os.path.join(EMB_DIR, f)) for f in files])

# L2 归一化（使内积等价于余弦相似度）
faiss.normalize_L2(vecs)

# 建立索引
dim   = vecs.shape[1]
index = faiss.IndexFlatIP(dim)
index.add(vecs)

# 保存索引与文件列表
faiss.write_index(index, INDEX_PATH)
with open(LIST_PATH, "w") as fp:
    fp.write("\n".join(files))
