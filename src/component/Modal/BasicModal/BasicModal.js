import React from 'react';
import { Modal,Icon } from 'semantic-ui-react';

import './BasicModal.scss';

export default function BasicModal(props) {

    const { show, setShow, title, size, children} = props;

    const onClose = () => {
        setShow(false);
    }

    return (
        <Modal open={show} onClose={onClose} className='basic-modal' size={size} >
            <Modal.Header >
                <h1>{title}</h1>
                <Icon name='close' onClick={onClose}></Icon>
            </Modal.Header>
            <Modal.Content>
                {children}
            </Modal.Content>
        </Modal>
    )
}
