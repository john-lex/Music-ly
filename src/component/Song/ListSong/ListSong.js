import { map } from 'lodash';
import React, {useState} from 'react';
import { Table, Icon } from 'semantic-ui-react';

import './ListSong.scss';

export default function ListSong(props) {

    const { songs, albumImage, playerSong } = props;

    // console.log(songs.song)

    const onPlay = ()=>{
        playerSong(albumImage, songs.name)
    }

  return (
    <Table inverted className='list-songs'>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Titulo</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
               <Song songs={songs} albumImage={albumImage} playerSong={playerSong} />         
        </Table.Body>
    </Table>
  )
}

function Song(props) {

    const { songs, albumImage, playerSong} = props;
    const [ song, setSong ] = useState(null);

    map(songs, song => {
        const arraySong = [];
        const data = song.data();
        data.id = song.id;
        arraySong.push(data)
    }  
    )

    return(
        <Table.Row>
            <Table.Cell>
                <Icon name='play circle outline' />
            </Table.Cell>
            <Table.Cell>
                {}
            </Table.Cell>
        </Table.Row>
    )
}
