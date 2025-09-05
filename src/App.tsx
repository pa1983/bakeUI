import './App.css'
import { useAuth } from "react-oidc-context";

function App() {
    const auth = useAuth();
    const handleSignOut = () => {
        auth.signoutRedirect();
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
                <button onClick={handleSignOut}>Sign out</button>
            </div>
        );
    }
}

export default App;