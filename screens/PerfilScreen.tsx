import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, User, LogIn, Home } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function PerfilScreen({ navigation }: any) {
    const { colors, theme } = useTheme();
    const [userData, setUserData] = useState({
        nombre: '',
        matricula: '',
        seccion: '',
        categoria: '',
        adscripcion: '',
        telefono: '',
        correo: '',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

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

    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                try {
                    const data = await AsyncStorage.getItem('userData');
                    if (data) {
                        const parsed = JSON.parse(data);
                        setUserData(parsed);
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                        setUserData({
                            nombre: '',
                            matricula: '',
                            seccion: '',
                            categoria: '',
                            adscripcion: '',
                            telefono: '',
                            correo: '',
                        });
                    }
                    // Cargar avatar guardado desde PanelScreen
                    const savedAvatar = await AsyncStorage.getItem('@user_avatar');
                    setUserAvatar(savedAvatar);
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    setIsLoggedIn(false);
                }
            };
            loadUserData();
        }, [])
    );

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const handleGoBack = () => {
        navigation.goBack();
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

            {/* HEADER CON BOTÓN DE REGRESO */}
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
                    Mi Perfil
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Contenedor del avatar/logo */}
                <View style={[styles.avatarContainer, { backgroundColor: colors.card + 'cc' }]}>
                    {userAvatar ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${userAvatar}` }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {isLoggedIn ? (
                    <>
                        {/* Título y nombre */}
                        <Text style={[styles.title, { color: colors.cardAccent }]}>
                            ¡Bienvenido!
                        </Text>
                        <Text style={[styles.nameText, { color: colors.textPrimary }]}>
                            {userData.nombre || 'Compañero SNTSS'}
                        </Text>

                        {/* Tarjeta de datos */}
                        <View style={[styles.card, { backgroundColor: colors.card }]}>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Matrícula:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.matricula || 'No registrada'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Sección:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.seccion || 'No registrada'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Categoría:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.categoria || 'No registrada'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Adscripción:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.adscripcion || 'No registrada'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Teléfono:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.telefono || 'No registrado'}</Text>
                            </View>
                            <View style={[styles.infoRow, styles.lastRow]}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Correo:</Text>
                                <Text style={[styles.value, { color: colors.textPrimary }]}>{userData.correo || 'No registrado'}</Text>
                            </View>
                        </View>

                        {/* Botón Regresar al Panel */}
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.cardAccent }]}
                            onPress={() => navigation.navigate('Panel')}
                        >
                            <Home color="#FFF" size={20} />
                            <Text style={styles.buttonText}>REGRESAR AL PANEL</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* Mensaje para invitados */}
                        <View style={[styles.guestCard, { backgroundColor: colors.card }]}>
                            <User color={colors.cardAccent} size={48} />
                            <Text style={[styles.guestTitle, { color: colors.textPrimary }]}>
                                Modo Invitado
                            </Text>
                            <Text style={[styles.guestText, { color: colors.textSecondary }]}>
                                Inicia sesión para ver tu información personal y acceder a más funciones.
                            </Text>
                        </View>

                        {/* Botón Iniciar Sesión */}
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: colors.cardAccent }]}
                            onPress={handleLoginPress}
                        >
                            <LogIn color="#FFF" size={20} />
                            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
                        </TouchableOpacity>

                        {/* Botón Regresar al Panel */}
                        <TouchableOpacity 
                            style={[styles.secondaryButton, { borderColor: colors.cardAccent }]}
                            onPress={() => navigation.navigate('Panel')}
                        >
                            <Home color={colors.cardAccent} size={20} />
                            <Text style={[styles.secondaryButtonText, { color: colors.cardAccent }]}>
                                SEGUIR COMO INVITADO
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    avatarContainer: {
        marginBottom: 20,
        borderRadius: 100,
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#003c82',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#003c82',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    nameText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '500',
    },
    card: {
        borderRadius: 20,
        padding: 20,
        width: '100%',
        marginBottom: 30,
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 10,
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
        maxWidth: 280,
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
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 1.5,
        width: '100%',
        maxWidth: 280,
        marginTop: 12,
        backgroundColor: 'transparent',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    guestCard: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
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
    guestTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
    },
    guestText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
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