import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!usuario || !password) {
            Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
            return;
        }

        setLoading(true);

        try {
            console.log('Enviando:', { matricula: usuario, pass: password, tipo: 'a' });

            const response = await fetch('https://sntss.org/api_login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matricula: usuario,
                    pass: password,
                    tipo: 'a',
                }),
            });

            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('userData', JSON.stringify({
                    nombre: data.nombre,
                    matricula: data.matricula,
                    seccion: data.seccion,
                    categoria: data.categoria,
                    adscripcion: data.adscripcion,
                    telefono: data.telefono,
                    correo: data.correo,
                }));

                navigation.navigate('Panel');
            } else {
                Alert.alert('Error', data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu internet.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Elementos decorativos - círculos */}
            <View style={styles.circleDecoration} />
            <View style={[styles.circleDecoration, styles.bottomCircle]} />

            {/* Logo */}
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Título principal */}
            <Text style={styles.mainTitle}>SNTSS</Text>
            <Text style={styles.welcomeSubtitle}>¡Bienvenido! Inicie sesión para continuar</Text>

            {/* Tarjeta de login */}
            <View style={styles.card}>
                {/* Campo Matrícula */}
                <Text style={styles.inputLabel}>Matrícula</Text>
                <TextInput
                    placeholder="Ingrese su matrícula"
                    placeholderTextColor="#8A9BB5"
                    style={styles.input}
                    value={usuario}
                    onChangeText={setUsuario}
                />

                {/* Campo Contraseña */}
                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="#8A9BB5"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Enlace olvidé contraseña */}
                <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Acceder */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'INGRESANDO...' : 'Acceder →'}
                    </Text>
                </TouchableOpacity>

                {/* Divisor O TAMBIÉN */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>O TAMBIÉN</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Botón huella digital - IGUAL A LA IMAGEN */}
                <TouchableOpacity style={styles.fingerprintButton}>
                    <Text style={styles.fingerprintButtonText}>Ingresar con Huella Digital</Text>
                </TouchableOpacity>

                {/* Registro primer ingreso */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿Es su primer ingreso? </Text>
                    <TouchableOpacity>
                        <Text style={styles.registerLink}>Registrarse por primera vez →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleDecoration: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#00a8ff',
        top: -100,
        right: -100,
        opacity: 0.3,
    },
    bottomCircle: {
        top: undefined,
        bottom: -100,
        left: -100,
        right: undefined,
        backgroundColor: '#D4AF37',
        opacity: 0.15,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    mainTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#003c82',
        marginBottom: 5,
        letterSpacing: 2,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#4a6fa5',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    inputLabel: {
        color: '#003c82',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#F5F8FF',
        color: '#003c82',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E8F0',
        fontSize: 15,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    forgotPassword: {
        color: '#4a6fa5',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#003c82',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#4a6fa5',
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E8F0',
    },
    dividerText: {
        color: '#8A9BB5',
        paddingHorizontal: 10,
        fontSize: 12,
        fontWeight: '500',
    },
    // Botón huella digital 
    fingerprintButton: {
        backgroundColor: '#F5F8FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D4AF37',
        borderStyle: 'dashed',
    },
    fingerprintButtonText: {
        color: '#003c82',
        fontSize: 16,
        fontWeight: '500',
    },
    registerContainer: {
        alignItems: 'center',
    },
    registerText: {
        color: '#4a6fa5',
        fontSize: 14,
        textAlign: 'center',
    },
    registerLink: {
        color: '#003c82',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
});