import React, { useState, useEffect} from 'react';
import { map } from 'lodash';
import firebase from '../../utils/firebase';
import 'firebase/compat/firestore';

import BannerHome from '../../component/BannerHome';
import BasicSliderItems from '../../component/Sliders/BasicSliderItems';

import './Home.scss';

const db = firebase.firestore(firebase);

export default function Home() {

    const [artists, setArtists] = useState([]);
    const [album, setAlbum] = useState([]);

    useEffect(() => {
        db.collection('artist')
          .get()
          .then( response => {

            const arrayArtist = [];
            map(response.docs, artistActual => {
                const data = artistActual.data();
                data.id = artistActual.id;
                arrayArtist.push(data);
            })

            setArtists(arrayArtist)
          })
    }, [])

    useEffect(()=>{
        db.collection('albums')
          .get()
          .then( response =>{
            const arrayAlbum = [];
            map(response?.docs, album => {
                const data = album.data();
                data.id = album.id;
                arrayAlbum.push(data)
            })
            setAlbum(arrayAlbum)
          })
    },[])

    return (
        <>
            <BannerHome />
            <div className='home'>
                <h2>esto es el menu</h2>
                <BasicSliderItems title='nuevos artistas' data={artists} 
                    folderName='artist' artistUrl='artist'
                    
                />

                <BasicSliderItems title='nuevos albumes' data={album} 
                    folderName='album' artistUrl='album'  
                />
            </div>
        </>
    )
}
