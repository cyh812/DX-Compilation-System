import pandas as pd
import json

excel_path1 = 'D:/github file/DX-Compilation-System/backend/work.xlsx'
excel_path2 = 'D:/github file/DX-Compilation-System/backend/image.xlsx'
json_path='output.json'

# 读取Excel文件
df1 = pd.read_excel(excel_path1, sheet_name='work', engine='openpyxl')
df2 = pd.read_excel(excel_path2, sheet_name='image', engine='openpyxl')

# 转换为字典列表（每行一个字典）
work_data = df1.fillna('').to_dict(orient='records')
work_data = {item["workID"]: item for item in work_data}

image_data = df2.to_dict(orient='records')

data = {}
for item in image_data:
    data[item['imageID']] = work_data[item['workID']]

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"转换完成")