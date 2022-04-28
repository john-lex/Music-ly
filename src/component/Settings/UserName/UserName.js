import React, { useState} from 'react';
import { Button, Form, Input} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';



export default function UserName(props) {

    const { user, setShowModal, setTitleModal, setContentModal } = props;
    
    const onEdit = () => {
        setTitleModal('Actualizar nombre');
        setContentModal(<ChangeDisplayNameForm  displayName={user.displayName} setShowModal={setShowModal} />);
        setShowModal(true);
    }

    
    return (
        <>
            <div className='user-name'>
                <h2>{user.displayName}</h2>
                <Button circular onClick={onEdit} >Actualizar</Button>
            </div>
           
        </>
    )
}


function ChangeDisplayNameForm (props) {

    const { displayName, setShowModal } = props;
    const [formData, setFormData ] = useState({ displayName: displayName});

    const onSubmit = ()=> {

        if(!formData.displayName || formData.displayName === displayName){
            setShowModal(false);
        }else(
            firebase.auth().currentUser.updateProfile({
                displayName: formData.displayName
            }).then(()=> {
                toast.success('el nombre de usuario fue actualizado correctamente')
            }).catch(e => {
                console.log(e)
                toast.error('hubo un error al actualizar el nombre de usuario')
            }).finally(() => (
                setShowModal(false)
            ))
        )

    }

    const onChange = e => {
    setFormData({
        displayName: e.target.value
    }) 
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <Input 
                    defaultValue={displayName}
                    onChange={onChange}
                />
            </Form.Field>
            <Button type='submit' >Actualizar nombre</Button>
        </Form>
    );
}
