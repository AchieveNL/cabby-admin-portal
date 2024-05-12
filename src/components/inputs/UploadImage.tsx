import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { uploadFile } from '@/api/upload/upload';

interface UploadImageProps {
  setImageUrl: (url: string) => void;
  placeholder?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  setImageUrl,
  placeholder,
}) => {
  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'IMAGE');
      const uploadedImageUrl = await uploadFile(formData);

      setImageUrl(uploadedImageUrl);
      onSuccess(null, file);
    } catch (error) {
      console.error(error);
      message.error('Failed to upload image.');
      onError(error);
    }
  };

  const beforeUploadHandler = (file: File): boolean => {
    const isPNG = file.type === 'image/png';
    const isJPEG = file.type === 'image/jpeg';

    if (!(isPNG || isJPEG)) {
      message.error(`${file.name} is not a PNG or JPEG file`);
      return false;
    }

    return true;
  };

  return (
    <Upload
      className="w-full"
      customRequest={handleUpload}
      showUploadList={false}
      beforeUpload={beforeUploadHandler}
    >
      <Button
        className="w-full flex items-center justify-center"
        icon={<UploadOutlined rev={undefined} />}
      >
        {placeholder ?? ' Upload Image Only'}
      </Button>
    </Upload>
  );
};

export default UploadImage;
