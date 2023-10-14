import React, { useState } from 'react';
import { Modal } from 'antd';
import FullscreenIcon from '@/components/icons/FullscreenIcon';

interface PdfModalProps {
  src: string;
}

const PdfModal: React.FC<PdfModalProps> = ({ src }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <button onClick={openModal} type="button" className="btn-primary">
        <FullscreenIcon />
      </button>
      <Modal
        title="PDF Viewer"
        footer={false}
        visible={modalVisible}
        centered
        onCancel={closeModal}
      >
        <iframe src={src} className="w-full min-h-[80vh] border-none" />
      </Modal>
    </>
  );
};

export default PdfModal;
