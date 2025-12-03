// ProfileScreen.js
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function ProfileScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.text}>Welcome to your profile page!</Text>
            <Text style={styles.text}>This page will show user-specific information later.</Text>
            {/* Example of navigating back or to another screen */}
            <Button
                title="Go to Login/Signup"
                onPress={() => navigation.navigate('Auth')}
                color="#007bff"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
    },
});