import React, { useState } from 'react';
import { Button, Icon, Form, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { reauthenticate } from '../../../utils/Api';
import alertErrors from '../../../utils/alertErrors';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';


export default function UserPassword(props) {

    const { setShowModal, setTitleModal, setContentModal } = props;

    const onEdit = ()=>{
        setTitleModal('Actualizando contraseña');
        setContentModal(<ChangeUserPassword setShowModal={setShowModal} />);
        setShowModal(true);
    }

    return (
        <div className='user-password' >
            <h3>contraseña: *** *** ***</h3>
            <Button circular onClick={onEdit}>
                Actualizar
            </Button>
        </div>
    )
}


function ChangeUserPassword(props) {

    const { setShowModal } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        repeatNewPassword:'' 
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = ()=> {
        if(!formData.currentPassword || !formData.newPassword || !formData.repeatNewPassword){
            toast.warning('los campos no deben estar vacios');
        } else if( formData.currentPassword === formData.newPassword ){
            toast.warning('la contraseña nueva no debe ser igual a la anterior')
        } else if( formData.newPassword !== formData.repeatNewPassword){
            toast.warning('las contraseñas son diferente')
        } else {
            setIsLoading(true);
            reauthenticate(formData.currentPassword)
            .then(()=>{
                const currentUser = firebase.auth().currentUser;
                currentUser.updatePassword(formData.newPassword)
                            .then(()=> {
                                toast.success('contraseña actualizada correctamente');
                                setIsLoading(false);
                                setShowModal(false);
                                firebase.auth().signOut();
                            })
                            .catch(err => {
                                toast.error('error al actualizar contraseña')
                            })
            })
            .catch(e => {
                alertErrors(e?.code);
                setIsLoading(false);
            })
        }
    }


    return (
    <Form onSubmit={onSubmit}>
        <Form.Field>
            <Input 
                placeholder='Contraseña actual'
                type={showPassword ? 'text' : 'password' }
                onChange={e => setFormData({...formData,currentPassword: e.target.value})}
                icon={<Icon name='eye' link onClick={()=> {
                    setShowPassword(!showPassword);
                }}  />}
            />
        </Form.Field>
        <Form.Field>
            <Input 
                placeholder='Nueva contraseña'
                type={showPassword ? 'text' : 'password' }
                onChange={e => setFormData({...formData, newPassword: e.target.value})}
                icon={<Icon name='eye' link onClick={()=> {
                    setShowPassword(!showPassword);
                }} />}
            />
        </Form.Field>
        <Form.Field>
            <Input 
                placeholder='Repita nueva contraseña'
                type={showPassword ? 'text' : 'password' }
                onChange={e => setFormData({...formData, repeatNewPassword: e.target.value})}
                icon={<Icon name='eye' link onClick={()=> {
                    setShowPassword(!showPassword);
                }} />}
            />
        </Form.Field>
        <Button type='submit' loading={isLoading} > Actualizar contraseña </Button>
    </Form>
    )
}
