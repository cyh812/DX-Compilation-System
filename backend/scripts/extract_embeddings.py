# scripts/extract_embeddings.py

# 将指定目录下的所有图像进行编码，并将编码结果存在指定路径，每个图像有一个编码

import os
import torch
import numpy as np
from PIL import Image, ImageFile, PngImagePlugin
from transformers import CLIPProcessor, CLIPModel
from tqdm import tqdm
import warnings

# ----------- 修复 PIL PNG 文本块过大问题 -----------
# 允许加载被截断的图像
ImageFile.LOAD_TRUNCATED_IMAGES = True
# 将允许的 PNG 文本块（包括 iCCP）大小调大到 1MiB
PngImagePlugin.MAX_TEXT_CHUNK = 1 << 20

# ----------- 静默 transformers 关于 slow/fast processor 的警告 -----------
warnings.filterwarnings(
    "ignore",
    message="Using a slow image processor as `use_fast` is unset.*",
)

# 设备与模型
device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 路径配置
IMG_DIR = "E:/ChenWei/"
EMB_DIR = "E:/ChenWei/embeddings/"
os.makedirs(EMB_DIR, exist_ok=True)

# 批量处理
for fname in tqdm(os.listdir(IMG_DIR)):
    if not fname.lower().endswith((".jpg", ".png")): 
        continue
    img = Image.open(os.path.join(IMG_DIR, fname)).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        emb = model.get_image_features(**inputs)  # (1, 512)
    # 保存成单个 .npy
    np.save(os.path.join(EMB_DIR, fname + ".npy"),
            emb.cpu().numpy().astype(np.float32))

