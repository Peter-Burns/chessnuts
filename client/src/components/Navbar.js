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
import {update} from '../services/withUser';

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
        .catch((err)=>{
            console.log(err);
        });
    }
    const {user} = props;
    return (
        <AppBar title="Chessnuts"
            onTitleClick={goHome}
            showMenuIconButton={false}
            iconElementRight={!user ? <LoginButton onClick={login}/> : <IconMenu

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
                        onClick={login}/>,
                        <MenuItem primaryText="Join Game" />,
                        <MenuItem primaryText="Start Game" />,
                    ]}
                />
                <MenuItem primaryText="Log out" onClick={logout} />
            </IconMenu>}
        />
    )
}
export default withRouter(Navbar);