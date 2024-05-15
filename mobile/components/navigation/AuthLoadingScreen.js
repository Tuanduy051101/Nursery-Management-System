import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../screens/login/AuthContext';

export default function AuthLoadingScreen({ navigation }) {
    const { user } = useAuth();

    useEffect(() => {
        console.log(user);
        if (user) {
            console.log('chay ne');
            navigation.replace('TabNavigator');
        } else {
            navigation.replace('LoginScreen');
        }
    }, [user, navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
