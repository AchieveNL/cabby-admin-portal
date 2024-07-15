import React from 'react';
import { Button, Upload, UploadFile } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFile } from '@/api/upload/upload';

interface DisplayImageProps {
  imageUrl: string;
  onImageDelete: (url: string) => void;
}

const DisplayImage: React.FC<DisplayImageProps> = ({
  imageUrl,
  onImageDelete,
}) => {
  const handleDelete = async () => {
    try {
      onImageDelete(imageUrl);
      const filePath = imageUrl.split('cabby-bucket/')[1];
      await deleteFile(filePath);
    } catch (error) {
      console.error('Failed to delete the image:', error);
    }
  };

  const fileList: UploadFile[] = [
    {
      uid: '-1',
      name: 'Uploaded Image',
      status: 'done',
      url: imageUrl,
      thumbUrl: imageUrl,
    },
  ];

  return (
    <Upload
      listType="picture"
      defaultFileList={fileList}
      showUploadList={{
        showDownloadIcon: false,
        showRemoveIcon: true,
        removeIcon: (
          <Button
            type="text"
            icon={<CloseOutlined rev={undefined} />}
            size="small"
            onClick={handleDelete}
          />
        ),
      }}
    >
      <Button
        icon={<CloseOutlined rev={undefined} />}
        style={{ display: 'none' }}
      />
    </Upload>
  );
};

export default DisplayImage;
