import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from './AuthContext';
// import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [inputStatus, setInputStatus] = useState({
        username: false,
        password: false,
    });
    const { signIn } = useAuth();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (fieldName) => {
        setInputStatus({ ...inputStatus, [fieldName]: true });
    };

    const handleBlur = (fieldName) => {
        setInputStatus({ ...inputStatus, [fieldName]: false });
    };

    const handleLogin = () => {
        signIn(username, password);
        navigation.replace('AuthLoading');
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
                <View style={[styles.inputContainer, inputStatus.username && { borderColor: 'blue' }]}>
                    <Icon name="user" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Tên đăng nhập"
                        onChangeText={text => setUsername(text)}
                        value={username}
                        onFocus={() => handleFocus('username')}
                        onBlur={() => handleBlur('username')}
                    />
                </View>
                <View style={{ marginVertical: 10 }} />
                <View style={[styles.inputContainer, inputStatus.password && { borderColor: 'blue' }]}>
                    <Icon name="lock" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        secureTextEntry={!showPassword}
                        onChangeText={text => setPassword(text)}
                        value={password}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                    />
                    <TouchableOpacity onPress={toggleShowPassword}>
                        <Icon name={showPassword ? "eye-slash" : "eye"} size={24} color="gray" style={styles.showPasswordIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Đăng Nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 30,
    },
    logo: {
        width: 350,
        height: 250,
        alignSelf: 'center',
        marginBottom: 30,
    },
    icon:
    {
        paddingRight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#9370DB',
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 3,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
