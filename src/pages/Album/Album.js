import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import ListSong from '../../component/Song/ListSong';
import firebase from '../../utils/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import './Album.scss';
import { map } from 'lodash';

const db = firebase.firestore(firebase);

function Album(props) {

    const { match, playerSong } = props;

    const [ albums , setAlbums ] = useState(null);

    const [ urlImg , setUrlImg ] = useState(null);

    const [artist, setArtist] = useState(null);

    const [ songs, setSongs ] = useState(null);

    useEffect(()=>{
        db.collection('albums')
          .doc(match.params.id)
          .get()
          .then(response => {
            setAlbums(response.data())
          })
    },[match])

    useEffect(()=> {
    if(albums){
        firebase.storage()
                .ref(`album/${albums?.banner}`)
                .getDownloadURL()
                .then( url => {
                    setUrlImg(url)
                })
        }
    },[albums])

    useEffect(()=>{
        if(albums){
            db.collection('artist')
              .doc(albums.artist)
              .get()
              .then(response =>{
                setArtist(response.data())
              })
        }
    },[albums])

    useEffect(()=>{
        if(albums){
            db.collection('songs')
              .where('album','==', match.params.id)
              .get()
              .then( response =>{
                const arraySong = [];
                map(response?.docs, song => {
                    const data = song.data();
                    data.id = song.id;
                    arraySong.push(data)
                })
                setSongs(arraySong);
              })
        }
    },[albums])

    if(!albums || !artist){
        return(<Loader active>
            cargando...
        </Loader>)
    }

  return (
    <div className='album'>
        <div className='album__header'>
            <HeaderAlbum albums={albums} urlImg={urlImg} artist={artist} />
        </div>
        <div className='album__song'>
            <p>
                <ListSong songs={songs} albumImage={urlImg} playerSong={playerSong} />
            </p>
        </div>
    </div>
  )
}

export default withRouter(Album);


function HeaderAlbum(props){

    const { albums, urlImg, artist } = props;

    return(
    <>
        <div 
            className='image'
            style={{ backgroundImage: `url('${urlImg}')`}}
        />
        <div className='info'>
            <h1>{albums?.name}</h1>
             <p>
                 De <Link to={`/artist/${albums.artist}`}><span>{artist?.name}</span></Link>
            </p>
        </div>
    </>
    )
}