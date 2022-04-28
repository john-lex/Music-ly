import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Form, Input, Button, Image, Dropdown} from 'semantic-ui-react';
import { map } from 'lodash';
import {toast} from 'react-toastify';
import { v4 } from 'uuid';
import firebase from '../../../utils/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import noImage from '../../../assets/png/no-image.png';


import './AddAlbumForm.scss';

const db = firebase.firestore(firebase);


export default function AddAlbumForm(props) {

    const { setShowModal } = props;
    const [fileAlbum, setFileAlbum] = useState(null);
    const [formData, setFormData] = useState(valueDefault())
    const [artist, setArtists] = useState([])
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      db.collection('artist')
        .get()
        .then(response => {
            const arrayArtists = [];
            map(response?.docs, artist => {
                const data = artist.data();
                arrayArtists.push({
                    key: artist.id,
                    value: artist.id,
                    text: data.name
                })
            })
            setArtists(arrayArtists)
        })
    }, [])

    const uploadImage = (fileName) => {
        const ref = firebase.storage().ref().child(`album/${fileName}`)
        return ref.put(fileAlbum);
    }
    

    const onSubmit = () => {
        if(!formData.name || !formData.artist){
            toast.warning('el nombre del album y el artista son obligatorios');
        } else if (!fileAlbum){
            toast.warning('la imagen del album es obligatiria')
        } else {
            setIsLoading(true);
            const fileName = v4();
            uploadImage(fileName).then(()=>{
                db.collection('albums').add({
                    name: formData.name,
                    artist: formData.artist,
                    banner: fileName
                }).then(()=>{
                    toast.success('album creado.');
                    resetForm();
                    setShowModal(false);
                }).catch(()=>{
                    toast.error('error al crear el album.');
                    resetForm();
                    setShowModal(false);
                })
            }).catch(()=>{
                toast.error('error al subir la imagen del album');
            }).finally(()=>{
                setIsLoading(false);
            })
        }
    }

    const onDrop = useCallback( acceptedFile => {
        const file = acceptedFile[0];
        setFileAlbum(file);
    });

    const { getRootProps, getInputProps} = useDropzone({
        accept: 'image/jpeg, image/png',
        noKeyboard: true,
        onDrop
    });

    const resetForm = ()=> {
        setFormData(valueDefault());
        setFileAlbum(null);
        setImageUrl(null);
    }

    return (
        <Form className='add-album-form' onSubmit={onSubmit}>
            <Form.Group>
                <Form.Field className='album-avatar' width={5} >
                    <div 
                        {...getRootProps()}
                        className='avatar'
                        style={{backgroundImage:`url('$(imageUrl)')`}}
                    />
                    <input {...getInputProps()}  />
                    {!imageUrl && <Image src={noImage} />}
                </Form.Field>
                <Form.Field className='album-inputs' width={11}>
                    <Input 
                        placeholder='Nombre nuevo album'
                        onChange={e => {
                            setFormData({...formData, name: e.target.value})
                        }}
                    />
                    <Dropdown 
                        fluid
                        search
                        selection
                        options={artist}
                        lazyLoad
                        onChange={(e,data) => {
                            setFormData({...formData, artist: data.value})
                        }}
                    />
                </Form.Field>
            </Form.Group>
            <Button type='submit' loading={isLoading} > Crear nuevo album</Button>
        </Form>
    )
}

function valueDefault() {
    return {
        name: "",
        artist: ""
    }
}