import { useModal } from './ModalContext';

export const ErrorModal = () => {
    const { isErrorModalOpen, errorMessage, closeErrorModal } = useModal();

    if (!isErrorModalOpen) return null;

    return (
        <div className="modal-overlay" onClick={closeErrorModal}>
            <div className="modal-content error" onClick={(e) => e.stopPropagation()}>
                <h3>Ошибка</h3>
                <p>{errorMessage}</p>
                <button className="book-now-btn" onClick={closeErrorModal}>Закрыть</button>
            </div>
        </div>
    );
};

export default ErrorModal;