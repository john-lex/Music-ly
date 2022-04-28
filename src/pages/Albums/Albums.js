import React, { useState, useEffect } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { map } from 'lodash';
import { Link } from 'react-router-dom';
import firebase from '../../utils/firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

import './Albums.scss';

const db = firebase.firestore(firebase);

export default function Albums() {

  const [albums , setAlbums] = useState([]);

  useEffect(()=>{
    db.collection('albums')
      .get()
      .then( response =>{
        const arrayAlbum = [];
        map(response.docs, album => {
          const data = album.data();
          data.id = album.id;
          arrayAlbum.push(data)       
        })
        setAlbums(arrayAlbum)
      })
  },[])

  return (
    <div className='albums'>
        <h1>albumes</h1>
        <Grid>
          {map(albums, album => {
            return(
            <GridColumn key={album.id} mobile={8} tablet={4} computer={3} >
              <Album album={album} />
            </GridColumn>)
          })}
        </Grid>
    </div>
  )
}

function Album(props){

  const { album } = props;

  const [ bannerUrl,setBannerUrl] = useState(null);
  
  useEffect(()=> {
    firebase.storage()
            .ref(`album/${album.banner}`)
            .getDownloadURL()
            .then( url =>{
              setBannerUrl(url)
            })
  },[album])

  return(

    <Link to={`/album/${album.id}`} >
      <div className='albums__item'>
        <div className='avatar' style={{backgroundImage: `url('${bannerUrl}')`}} />
        <h3>{album.name}</h3>
      </div>
    </Link>
  )
}
