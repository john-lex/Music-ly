import React, {useState, useEffect, useCallback } from 'react'
import { Form,Input, Button, Icon, Dropdown } from 'semantic-ui-react';
import { map } from 'lodash'
import { toast } from 'react-toastify';
import { v4 } from 'uuid'
import firebase from '../../../utils/firebase';
import 'firebase/compat/firestore';
import { useDropzone } from 'react-dropzone';

import './AddSongForm.scss';


const db = firebase.firestore(firebase);


export default function AddSongForm(props) {

    const { setShowModal } = props;
    const [albums, setAlbums] = useState([])
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState(defaultForm)

    useEffect(()=>{
      db.collection('albums')
        .get()
        .then( data =>{
          const arrayAlbum = [];
          map(data?.docs, album => {
            const dataAlbum = album?.data()
            arrayAlbum.push({
              key: album.id,
              value: album.id,
              text: dataAlbum.name
            })
          })
          setAlbums(arrayAlbum)
        })
    },[])

    const onDrop = useCallback( acceptedFiles => {
      const file = acceptedFiles[0];
      setFile(file)
    }) 

    const { getRootProps, getInputProps} = useDropzone({
      accept: '.mp3',
      noKeyboard: true,
      onDrop
  });

    const onSubmit = ()=> {
      if(!formData?.name || !formData?.album){
        toast.warning('el nombre nombre de la cancion y el album')
      } else if(!file){
        toast.warning('la cancion debe subirla');
      } else {

      }
    }


  return (
    <Form className='add-song-form' onSubmit={onSubmit}>
      <Form.Field>
        <Input 
          placeholder='ingrese el nombre de la cancion'
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown 
          placeholder='selecciona el album a donde pertenece la cancion'
          search
          lazyLoad
          selection
          options={albums}
          onChange={(e, data) => setFormData({...formData, album: data.value})}
        />
      </Form.Field>
      <Form.Field>
        <div className='song-upload' {...getRootProps()} >
          <input {...getInputProps()} /> 
          <Icon name='cloud upload' className={file && 'load'} />
          <div>
            <p>
              arrastra tu cancion o has click <span>aqui</span>.
            </p>
            {file && (
              <p>cancion subida <span>{file.name}</span></p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type='submit'>
        subir cancion
      </Button>
    </Form>
  )
}

function defaultForm(){
  return {
    name: '',
    album: ''
  }
}
