import React, { useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    Button,
    Alert,
    View,
    ActivityIndicator,
} from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/Colors';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new Chat',
            headerBackTitle: 'Chats',
        });
    }, []);

    const createChat = async () => {
        setIsLoading(true);
        try {
            await db.collection('chats').add({
                chatName: input,
            });

            navigation.goBack();
        } catch (err) {
            Alert.alert(
                'Error',
                'Failed to create a new chat. Check your internet connectivity and try again',
                [{ text: 'Okay', style: 'cancel' }]
            );
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Input
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Enter a chat name"
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon
                        name="wechat"
                        type="antdesign"
                        color={Colors.accent}
                        size={24}
                    />
                }
            />

            <Button
                title="Create new Chat"
                onPress={createChat}
                color={Colors.accent}
                disabled={!input}
            />
        </View>
    );
};

export default AddChatScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 30,
        height: '100%',
    },
});
