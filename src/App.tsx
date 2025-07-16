import './App.css'
import {useAuth} from "react-oidc-context";


function App() {

    const auth = useAuth();  //uses the overarching auth context available to all app children

// todo - update redirect for deployment
    const signOutRedirect = () => {
        const clientId = "4ph7lbuua09u9qstvlc6mf2i4";
        const logoutUri = "http://localhost:5174";
        const cognitoDomain = "https://eu-west-1l4psaazyp.auth.eu-west-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
            <div>




            </div>
        );

    } else {

        return (
            <div>
                <button onClick={() => auth.signinRedirect()}>Sign in</button>
                <button onClick={() => signOutRedirect()}>Sign out</button>
            </div>
        );
    }
}

export default App
