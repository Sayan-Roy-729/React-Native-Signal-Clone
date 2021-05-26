import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
    View,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';

import CustomListItem from '../components/CustomListItem';
import { auth, db } from '../firebase';
import Colors from '../constants/Colors';
import { Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot((snapshot) => {
            setChats(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    useLayoutEffect(() => {
        console.log('useLayoutEffect');

        navigation.setOptions({
            title: 'Signal',
            headerStyle: {
                backgroundColor:
                    Platform.OS === 'ios' ? '#fff' : Colors.primary,
            },
            headerTitleStyle: {
                color: Platform.OS === 'ios' ? 'black' : '#fff',
            },
            headerTintColor: Platform.OS === 'ios' ? 'black' : '#fff',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar
                            rounded
                            source={{ uri: auth?.currentUser?.photoURL }}
                        />
                    </TouchableOpacity>
                </View>
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
                    <TouchableOpacity activeOpacity={0.7}>
                        <AntDesign name="camerao" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('AddChat')}
                    >
                        <SimpleLineIcons name="pencil" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const signOutUser = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch((err) => {
                Alert.alert('Sign out Filed!', err.message, [
                    { text: 'Okay', style: 'cancel' },
                ]);
            });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (!authUser) {
                navigation.replace('Login');
            }
        });

        return unsubscribe;
    }, []);

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: chatName,
        });
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem
                        key={id}
                        id={id}
                        chatName={chatName}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
});

export default HomeScreen;
