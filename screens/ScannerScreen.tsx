import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRScanner from 'react-native-qr-scanner-advanced';

export default function ScannerScreen({ navigation }: any) {
    const [encargado, setEncargado] = useState({ matricula: '', nombre: '' });
    const [scanned, setScanned] = useState(false);
    const [tipo, setTipo] = useState('entrada'); // 'entrada' o 'salida'

    useEffect(() => {
        // Cargar datos del encargado desde AsyncStorage
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

        // Listener del QR
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
            <View style={styles.circleDecoration} />
            <View style={styles.card}>
                <Text style={styles.title}>Registro de Asistencia</Text>
                <Text style={styles.subtitle}>Encargado: {encargado.nombre || 'Cargando...'}</Text>

                {/* Botones para seleccionar tipo */}
                <View style={styles.tipoContainer}>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'entrada' && styles.tipoActivo]}
                        onPress={() => setTipo('entrada')}>
                        <Text style={styles.tipoText}>Entrada</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'salida' && styles.tipoActivo]}
                        onPress={() => setTipo('salida')}>
                        <Text style={styles.tipoText}>Salida</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={solicitarPermisoYEscaneo}>
                    <Text style={styles.buttonText}>Abrir Escáner</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.circleDecoration, styles.bottomCircle]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B2A5C',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleDecoration: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#1E3F7A',
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
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0B2A5C',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#0B2A5C',
        marginBottom: 20,
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 25,
    },
    tipoButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#F5F8FF',
        borderWidth: 1,
        borderColor: '#D4AF37',
        alignItems: 'center',
    },
    tipoActivo: {
        backgroundColor: '#B22234',
        borderColor: '#B22234',
    },
    tipoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B2A5C',
    },
    button: {
        backgroundColor: '#B22234',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});