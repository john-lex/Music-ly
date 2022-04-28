import React, {useState} from 'react';
import { Grid } from 'semantic-ui-react';
import { BrowserRouter as Router} from 'react-router-dom';
import Routes from '../../routes/Routes';
import MenuLeft from '../../component/MenuLeft';
import TopBar from '../../component/TopBar';
import Player from '../../component/Player';


import './LoggedUser.scss';


export default function LoggedUser (props) {

    const { user,setReloadUser } = props;
    const [songData, setSongData] = useState(null);
    
    // const playerSong = (img,name,song) => {
    //     setSongData({
    //         img: img,
    //         name: name,
    //         song: song
    //     })
    // }

    // const url1 = 'https://firebasestorage.googleapis.com/v0/b/music-fy-e5cc5.appspot.com/o/song%2Fluisto%20carrion%20el%20valor%20q%20no%20se%20v.mp3?alt=media&token=e2bc5195-6641-43dd-a9ee-f9e7b13fc598';
    // const image1 = 'https://firebasestorage.googleapis.com/v0/b/music-fy-e5cc5.appspot.com/o/album%2F33ce5402-7048-4cf9-a7ea-ef039a02cb3e?alt=media&token=c2bfdec0-c171-4673-af47-a8e423f8e043';
    // const name1 = 'el valor que no se ve';

    return (
        <Router>
            <Grid className='logged-layout'>
            <Grid.Row>
                <Grid.Column width={3}>
                    <MenuLeft user={user}/>
                </Grid.Column>
                <Grid.Column className='content' width={13} >
                    <TopBar user={user} />
                    <Routes user={user} setReloadUser={setReloadUser} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Player dgData={songData} />
                </Grid.Column>
            </Grid.Row>
            </Grid>
        </Router>
    );
}