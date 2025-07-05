import { Modal } from 'autocasting-ui-library-padimasso';
import { createContext, useContext, useState, type ReactNode } from 'react';

type ModalContextType = {
  openModal: (content: ReactNode, title?: string, size?: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'xl_2' | 'xl_3') => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'xl_2' | 'xl_3' | undefined>('md');

  const openModal = (modalContent: ReactNode, modalTitle?: string, modalSize?: typeof size) => {
    setContent(modalContent);
    setTitle(modalTitle);
    setSize(modalSize);
  };

  const closeModal = () => {
    setContent(null);
    setTitle(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={!!content} onClose={closeModal} title={title} size={size}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}
