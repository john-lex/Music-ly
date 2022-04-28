import React, { useState } from 'react';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import { toast } from 'react-toastify'; 
import { reauthenticate } from '../../../utils/Api';
import alertErrors from '../../../utils/alertErrors';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';


export default function UserEmail(props) {

    const { user, setShowModal, setTitleModal, setContentModal } = props;

    const onEdit = ()=> {
        setTitleModal('Actualizando correo');
        setContentModal(<ChangeUserEmail email={user.email} setShowModal={setShowModal} />);
        setShowModal(true);
    }


    return (
        <div className='user-email'>
            <h3>Email: {user.email}</h3>
            <Button circular onClick={onEdit}>
                Actualizar
            </Button>
        </div>
    )
}

function ChangeUserEmail (props){

    const { email,setShowModal } = props;
    const [ formData, setFormData ] = useState({ email: '' , password: ''});
    const [ showPassword, setShowPassword] = useState(false);
    const [ isLoading, setIsLoading] = useState(false);

    const onSubmit = ()=> {
        if(!formData.email){
            toast.warning('el correo es el mismo');
        } else {
            setIsLoading();
            reauthenticate(formData.password)
            .then(()=>{
                const currentUser = firebase.auth().currentUser;
                currentUser.updateEmail(formData.email)
                           .then(()=>{
                               toast.success('el correo ha sido actualizado correctamente');
                               setIsLoading(false);
                               setShowModal(false);
                               currentUser.sendEmailVerification().then(()=>{
                                    firebase.auth().signOut();
                               })
                           })
                           .catch(err => {
                               alertErrors(err);
                               setIsLoading(false);
                            })
            })
            .catch(e=> {
                alertErrors(e?.code);
                setIsLoading(false);
            })
        }
    }

    return (
        <Form onSubmit={onSubmit} >
            <Form.Field>
                <Input 
                    defaultValue={email}
                    type='text'
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </Form.Field>
            <Form.Field>
                <Input 
                    placeholder='escribe tu contraseña'
                    type= {showPassword ? 'text' : 'password'}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    icon={<Icon name={showPassword ? 'eye slash ouline' : 'eye'} onClick={()=> { 
                        setShowPassword(!showPassword);
                    }} link />}
                />
            </Form.Field>
            <Button type='submit' loading={isLoading} >Actualizar correo</Button>
        </Form>
    )

}
