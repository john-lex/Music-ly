import React, { useState } from 'react';
import BasicModal from '../../component/Modal/BasicModal';
import UploadAvatar from '../../component/Settings/UploadAvatar';
import UserName from '../../component/Settings/UserName';
import UserEmail from '../../component/Settings/UserEmail';
import UserPassword from '../../component/Settings/UserPassword';

import './Settings.scss';

export default function Settings(props) {

    const { user,setReloadUser } = props;

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titleModal, setTitleModal] = useState(null);

    
    return (
        <div className='settings'>
            <h1>Configuracion</h1>
            <dvi className='avatar-name'>
                <UploadAvatar user={user} setReloadUser={setReloadUser} />
                <UserName 
                    user={user} 
                    setShowModal={setShowModal} 
                    setTitleModal={setTitleModal} 
                    setContentModal={setContentModal} 
                />           
            </dvi>
            <UserEmail 
                user={user}
                setShowModal={setShowModal}
                setTitleModal={setTitleModal}
                setContentModal={setContentModal}
            /> 
              
            <UserPassword 
                setShowModal={setShowModal}
                setTitleModal={setTitleModal}
                setContentModal={setContentModal}
            />
            <BasicModal show={showModal} setShow={setShowModal} title={titleModal} >
                {contentModal}
            </BasicModal>
        </div>
    )
}
