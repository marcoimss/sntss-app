import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function PerfilScreen({ navigation }: any) {
    const [userData, setUserData] = useState({
        nombre: '',
        matricula: '',
        seccion: '',
        categoria: '',
        adscripcion: '',
        telefono: '',
        correo: '',
    });

    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                try {
                    const data = await AsyncStorage.getItem('userData');
                    if (data) {
                        setUserData(JSON.parse(data));
                    } else {
                        navigation.replace('Login');
                    }
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    Alert.alert('Error', 'No se pudo cargar la información del perfil.');
                }
            };
            loadUserData();
        }, [navigation])
    );

    return (
        <View style={styles.container}>
            {/* Círculos decorativos - igual que Panel */}
            <View style={styles.circleDecoration1} />
            <View style={styles.circleDecoration2} />
            <View style={styles.circleDecoration3} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Contenedor del avatar/logo - mismo estilo que Panel */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>

                {/* Título - mismo estilo que Panel */}
                <Text style={styles.title}>Perfil de Usuario</Text>
                <Text style={styles.nameText}>{userData.nombre || 'Compañero'}</Text>

                {/* Tarjeta de datos - misma sombra que Panel */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Matrícula:</Text>
                        <Text style={styles.value}>{userData.matricula}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Sección:</Text>
                        <Text style={styles.value}>{userData.seccion}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Categoría:</Text>
                        <Text style={styles.value}>{userData.categoria}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Adscripción:</Text>
                        <Text style={styles.value}>{userData.adscripcion}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <Text style={styles.value}>{userData.telefono}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Correo:</Text>
                        <Text style={styles.value}>{userData.correo}</Text>
                    </View>
                </View>

                {/* Botón de Regreso - mismo estilo que Panel */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Panel')}
                >
                    <Text style={styles.buttonText}>REGRESAR AL PANEL</Text>
                </TouchableOpacity>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
    },
    // Círculos decorativos - IDÉNTICOS a Panel
    circleDecoration1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#003c82',
        top: -150,
        right: -150,
        opacity: 0.08,
    },
    circleDecoration2: {
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#00a8ff',
        bottom: -120,
        left: -120,
        opacity: 0.08,
    },
    circleDecoration3: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#1B476A',
        bottom: 100,
        right: -80,
        opacity: 0.05,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50, // Reducido de 60 a 50 para no estar tan pegado
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 100,
        padding: 10,
        shadowColor: '#003c82',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#003c82',
    },
    title: {
        fontSize: 28, // Mismo tamaño que "Panel de Control"
        fontWeight: 'bold',
        color: '#003c82',
        textAlign: 'center',
        marginBottom: 5,
    },
    nameText: {
        fontSize: 16,
        color: '#4a6fa5',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        // Misma sombra que Panel
        ...Platform.select({
            ios: {
                shadowColor: '#003c82',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 15,
            },
            android: {
                elevation: 8,
            },
        }),
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(0, 60, 130, 0.1)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E8F0',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#003c82',
    },
    value: {
        fontSize: 14,
        color: '#4a6fa5',
        fontWeight: '500',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#003c82',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        // Misma sombra que Panel
        ...Platform.select({
            ios: {
                shadowColor: '#003c82',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
});