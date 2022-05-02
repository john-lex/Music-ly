import React, { useState, useEffect} from 'react';
import { map } from 'lodash';
import firebase from '../../utils/firebase';
import 'firebase/compat/firestore';

import BannerHome from '../../component/BannerHome';
import BasicSliderItems from '../../component/Sliders/BasicSliderItems';
import SongSlider from '../../component/Sliders/SongSlider';

import './Home.scss';

const db = firebase.firestore(firebase);

export default function Home(props) {

    const { playerSong } = props;

    const [artists, setArtists] = useState([]);
    const [album, setAlbum] = useState([]);
    const [ songs, setSongs] = useState([]);

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

    useEffect(() => {
      db.collection('songs')
        .limit(10)
        .get()
        .then( response =>{
            const arraySongs =[];
            map(response?.docs, song => {
                const data = song.data();
                data.id = song.id;
                arraySongs.push(data)
            })
            setSongs(arraySongs);
        })
    }, [])
    

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

                <SongSlider 
                    title='Nuevas canciones'
                    data={songs}
                    playerSong={playerSong}
                />
            </div>
        </>
    )
}
