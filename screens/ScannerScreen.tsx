import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, DeviceEventEmitter, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRScanner from 'react-native-qr-scanner-advanced';

export default function ScannerScreen({ navigation }: any) {
    const [encargado, setEncargado] = useState({ matricula: '', nombre: '' });
    const [scanned, setScanned] = useState(false);
    const [tipo, setTipo] = useState('entrada');

    useEffect(() => {
        const loadEncargado = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const { matricula, nombre } = JSON.parse(userData);
                    setEncargado({ matricula, nombre });
                }
            } catch (error) {
                console.error('Error al cargar encargado:', error);
            }
        };
        loadEncargado();

        const subscription = DeviceEventEmitter.addListener('QR_RESULT', async (data) => {
            if (scanned) return;
            setScanned(true);

            try {
                console.log('Enviando al servidor:', {
                    idMenor: data,
                    matriculaEncargado: encargado.matricula,
                    nombreEncargado: encargado.nombre,
                    tipo: tipo
                });
                const response = await fetch('https://sntss.org/api_registrar_asistencia.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idMenor: data,
                        matriculaEncargado: encargado.matricula,
                        nombreEncargado: encargado.nombre,
                        tipo: tipo
                    })
                });

                const result = await response.json();
                Alert.alert(
                    result.success ? '✅ Éxito' : '❌ Error',
                    result.message,
                    [{ text: 'OK', onPress: () => setScanned(false) }]
                );
            } catch (error) {
                Alert.alert('Error de red', 'No se pudo conectar al servidor');
                setScanned(false);
            }
        });

        return () => subscription.remove();
    }, [encargado, scanned, tipo]);

    const solicitarPermisoYEscaneo = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permiso de cámara',
                    message: 'La app necesita acceso a la cámara para escanear QR',
                    buttonNeutral: 'Preguntar después',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setScanned(false);
                QRScanner.openScanner();
            } else {
                Alert.alert('Permiso denegado', 'No podemos escanear sin la cámara');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <View style={styles.container}>
            {/* Círculos decorativos - estilo consistente */}
            <View style={styles.circleDecoration1} />
            <View style={styles.circleDecoration2} />
            <View style={styles.circleDecoration3} />

            <View style={styles.card}>
                <Text style={styles.title}>Registro de Asistencia</Text>
                <Text style={styles.subtitle}>Encargado: {encargado.nombre || 'Cargando...'}</Text>

                {/* Botones para seleccionar tipo */}
                <View style={styles.tipoContainer}>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'entrada' && styles.tipoActivo]}
                        onPress={() => setTipo('entrada')}>
                        <Text style={[styles.tipoText, tipo === 'entrada' && styles.tipoTextActivo]}>Entrada</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'salida' && styles.tipoActivo]}
                        onPress={() => setTipo('salida')}>
                        <Text style={[styles.tipoText, tipo === 'salida' && styles.tipoTextActivo]}>Salida</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={solicitarPermisoYEscaneo}>
                    <Text style={styles.buttonText}>Abrir Escáner</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.secondaryButtonText}>Regresar</Text>
                </TouchableOpacity>
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
    // Círculos decorativos - exactamente como en Panel
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
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 30,
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
        borderWidth: 1,
        borderColor: 'rgba(0, 60, 130, 0.1)',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003c82',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#4a6fa5',
        marginBottom: 25,
        textAlign: 'center',
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    tipoButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#F5F8FF',
        borderWidth: 1,
        borderColor: '#003c82',
        alignItems: 'center',
    },
    tipoActivo: {
        backgroundColor: '#003c82',
        borderColor: '#003c82',
    },
    tipoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#003c82',
    },
    tipoTextActivo: {
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#003c82',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
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
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButton: {
        backgroundColor: '#F5F8FF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#003c82',
        borderStyle: 'dashed',
        width: '100%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#003c82',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
});