import axios from "axios";
import {useAuth} from "react-oidc-context";

const auth = useAuth()

const response = await axios.get('http://localhost:8000/ingredient/ingredients',
    {headers: {Authorization: `Bearer ${auth.user?.access_token}`}});
console.log(response.data);