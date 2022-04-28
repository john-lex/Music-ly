import React, { useState, useEffect } from 'react';
import { map, size } from 'lodash';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import firebase from '../../../utils/firebase';
import 'firebase/compat/storage';

import './BasicSliderItems.scss';

export default function BasicSliderItems(props) {
    
    const { title, data, folderName, artistUrl} = props;

    const settings = {
        dots: false,
        Infinity: true,
        slidesToShow: 5,
        slidesToScroll: 2,
        centerMode: true,
        className: 'basic-slider-items__list'
    }

    if(size(data) < 5){
        return null;
    }

    return (
        <div className='basic-slider-items'>
            <h2>{title}</h2>
            <Slider {...settings}>
                {map(data, items => {
                    return(
                        <RenderItem key={items.id} item={items} folderName={folderName} artistUrl={artistUrl} />
                    )
                })}
            </Slider>
        </div>
    )
}


function RenderItem(props) {

    const { item, folderName, artistUrl } = props;

    const [imageUrl, setImageUrl ] = useState(null);

    useEffect(() => {
        firebase.storage()
                .ref(`${folderName}/${item.banner}`)
                .getDownloadURL()
                .then(url => {
                    setImageUrl(url);
                });
    }, [item, folderName])

    return (
        <Link to={`/${artistUrl}/${item.id}`} >
            <div className='basic-slider-items__list-item'>
                <div className='avatar' 
                    style={{ backgroundImage: `url('${imageUrl}')`}}
                />
                <h3>{item.name}</h3> 
            </div>
        </Link>

    )
}
