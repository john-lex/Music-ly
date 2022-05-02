import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { map } from 'lodash'
import BasicSliderItems from '../../component/Sliders/BasicSliderItems';
import SongSlider from '../../component/Sliders/SongSlider';
import firebase from '../../utils/firebase';
import 'firebase/compat/firestore';

import BannerArtist from '../../component/BannerHome/BannerArtist';

import './Artist.scss';

const db = firebase.firestore(firebase);

function Artist(props) {

    const { match, playerSong } = props;

    const [artist, setArtist] = useState(null);

    const [albums, setAlbums] = useState(null);

    const [song, setSong] = useState(null);

    useEffect(() => {
        db.collection('artist')
          .doc(match.params.id)
          .get()
          .then( response => {
            const data = response.data();
            data.id = response.id;
            setArtist(data);
          })
    }, [match])

    useEffect(()=>{
        if(artist){
            db.collection('albums')
              .where('artist','==', artist.id)
              .get()
              .then( response => {
                const arrayAlbums = [];
                map(response.docs, album => {
                    const data = album.data()
                    data.id = album.id;
                    arrayAlbums.push(data)
                })
                setAlbums(arrayAlbums);
              })
        }
    },[artist]);

    useEffect(() => {
      const arraySong = [];
      (async ()=> {
          await Promise.all(
              map(albums, async album => {
                await db.collection('songs')
                        .where('album','==', album.id )
                        .get()
                        .then( response =>{
                            map(response?.docs, song => {
                                const data = song.data()
                                data.id = song.id;
                                arraySong.push(data)
                            })
                        })
              })
          )
          setSong(arraySong);
      })()
    }, [albums])
    

    return (
        <div className='artist'>
            {artist && <BannerArtist artist={artist} />}
            <div className='artist__content'>
                <BasicSliderItems 
                    title='albumes'
                    data={albums}
                    folderName='album'
                    artistUrl='album'
                />

                <SongSlider 
                    title='Canciones'
                    data={song}
                    playerSong={playerSong}
                />
            </div>
        </div>
    )
}

export default withRouter(Artist);
