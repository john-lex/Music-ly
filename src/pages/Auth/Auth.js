import React , { useState }from 'react';
import AuthOptions from '../../component/Auth/AuthOptions';
import LoginAuth from '../../component/Auth/LoginForms';
import RegisterAuth from '../../component/Auth/RegisterForms';
import backgroundImg from '../../assets/jpg/background-auth.jpg';
import logoAuth from '../../assets/png/logo-name-white.png';

import './Auth.scss';

export default function Auth() {
    const [selectedForm,setSelectedForm] = useState(null);

    const handlerForm = () => {
        switch(selectedForm) {
            case 'login': 
                return <LoginAuth setSelectedForm={setSelectedForm} />;
            
            case 'register':
                return <RegisterAuth setSelectedForm={setSelectedForm}/>;
            default:
                return <AuthOptions setSelectedForm={setSelectedForm} />;
        }
    }
    return (
        <div className='auth' style={{backgroundImage: `url(${backgroundImg})`}}>
            <div className='auth__dark' />

            <div className='auth__box'>
                <div className='auth__box-logo'>
                    <img src={logoAuth} alt='Musicfy' />
                </div>
                {handlerForm()}
            </div>
        </div>
    );
}