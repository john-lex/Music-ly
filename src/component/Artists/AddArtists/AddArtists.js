import React, { useState, useCallback } from 'react';
import { Button, Form, Input, Image} from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../../utils/firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

import noImage from '../../../assets/png/no-image.png';

import './AddArtists.scss';

const db = firebase.firestore(firebase);

export default function AddArtists(props) {

    const { setShowModal } = props;
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(initialForm())
    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);

    const onDrop = useCallback(acceptFiles => {
        const file = acceptFiles[0];
        setFile(file);
        setBanner(URL.createObjectURL(file));
    })

    const { getRootProps, getInputProps } = useDropzone({
        accept:'image/jpeg, image/png',
        onKeyboard: true,
        onDrop
    });

    const uploadImage = fileName => {
        const ref = firebase.storage().ref().child(`artist/${fileName}`);
        return ref.put(file)
    }

    const onSubmit = ()=>{
        if(!formData.name){
            toast.warning('Ingresa nombre del artista');
        } else if(!file){
            toast.warning('Introduce una imagen');
        } else {
            setIsLoading(true);
            const fileName = uuidv4();
            uploadImage(fileName).then(()=>{
                db.collection('artist').add({ name: formData.name, banner: fileName })
                .then(()=>{
                    toast.success('imagen subido correctamente');
                    resetForm();
                    setShowModal(false);
                    setIsLoading(false);
                }).catch(e => {
                    toast.error('hubo un error al crear el artista');
                    setShowModal(false);
                    setIsLoading(false);
                })
            }).catch(e => {
                toast.error('hubo un problema al subir la imagen, intentelo mas tarde')
            });
        }
    }

    const resetForm = ()=> {
        setFormData(initialForm());
        setFile(null);
        setBanner(null);
    }


    return (
        <Form className='add-artist-form' onSubmit={onSubmit}>
            <Form.Field className='artist-banner'>
                <div 
                {...getRootProps()} 
                className='banner' 
                style={{ backgroundImage: `url('${banner}')`}}
                />
                <input {...getInputProps()} />
                {!banner && <Image src={noImage} />}
            </Form.Field>
            <Form.Field className='artist-avatar'>
                <div className='avatar' 
                    style={{ backgroundImage: `url('${banner ? banner : noImage}')`}}
                />
            </Form.Field>
            <Form.Field>
                <Input 
                    placeholder='ingrese el nombre del artista'
                    onChange={e => setFormData({name: e.target.value})}
                />
            </Form.Field>
            <Button type='submit' loading={isLoading} circular > Agregar artista </Button>            
        </Form>
    )
} 

function initialForm () {
    return {
        name:''
    }
}
