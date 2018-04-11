import React from 'react';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';
import NavMenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import LoginButton from '../components/LoginButton';
import Logo from '../components/Logo';

const Navbar = (props) => {
    const goHome = () => {
        props.history.push('/');
    }
    const login = () => {
        props.history.push('/login');
    }

    const { user, openNav } = props;
    return (
        <AppBar title={<span onClick={goHome}>Chessnuts</span>}
            className="chessNav"
            showMenuIconButton={true}
            style={{ background: '#663300', marginBottom: '20px' }}
            titleStyle={{ color: '#ffb366', fontFamily: "'Jua', sans-serif" }}
            iconElementLeft={<Logo onClick={goHome} />}
            iconElementRight={!user ? <LoginButton color='#ffb366' onClick={login} /> :
                <IconButton><NavMenuIcon onClick={openNav} /></IconButton>
            }
        />
    )
}
export default withRouter(Navbar);