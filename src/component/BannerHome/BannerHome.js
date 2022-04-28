import React, { useState , useEffect} from 'react';
import firebase from '../../utils/firebase';
import 'firebase/compat/storage';

import './BannerHome.scss';

export default function BannerHome() {

    const [bannerUrl, setBannerUrl] = useState(null);

    useEffect(() => {
        firebase.storage().ref('other/banner-home.jpg')
                .getDownloadURL()
                .then(ImageUrl => {
                    setBannerUrl(ImageUrl);
                })
                .catch(e => {
                    console.log('hubo un error al mostrar el banner')
                })        
    }, [])

    if(!bannerUrl){
        return null;
    }


    return (
        <div 
            className='banner-home'
            style={{ backgroundImage: `url('${bannerUrl}')`}}
        />
            
    )
}
