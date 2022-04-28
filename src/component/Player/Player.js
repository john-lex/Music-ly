import React, {useState, useEffect} from 'react';
import { Grid, Image, Icon, Input, Progress } from 'semantic-ui-react';
import ReactPlayer from 'react-player';

import './Player.scss';


export default function Player (props) {

    const { dgData } = props;

    const [volume, setVolume] = useState(0.5)
    const [playing, setPlaying] = useState(false)
    const [secondsPlay, setSecondsPlay] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);

    const playSong = () => {
        setPlaying(true)
    }

    const pauseSong = () => {
        setPlaying(false)
    }

    const progress = (data) => {
        setSecondsPlay(data.playedSeconds);
        setTotalSeconds(data.loadedSeconds);
    }

    useEffect(() => {
      if(dgData?.song){
        setPlaying(true)
      }
    }, [dgData])
    

    return(
        <div className='player'>
            <Grid>
                <Grid.Column width={4} className='left'>
                    <Image src={dgData?.img} className='img' />
                    {dgData?.name}
                </Grid.Column>
                <Grid.Column width={8} className='center'>
                    <div className='controls'>
                        {playing ? (
                            <Icon onClick={pauseSong} name='pause circle outline' />
                        ) : (
                            <Icon onClick={playSong} name='play circle outline' />
                        )}
                    </div>
                    <Progress 
                        progress='value'
                        value={secondsPlay}
                        total={totalSeconds}
                        size='tiny'
                    />
                </Grid.Column>
                <Grid.Column width={4} className='rigth'>
                    <Input 
                        label={
                            <Icon name='volume up' />
                        }
                        type='range'
                        min={0}
                        max={1}
                        step={0.01}
                        name='volume'
                        onChange={(e,data) => {
                            setVolume(Number(data.value))
                        }}
                        value={volume}
                    />
                </Grid.Column>
            </Grid>

            <ReactPlayer 
                className='react-player'
                url={dgData?.song}
                playing={playing}
                height='0'
                width='0'
                volume={volume}
                onProgress={e => progress(e)}
            />
        </div>
    )
}