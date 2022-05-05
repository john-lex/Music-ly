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
            {map(songs, song => (
                 <Song key={song.id} song={song} albumImage={albumImage} playerSong={playerSong} /> 
            ))}        
        </Table.Body>
    </Table>
  )
}

function Song(props) {

    const { song, albumImage, playerSong} = props;

    const onPlay = ()=>{
        playerSong(albumImage,song.name,song.song)
    }

    return(
        <Table.Row onClick={onPlay}>
            <Table.Cell collapsing>
                <Icon name='play circle outline' />
            </Table.Cell>
            <Table.Cell>
                {song.name}
            </Table.Cell>
        </Table.Row>
    )
}
