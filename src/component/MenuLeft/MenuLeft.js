import React, { useState, useEffect } from 'react';
import { Icon, Menu} from 'semantic-ui-react';
import { Link,withRouter } from 'react-router-dom';
import { isUserAdmin } from '../../utils/Api';
import BasicModal from '../Modal/BasicModal';
import AddArtists from '../Artists/AddArtists';
import AddAlbums from '../Albums/AddAlbumForm';
import AddSongForm from '../Song/AddSongForm';


import './MenuLeft.scss';

function MenuLeft(props) {
    
    const { user, location } = props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titleModal, setTitleModal] = useState(null);
    
    
    useEffect(() => {
       setActiveMenu(location.pathname);
    }, [location])    

    useEffect(() => {
        isUserAdmin(user.uid).then(response => {
            setIsAdmin(response);
        })
    }, [user])

    const handlerMenu = (e,menu) => {
        setActiveMenu(menu.to);
    }

    const handlerModal = type => {
        switch (type) {
            case 'artist':
                setTitleModal('Nuevo Artista');
                setContentModal(<AddArtists setShowModal={setShowModal} />);
                setShowModal(true);
            break;

            case 'album':
                setTitleModal('Nuevo Album');
                setContentModal(<AddAlbums setShowModal={setShowModal} />);
                setShowModal(true);
            break;

            case 'song':
                setTitleModal('Nueva Cancion');
                setContentModal(<AddSongForm setShowModal={setShowModal} />);
                setShowModal(true);
            break;
        
            default:
                setTitleModal(null);
                setContentModal(null);
                setShowModal(false);
            break;
        }
    }



    return (
        <>
            <Menu className='menu-left' vertical>
                <div className='top'>
                    <Menu.Item as={Link} to='/' active={activeMenu === '/'} onClick={handlerMenu}>
                        <Icon name='home'/> inicio
                    </Menu.Item>
                    <Menu.Item as={Link} to='/artists' active={activeMenu === '/artists'} onClick={handlerMenu}>
                        <Icon name='user'/> artistas
                    </Menu.Item>
                    <Menu.Item as={Link} to='/albums' active={activeMenu === '/albums'} onClick={handlerMenu}>
                        <Icon name='window maximize outline'/> albumes
                    </Menu.Item>
                </div>

                { isAdmin && (
                <div className='footer'>
                    
                    <Menu.Item onClick={()=> handlerModal('artist')}>
                        <Icon name='plus square outline' /> Nuevo artistas 
                    </Menu.Item>

                    <Menu.Item onClick={()=> handlerModal('album')}>
                        <Icon name='plus square outline' /> Nuevo album 
                    </Menu.Item>

                    <Menu.Item onClick={() => handlerModal('song')}>
                        <Icon name='plus square outline'  /> Nueva cancion
                    </Menu.Item>
                </div>
                ) }
                
            </Menu> 
            <BasicModal show={showModal} setShow={setShowModal} title={titleModal} >
                {contentModal}
            </BasicModal>
        </>
        
    )
}

export default withRouter(MenuLeft);
