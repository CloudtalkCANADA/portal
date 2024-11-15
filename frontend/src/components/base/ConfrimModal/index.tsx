import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // To prevent screen readers from reading background content

interface ConfirmModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => Promise<void>;
  message: string;
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
  },
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Confirmation Modal"
    >
      <p className="mb-4">{message}</p>
      <div className="flex gap-4 justify-end">
        <button
          className="bg-gray-200 hover:bg-gray-100 px-2 py-1 rounded-md duration-150"
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 hover:bg-red-400 text-white px-2 py-1 rounded-md duration-150"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
