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
                    <div key={song.id}>
                        <Table.Row>
                        <Table.Cell collapsing >
                            <Icon name='play circle outline' />
                        </Table.Cell>
                        <Table.Cell onClick={onPlay}>
                            {song.name}
                        </Table.Cell>
                        </Table.Row>
                    </div>
                ))}
            
        </Table.Body>
    </Table>
  )
}
