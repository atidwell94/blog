import { createContext, useState, useCallback } from "react";
import axios from 'axios';

const UserContext = createContext();

function Provider({ children }) {
// USESTATE----------------------------------------------------------------
    const [user, setUser] = useState([]);

// FETCHING----------------------------------------------------------------
    const fetchUser = useCallback(async (userId, password) => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users?userid=${userId}&password=${password}`);
        if(response.data.length !== 1) {
            setUser(null);
        }
        else {
            setUser(response.data[0]);
        }
    }, [process.env.REACT_APP_SERVER_URL]);
    
// MODIFYING---------------------------------------------------------------
    const editUserById = async (id, newValues) => {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, newValues);
        const updatedUser = response.data;
        setUser(updatedUser);
    };

    const createUser = async (values) => {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users`, values);
        const newUser = [...user, response.data];
        setUser(newUser);
    };

    const resetUser = async () => {
        setUser(null);
    }

    const valueToShare = {
        user,
        fetchUser,
        editUserById,
        createUser,
        resetUser
    };

    return <UserContext.Provider value={valueToShare}>
        {children}
    </UserContext.Provider>
}

export { Provider };
export default UserContext;