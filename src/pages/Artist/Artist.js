import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { map } from 'lodash'
import BasicSliderItems from '../../component/Sliders/BasicSliderItems';
import firebase from '../../utils/firebase';
import 'firebase/compat/firestore';

import BannerArtist from '../../component/BannerHome/BannerArtist';

import './Artist.scss';

const db = firebase.firestore(firebase);

function Artist(props) {

    const { match } = props;

    const [artist, setArtist] = useState(null);

    const [albums, setAlbums] = useState(null);

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
            </div>
        </div>
    )
}

export default withRouter(Artist);
