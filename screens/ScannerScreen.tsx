// @ts-nocheck
import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    PermissionsAndroid,
    DeviceEventEmitter,
    Platform,
    Dimensions,
    SafeAreaView,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRScanner from 'react-native-qr-scanner-advanced';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, QrCode, LogIn, LogOut, User, Home, Camera } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen({ navigation }: any) {
    const { colors, theme } = useTheme();
    const [encargado, setEncargado] = useState({ matricula: '', nombre: '' });
    const [scanned, setScanned] = useState(false);
    const [tipo, setTipo] = useState('entrada');

    // PARTÍCULAS GALÁCTICAS
    const particles = useMemo(() => 
        Array.from({ length: 60 }).map((_, i) => ({
            key: i,
            left: Math.random() * width,
            top: Math.random() * height,
            size: Math.random() * 3 + 1,
            color: colors.particleColors[i % colors.particleColors.length],
            opacity: Math.random() * 0.5 + 0.2,
        })), [colors.particleColors]
    );

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
        if (Platform.OS === 'android') {
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
        } else {
            setScanned(false);
            QRScanner.openScanner();
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleGoToPanel = () => {
        navigation.navigate('Panel');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* PARTÍCULAS GALÁCTICAS */}
            <View style={StyleSheet.absoluteFillObject}>
                {particles.map((p) => (
                    <View
                        key={p.key}
                        style={{
                            position: 'absolute',
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            borderRadius: p.size / 2,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                        }}
                    />
                ))}
            </View>

            {/* CÍRCULOS DECORATIVOS DINÁMICOS */}
            <View style={[styles.circleDecoration1, { backgroundColor: colors.circle1 }]} />
            <View style={[styles.circleDecoration2, { backgroundColor: colors.circle2 }]} />
            <View style={[styles.circleDecoration3, { backgroundColor: colors.circle3 }]} />

            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

                {/* HEADER CON BOTONES */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={handleGoBack}
                        style={[
                            styles.backButton,
                            { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        ]}
                    >
                        <ArrowLeft color={colors.textPrimary} size={24} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Escáner QR
                    </Text>
                    <TouchableOpacity 
                        onPress={handleGoToPanel}
                        style={[
                            styles.homeButton,
                            { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                        ]}
                    >
                        <Home color={colors.textPrimary} size={22} />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        {/* Icono de QR */}
                        <View style={[styles.qrIconContainer, { backgroundColor: colors.textPrimary  + '20' }]}>
                            <QrCode color={colors.textPrimary } size={48} />
                        </View>

                        <Text style={[styles.title, { color: colors.textPrimary }]}>Registro de Asistencia</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            <User size={14} color={colors.textSecondary} /> Encargado: {encargado.nombre || 'Cargando...'}
                        </Text>

                        {/* Botones para seleccionar tipo */}
                        <View style={styles.tipoContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tipoButton, 
                                    { 
                                        backgroundColor: tipo === 'entrada' ? colors.cardAccent : colors.cardAccent + '20',
                                        borderColor: colors.cardAccent 
                                    }
                                ]}
                                onPress={() => setTipo('entrada')}
                            >
                                <LogIn 
                                    size={18} 
                                    color={tipo === 'entrada' ? '#FFF' : colors.cardAccent} 
                                />
                                <Text style={[
                                    styles.tipoText, 
                                    { 
                                        color: tipo === 'entrada' ? '#FFF' : colors.cardAccent,
                                        fontWeight: tipo === 'entrada' ? 'bold' : '500'
                                    }
                                ]}>
                                    Entrada
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.tipoButton, 
                                    { 
                                        backgroundColor: tipo === 'salida' ? colors.cardAccent : colors.cardAccent + '20',
                                        borderColor: colors.cardAccent 
                                    }
                                ]}
                                onPress={() => setTipo('salida')}
                            >
                                <LogOut 
                                    size={18} 
                                    color={tipo === 'salida' ? '#FFF' : colors.textPrimary } 
                                />
                                <Text style={[
                                    styles.tipoText, 
                                    { 
                                        color: tipo === 'salida' ? '#FFF' : colors.textPrimary ,
                                        fontWeight: tipo === 'salida' ? 'bold' : '500'
                                    }
                                ]}>
                                    Salida
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Botón Abrir Escáner */}
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.cardAccent }]} 
                            onPress={solicitarPermisoYEscaneo}
                        >
                            <Camera color="#FFF" size={20} />
                            <Text style={styles.buttonText}>Abrir Escáner</Text>
                        </TouchableOpacity>

                        {/* Botón Regresar */}
                        <TouchableOpacity 
                            style={[styles.secondaryButton, { borderColor: colors.cardAccent }]}
                            onPress={handleGoBack}
                        >
                            <ArrowLeft color={colors.textPrimary } size={18} />
                            <Text style={[styles.secondaryButtonText, { color: colors.textPrimary  }]}>
                                Regresar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 25,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    qrIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 25,
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        gap: 12,
    },
    tipoButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    tipoText: {
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 25,
        width: '100%',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#003c82',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1.5,
        width: '100%',
        backgroundColor: 'transparent',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },

    // CÍRCULOS DECORATIVOS
    circleDecoration1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        top: -150,
        right: -150,
        opacity: 0.1,
    },
    circleDecoration2: {
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: 175,
        bottom: -120,
        left: -120,
        opacity: 0.1,
    },
    circleDecoration3: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        bottom: 100,
        right: -80,
        opacity: 0.07,
    },
});