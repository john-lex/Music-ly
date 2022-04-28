import React from 'react';
import { Icon, Image } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import firebase from 'firebase/compat';
import 'firebase/compat/auth';
import UserImage from '../../assets/png/user.png';

import './TopBar.scss';

function TopBar(props) {

    const { user, history } = props;

    const goBack = () => {
        history.goBack();
    }

    const goExit = () => {
        firebase.auth().signOut();
    }

    return (
        <div className='top-bar' >

            <div className='top-bar__left'>
                <Icon name='angle left' onClick={goBack} ></Icon>
            </div>

            <div className='top-bar__rigth'>
                <Link to='/settings'>
                    <Image src={user.photoURL ? user.photoURL : UserImage } />
                    {user.displayName}
                </Link>
                <Icon name='power off' onClick={goExit} ></Icon>
            </div>
            
        </div>
    )
}

export default withRouter(TopBar);
