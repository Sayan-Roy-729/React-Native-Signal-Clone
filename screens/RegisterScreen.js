import React, { useLayoutEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';

import { auth } from '../firebase';
import Colors from '../constants/Colors';

const RegisterScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerBackTitle: 'Back to Login',
        });
    }, [props.navigation]);

    const register = () => {
        setIsLoading(true);
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL:
                        imageUrl ||
                        'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                });

                setIsLoading(false);
            })
            .catch((err) => alert(err.message));
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text h3 style={{ marginBottom: 50 }}>
                Create a Signal account
            </Text>

            <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Full Name"
                        autoFocus
                        type="text"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </KeyboardAvoidingView>

                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        keyboardType="email-address"
                        onChangeText={(text) => setEmail(text)}
                    />
                </KeyboardAvoidingView>

                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Password"
                        type="password"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                </KeyboardAvoidingView>

                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={30}
                >
                    <Input
                        placeholder="Profile Picture URL (optional)"
                        type="text"
                        value={imageUrl}
                        onChangeText={(text) => setImageUrl(text)}
                        onSubmitEditing={register}
                    />
                </KeyboardAvoidingView>
            </View>

            <Button
                title="Register"
                onPress={register}
                raised
                containerStyle={styles.button}
            />
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
    },
    button: {
        width: 200,
        marginTop: 10,
    },
});

export default RegisterScreen;
