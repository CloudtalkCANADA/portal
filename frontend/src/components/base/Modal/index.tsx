import React, { useEffect } from "react";

export interface IModal {
  width: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModal> = ({ width, isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const transitionClasses = "transition-opacity duration-300 ease-in-out";

  const backgroundStyle = isOpen
    ? "opacity-100"
    : "opacity-0 pointer-events-none";

  const contentStyle = isOpen
    ? "opacity-100 translate-y-0 sm:scale-100"
    : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95";

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-600 bg-opacity-75 ${transitionClasses} ${backgroundStyle}`}
      style={{ transitionDelay: "300ms" }}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center">
          <div
            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl ${width} transform ${transitionClasses} ${contentStyle}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling up to parent div
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
