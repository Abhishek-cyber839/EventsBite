import { observer } from "mobx-react-lite";
import { useStore } from "../api/Stores/store";
import { Modal } from "semantic-ui-react";

const ModalContainer = () => {
    const { modalStore } = useStore();
    return(
        <Modal
           open={modalStore.modal.open} 
           onClose={modalStore.CloseModal}
           size='tiny'
        >
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    )
}

export default observer(ModalContainer);