from minio import Minio
import openpyxl

def read_excel_rows(file_path, sheet_name=None):
    """
    读取 Excel 文件的每一行数据。
    
    参数:
      file_path (str): Excel 文件路径（.xlsx）
      sheet_name (str, optional): 指定要读取的工作表名，默认读取第一个表

    返回:
      generator: 每次迭代返回一个包含单元格数值的列表
    """
    # 加载工作簿
    wb = openpyxl.load_workbook(file_path, data_only=True)
    
    # 选择表单
    if sheet_name:
        ws = wb[sheet_name]
    else:
        ws = wb.worksheets[0]  # 默认第一个 sheet

    # 按行迭代
    for row in ws.iter_rows(values_only=True):
        yield list(row)


client = Minio(
    "backend.aailab.cn:22000",
    access_key="RprjQUg6tVYmgaGS",
    secret_key="6DDoldmECpi1hYrKh65aj7mAF36zzPgC",
    secure=False
)

# 列出所有的存储桶
buckets = client.list_buckets()

# 打印所有存储桶的名称
for bucket in buckets:
    print(f"Bucket name: {bucket.name}")

bucket_name = 'images'
# dir_name = 'tcp_thumbnails/tcp01src/'
dir_name = 'tcp_dataset_v3/images/'


count = 0
# TODO: 改成你的 Excel 文件路径
excel_path = 'image.xlsx'
# 如果要指定表单名，比如 'Sheet1'，可以传 sheet_name='Sheet1'
for idx, row in enumerate(read_excel_rows(excel_path), start=1):
    count += 1
    if count == 1:
        continue
    if count % 1000 == 0:
        print(count)
    name = row[0]
    try:
            pic_name = name + '.png'
            ret = client.fget_object(
                bucket_name, dir_name + pic_name,
                            'E:/ChenWei/' + pic_name
            )
    except:
            pic_name = name + '.jpg'
            try:
                ret = client.fget_object(
                    bucket_name, dir_name + pic_name,
                                'E:/ChenWei/' + pic_name
                )
            except:
                continue
