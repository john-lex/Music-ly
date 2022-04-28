import React, {useState,useCallback} from 'react';
import { Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import NoAvatar from '../../../assets/png/user.png';
import firebase from '../../../utils/firebase';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

export default function UploadAvatar(props) {

    const { user, setReloadUser } = props;
    
    const [avatarURL, setAvatarURL] = useState(user.photoURL);
       
    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0]; 

        setAvatarURL(URL.createObjectURL(file));

        updateImage(file).then(()=>{
            updateUserAvatar();
        });
    })

    const { getRootProps, getInputProps,isDragActive } = useDropzone({
        accept:'image/jpeg, image/png',
        onKeyboard: true,
        onDrop
    });

    const updateImage = file => {   
        const ref = firebase.storage().ref().child(`avatar/${user.uid}`);
        return ref.put(file);
    }

    const updateUserAvatar = () => {
        firebase.storage()
                .ref(`avatar/${user.uid}`)
                .getDownloadURL()
                .then( async response => {
                await firebase.auth().currentUser.updateProfile({ photoURL: response });
                setReloadUser( reload => !reload );
                }).catch( e =>{
                    toast.error('hubo un error crear al crear el avatar');
                })
    }
 
    
    return (
        <div className='user-avatar' {...getRootProps()} >
            <input {...getInputProps()} />
            {isDragActive ? <Image src={NoAvatar}/> : 
            <Image src={ avatarURL ? avatarURL : NoAvatar } />}
        </div>
    )
}
