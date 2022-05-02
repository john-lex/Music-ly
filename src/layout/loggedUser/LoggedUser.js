import React, {useState, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import { BrowserRouter as Router} from 'react-router-dom';
import Routes from '../../routes/Routes';
import MenuLeft from '../../component/MenuLeft';
import TopBar from '../../component/TopBar';
import Player from '../../component/Player';
import firebase from '../../utils/firebase';
import 'firebase/compat/storage';


import './LoggedUser.scss';


export default function LoggedUser (props) {

    const { user,setReloadUser } = props;
    const [songData, setSongData] = useState(null);

        const playerSong = (img,name,song) => {
            firebase
                .storage()
                .ref(`song/${song}`)
                .getDownloadURL()
                .then( url =>{
                    setSongData({
                        img: img,
                        name: name,
                        song: url
                    })
                })    
    }

    return (
        <Router>
            <Grid className='logged-layout'>
            <Grid.Row>
                <Grid.Column width={3}>
                    <MenuLeft user={user}/>
                </Grid.Column>
                <Grid.Column className='content' width={13} >
                    <TopBar user={user} />
                    <Routes user={user} setReloadUser={setReloadUser} playerSong={playerSong} />
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