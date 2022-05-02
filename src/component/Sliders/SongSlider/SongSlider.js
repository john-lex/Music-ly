import React, {useState, useEffect} from 'react';
import Slider from 'react-slick';
import { map,size } from 'lodash';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from '../../../utils/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import './SongSlider.scss';

const db = firebase.firestore(firebase)


export default function SongSlider(props) {

    const { title, data, playerSong } = props;
    const [ urlSong, setUrlSong ] = useState(null);

    const settings = {
        dots: false,
        Infinity: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        centerMode: true,
        className: 'song-slider__list'
    }

    if(size(data) < 5){
        return null;
    }

  return (
    <div className='song-slider'>
        <h2>{title}</h2>
        <Slider {...settings}>
            {map(data, item => (
                <Song key={item.id} item={item} playerSong={playerSong} />
            ))}
        </Slider>
    </div>
  )
}


function Song(props){

    const { item, playerSong } = props;

    const [album, setAlbum] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(()=>{
        db.collection('albums')
          .doc(`${item.album}`)
          .get()
          .then( response =>{
            const data = response?.data()
            data.id = response.id;
            setAlbum(data)
            getImage(data.banner)
          })
    },[item])

    const getImage = albumId => {
        firebase.storage()
                .ref(`album/${albumId}`)
                .getDownloadURL()
                .then( image =>{
                    setImageUrl(image);
                })
    }
      

    const onPlay = () => {
        playerSong(imageUrl,item.name,item.song);
    }

    return (
        <div className='song-slider__list-song'>
            <div className='avatar' style={{ backgroundImage: `url('${imageUrl}')` }} onClick={onPlay} >
                <Icon name='play circle outline' />
            </div>
            <Link to={`/album/${album?.id}`} >
                <h3>{item.name}</h3>
            </Link>
        </div>
    )
}
