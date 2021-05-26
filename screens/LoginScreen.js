import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';
import { Button, Input, Image } from 'react-native-elements';

import { auth } from '../firebase';
import Colors from '../constants/Colors';

const LoginScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                props.navigation.replace('Home');
            }
        });

        return unsubscribe;
    }, []);

    const signIn = () => {
        setIsLoading(true);
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                setIsLoading(false);
            })
            .catch((err) => {
                Alert.alert('Sign In Error', err.message, [{ text: 'Okay' }]);
            });
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View behavior="padding" enabled style={styles.container}>
            <Image
                source={{
                    uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
                }}
                style={{ width: 200, height: 200 }}
            />
            <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Email"
                        autoFocus
                        type="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Password"
                        secureTextEntry
                        type="password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        onSubmitEditing={signIn}
                    />
                </KeyboardAvoidingView>
            </View>
            <Button
                title="Login"
                containerStyle={styles.button}
                onPress={signIn}
            />
            <Button
                title="Register"
                type="outline"
                containerStyle={styles.button}
                onPress={() => {
                    props.navigation.navigate('Register');
                }}
            />
            {/* <View style={{height: 100}}/> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    inputContainer: {
        width: 300,
        marginTop: 10,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
});

export default LoginScreen;
