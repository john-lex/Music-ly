import React, { useState } from 'react';
import { Button,Icon,Form,Input } from 'semantic-ui-react';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';
import { validateEmail  } from '../../../utils/Validation';
import { toast } from 'react-toastify';


import './LoginForms.scss';


export default function LoginForms(props) {

    const { setSelectedForm } = props;
    const [ showPassword,setShowPassword ] = useState(false);
    const [ formData,setFormData ] = useState(defaultValueForm());
    const [ formError, setFormError ] = useState({});
    const [ isLoading,setIsLoading ] = useState(false);
    const [ userActive,setUserActive ] = useState(true);
    const [ user,setUser ] = useState(null);

    const handlerShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onSubmit = () => {
        setFormError({});
        let errors = {};
        let formOk = true;

        if(!validateEmail(formData.email)){
            errors.email = true;
            formOk = false;
        }

        if(formData.password.length < 5){
            errors.password = true;
            formOk = false;
        }

        setFormError(errors);

        if(formOk) {
            setIsLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(formData.email,formData.password)
                .then( response =>{
                    setUser(response.user);
                    setUserActive(response.user.emailVerified);
                    if(!response.user.emailVerified){
                        toast.warning('para poder loguearte antes tienes que verificar la cuenta');
                    }
                })
                .catch( err =>{
                    heandlerErrors(err.code);
                })
                .finally(()=>{
                    setIsLoading(false);
                });
        } 
    }

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    return (
        <div className='login-form'>
            <h1>Musica para todos.</h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        type='text'
                        name='email'
                        placeholder='correo electonico'
                        icon='mail outline'
                        error={formError.email}
                    />
                    { formError.email && 
                        <span className='error-text'>
                            por favor ingesar un correo valido!
                        </span> }
                </Form.Field>

                <Form.Field>
                    <Input 
                        type={ showPassword ? 'text':'password'}
                        name='password'
                        placeholder='contraseña'
                        icon={ showPassword ? (
                            <Icon name='eye slash outline' link onClick={handlerShowPassword} />
                        ): (
                            <Icon name='eye' link onClick={handlerShowPassword} />
                        )
                        }
                        error={formError.password}
                    />
                    { formError.password && 
                        <span className='error-text'>
                            por favor instrodusca una contraseña con mas de 5 caracteres
                        </span> }
                </Form.Field>

                {!userActive && (
                    <ButtonResetSendEmailVerification 
                        user={user}
                        setIsLoading={setIsLoading}
                        setUserActive={setUserActive}
                    />
                )}

                <Button type='submit' loading={isLoading}>Ingresar </Button>
            </Form>

            <div className='login-form__options'>

            <p onClick={ ()=> setSelectedForm(null) }> Volver </p>
               
                <p> no tienes tu cuenta todavia? {' '} 
                    <span onClick={()=> setSelectedForm('register')}>
                    Registrate 
                    </span> 
                </p>
            </div>
 
        </div>
    )

    function ButtonResetSendEmailVerification(props) {

        const { user, setIsLoading, setUserActive } = props;

        const resendEmailVerification = () => {
            user.sendEmailVerification().then(()=>{
                toast.success('se ha enviado el email e verificacion')
            })
            .catch( error =>{
                heandlerErrors(error.code);
            })
            .finally(()=>{
                setIsLoading(false);
                setUserActive(true);
            })
        }

        return (<div className='resend-verification-email'>
            si aun no has recibido el email de verificacion puedes volver a enviarlo haciendo click {' '}
            <span onClick={resendEmailVerification}>Aqui</span>
        </div>)
    }

    function heandlerErrors(code) {
        switch (code) {
            case "auth/wrong-password/":
                toast.warning('el usuario y la contraseña son incorrectos')
                break;
            case "auth/too-many-requests":
                toast.warning('has enviado demasiadas solicitudes de email de confirmacion durante muy poco tiempo')
                break;
            case "auth/user-not-found":
                toast.warning('el usuario y la contraseña son incorrectos');
                break;
            default:
                break;
        }
    }

    function defaultValueForm() {
        return {
            email: "",
            password: ""
        }
    }
}
