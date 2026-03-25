import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Platform,
    Dimensions,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Home, LogIn, User, Lock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
    const { colors, theme } = useTheme();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
                    Iniciar Sesión
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

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Título principal */}
                <Text style={[styles.mainTitle, { color: colors.cardAccent }]}>SNTSS</Text>
                <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                    ¡Bienvenido! Inicie sesión para continuar
                </Text>

                {/* Tarjeta de login */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    {/* Campo Matrícula */}
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Matrícula</Text>
                    <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                        <User size={20} color={colors.cardAccent} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Ingrese su matrícula"
                            placeholderTextColor={colors.textSecondary + '80'}
                            style={[styles.input, { color: colors.textPrimary }]}
                            value={usuario}
                            onChangeText={setUsuario}
                        />
                    </View>

                    {/* Campo Contraseña */}
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Contraseña</Text>
                    <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                        <Lock size={20} color={colors.cardAccent} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Ingrese su contraseña"
                            placeholderTextColor={colors.textSecondary + '80'}
                            style={[styles.input, { color: colors.textPrimary }]}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Enlace olvidé contraseña */}
                    <TouchableOpacity style={styles.forgotContainer}>
                        <Text style={[styles.forgotPassword, { color: colors.cardAccent }]}>
                            ¿Olvidó su contraseña?
                        </Text>
                    </TouchableOpacity>

                    {/* Botón Acceder */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.cardAccent }, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LogIn color="#FFF" size={20} />
                        <Text style={styles.buttonText}>
                            {loading ? 'INGRESANDO...' : 'Acceder'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divisor O TAMBIÉN */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.textSecondary + '30' }]} />
                        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>O TAMBIÉN</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.textSecondary + '30' }]} />
                    </View>

                    {/* Registro primer ingreso */}
                    <View style={styles.registerContainer}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>
                            ¿Es su primer ingreso?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Busqueda')}>
                            <Text style={[styles.registerLink, { color: colors.cardAccent }]}>
                                Registrarse por primera vez →
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Opción para seguir como invitado */}
                <TouchableOpacity 
                    style={styles.guestButton}
                    onPress={handleGoToPanel}
                >
                    <Text style={[styles.guestText, { color: colors.textSecondary }]}>
                        Continuar como invitado
                    </Text>
                </TouchableOpacity>
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
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#003c82',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 2,
    },
    welcomeSubtitle: {
        fontSize: 14,
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
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
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    forgotPassword: {
        fontSize: 13,
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
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
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        paddingHorizontal: 10,
        fontSize: 12,
        fontWeight: '500',
    },
    registerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    registerText: {
        fontSize: 13,
    },
    registerLink: {
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    guestButton: {
        marginTop: 20,
        paddingVertical: 12,
    },
    guestText: {
        fontSize: 13,
        textDecorationLine: 'underline',
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