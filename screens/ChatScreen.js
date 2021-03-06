import React, { useLayoutEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, ScrollView, TextInput, Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Avatar } from 'react-native-elements';

import Colors from '../constants/Colors';
import * as firebase from '../firebase';
import { db, auth } from '../firebase';

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState();
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        source={{
                            uri: messages[0]?.data.photoURL,
                        }}
                    />
                    <Text
                        style={{
                            color: '#fff',
                            marginLeft: 10,
                            fontWeight: '700',
                            fontSize: 18,
                        }}
                    >
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={25} color="#fff" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity>
                        <FontAwesome
                            name="video-camera"
                            size={25}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: new Date(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        });

        setInput('');
    };

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );

        return unsubscribe;
    }, [route]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={80}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>
                        <ScrollView contentContainerStyle={{paddingTop: 15}}>
                            {messages.map(({ id, data }) =>
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.receiver}>
                                        <Avatar
                                            rounded
                                            source={{ uri: data.photoURL }}
                                            size={30}
                                            position="absolute"
                                            bottom={-15}
                                            right={-5}
                                            // for web
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                right: -5,
                                            }}
                                        />
                                        <Text style={styles.receiverText}>
                                            {data.message}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.sender}>
                                        <Avatar
                                            rounded
                                            position="absolute"
                                            containerStyle={{
                                                position: 'absolute',
                                                bottom: -15,
                                                left: -5,
                                            }}
                                            bottom={-15}
                                            left={-5}
                                            size={30}
                                            source={{
                                                uri: data.photoURL,
                                            }}
                                        />
                                        <Text style={styles.senderText}>
                                            {data.message}
                                        </Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput
                                placeholder="Signal Message"
                                style={styles.textInput}
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={sendMessage}
                            >
                                <Ionicons
                                    name="send"
                                    size={24}
                                    color={Colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ececec',
        borderWidth: 1,
        padding: 10,
        color: 'grey',
        borderRadius: 30,
    },
    receiver: {
        padding: 15,
        backgroundColor: '#ececec',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    receiverText: {
        color: '#000',
        fontWeight: '500',
        marginLeft: 10,
    },
    sender: {
        padding: 15,
        backgroundColor: Colors.primary,
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative',
    },
    senderText: {
        color: '#fff',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: '#fff',
    },
});
