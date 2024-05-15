import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState(null);

    const signIn = async (username, password) => {
        const requestData = { username, password };
        const apiUrl = 'http://localhost:4001/api/account/signin';

        try {
            const response = await axios.post(apiUrl, requestData);
            if (!response.data.error) {
                console.log('response');
                console.log(response);
                if (response.data.role === 'phụ huynh') {
                    Alert.alert('Thông báo đăng nhập', 'Đăng nhập thành công', { cancelable: true });
                    setUser(response.data.username);
                    setOwner(response.data.owner);
                } else {
                    console.log('response');
                    console.log(response);
                    Alert.alert('Thông báo đăng nhập', 'Tên đăng nhập hoặc mật khẩu không đúng.', { cancelable: true });
                    setUser(null);
                }
            } else {
                Alert.alert('Thông báo đăng nhập', response.data.message, { cancelable: true });
                setUser(null);
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu POST:', error);
        }
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, owner, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
