import React, {useState} from 'react';
import { Button,Icon,Form,Input } from 'semantic-ui-react';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';
import { validateEmail } from '../../../utils/Validation';
import { toast } from 'react-toastify';

import './RegisterForms.scss';


export default function RegisterForms(props) {
    const { setSelectedForm } = props;

    const [ formData,setFormData ] = useState(defaultValueForm());

    const [ showPassword, setShowPassword ] = useState(false);

    const [ isLoading,setIsLoading ] = useState(false);

    const [ formError,setFormError ] = useState({});

    const activeShowPassword = () =>{
        setShowPassword(!showPassword);
    }

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const onSubmit = () => {
    
        setFormError({});

        let errors = {};
        let formOk = true;

        if(!validateEmail(formData.email)){
            errors.email = true;
            formOk = false;
        } 
        
        if(formData.password.length <= 5) {
            errors.password = true;
            formOk = false;
        }
        
        if (!formData.username) {
            errors.username = true;
            formOk = false;
        }

        setFormError(errors);

        if(formOk) {
            setIsLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                changeUserName();
                sendValidationEmail();
                console.log('llegue aqui');
            }).catch(() => {
                toast.error('hubo un error al crear el usuario');
            }).finally(() => {
                setIsLoading(false);
                setSelectedForm(null);
            });
        }
    }

    const changeUserName = () => {
        firebase.auth().currentUser.updateProfile({
            displayName: formData.username
        }).catch(() => {
            toast.error('Error al asignar el nombre de usuario.')
        })
        
    }

    const sendValidationEmail = () => {
        firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
            toast.success('Se ha enviado un email de verificacion.')
        }).catch(() => {

            toast.error('Hubo un error al enviar el correo de verificacion.')
        });

    }

    return (
        <div className='register-form'>
            <h1>Empieza a escuchar miles de canciones, creandote una cuenta de Musicfy gratis.</h1>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Form.Field>
                    <Input 
                        type='text'
                        name='email'
                        placeholder='correo electronico'
                        icon='mail outline'       
                        error={formError.email}
                    />
                    {formError.email && (
                        <span className='error-text'>
                            Ojo , ingrese un correo Valido    
                        </span>
                    )}
                </Form.Field>

                <Form.Field>
                    <Input 
                        type={ showPassword ? 'text': 'password'}
                        name='password'
                        placeholder='contraseña'
                        error={formError.password}
                        icon={ showPassword ? (
                            <Icon name='eye slash outline' link onClick={activeShowPassword} />
                        ) : (
                            <Icon name='eye' link onClick={activeShowPassword} />
                        )
                        }
                    />
                    {formError.password && (
                        <span className='error-text'>
                            ingresa una clave mayor a 5 caracteres.
                        </span>
                    )}
                </Form.Field>

                <Form.Field>
                    <Input 
                        type='text'
                        name='username'
                        placeholder='¿como deberiamos llamarte?'
                        icon='user circle outline'
                        error={formError.username}
                    />
                    {formError.username && (
                        <span className='error-text'>
                            Como quieres que te llamen.
                        </span>
                    )}
                </Form.Field>

                <Button type='submit' loading={isLoading} >Continuar</Button>
            </Form>

            <div className='register-form__options'>
                <p onClick={() => setSelectedForm(null)}>Volver</p>
                <p>
                    ¿Ya tienes tu cuenta? {' '}
                    <span onClick={() => setSelectedForm('login')}>Iniciar Sesion</span>
                </p>

            </div>

        </div>
    )

    function defaultValueForm() {
        return {
            email: '',
            password: '',
            username: ''
        }
    }
}
