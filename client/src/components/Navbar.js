import React from 'react';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';
import IconMenu from 'material-ui/IconMenu';
import NavMenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import LoginButton from '../components/LoginButton';
import axios from "axios";
import { update } from '../services/withUser';
import Logo from '../components/Logo';

const Navbar = (props) => {
    const goHome = () => {
        props.history.push('/');
    }
    const login = () => {
        props.history.push('/login');
    }
    const logout = () => {
        axios.delete('/api/users')
            .then(() => {
                update(null);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const myGames = () => {
        props.history.push('/mygames');
    }
    const startGame = () => {
        props.history.push('/startgame');
    }
    const joinGame = () => {
        props.history.push('/joingame');
    }
    const { user } = props;
    return (
        <AppBar title="Chessnuts"
            className="chessNav"
            onTitleClick={goHome}
            showMenuIconButton={true}
            style={{ background: '#663300' }}
            titleStyle={{ color: '#ffb366', fontFamily: "'Jua', sans-serif" }}
            iconElementLeft={<Logo onClick={props.logoClick} />}
            iconElementRight={!user ? <LoginButton onClick={login} /> :
                <IconMenu
                    iconButtonElement={
                        <IconButton><NavMenuIcon /></IconButton>
                    }
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                    <MenuItem
                        primaryText={user ? user.username : 'Not logged in'}
                        rightIcon={<ArrowDropRight />}
                        menuItems={[
                            <MenuItem primaryText="My Games"
                                onClick={myGames} />,
                            <MenuItem primaryText="Join Game"
                                onClick={joinGame} />,
                            <MenuItem primaryText="Start Game"
                                onClick={startGame} />,
                        ]}
                    />
                    <MenuItem primaryText="Log out" onClick={logout} />
                </IconMenu>}
        />
    )
}
export default withRouter(Navbar);