// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function ProfileScreen() { // Removed navigation prop here, will use hook
    const navigation = useNavigation(); // Get navigation object using hook
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true); // New state for loading auth check

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // User is logged in
                setUserEmail(user.email);
                setLoading(false);
            } else {
                // User is NOT logged in, redirect
                Alert.alert(
                    'Access Denied',
                    'You must be logged in to view the profile page.',
                    [{ text: 'OK', onPress: () => navigation.replace('Auth') }] // Redirect to Auth
                );
                setUserEmail(''); // Clear email if somehow set
                setLoading(false); // Still stop loading, even if denied
            }
        });

        return () => unsubscribe(); // Clean up listener
    }, []); // Run once on mount

//.. 
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // The onAuthStateChanged listener will handle the redirect
            Alert.alert('Logged Out', 'You have been successfully logged out.');
        } catch (error) {
            Alert.alert('Logout Error', `Failed to log out: ${error.message}`);
            console.error('Logout Error:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Checking access...</Text>
            </View>
        );
    }

    // Only render content if authenticated
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.text}>Welcome to your profile page!</Text>
            {userEmail ? (
                <Text style={styles.text}>Logged in as: {userEmail}</Text>
            ) : (
                <Text style={styles.text}>No user logged in (this should not be seen if redirection works).</Text>
            )}

            <Text style={styles.text}>This page will show user-specific information later.</Text>

            <Button
                title="Logout"
                onPress={handleLogout}
                color="#dc3545"
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
    loadingContainer: { // New style for loading state
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    loadingText: { // New style for loading text
        marginTop: 10,
        fontSize: 16,
        color: '#555',
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