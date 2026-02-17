import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Pantalla de perfil del usuario. Muestra los datos almacenados después del login.
export default function PerfilScreen({ navigation }: any) {
    // Estado para almacenar los datos del usuario recuperados de AsyncStorage
    const [userData, setUserData] = useState({
        nombre: '',
        matricula: '',
        seccion: '',
        categoria: '',
        adscripcion: '',
        telefono: '',
        correo: '',
    });

    // useFocusEffect se ejecuta cada vez que la pantalla obtiene el foco (al navegar a ella)
    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                try {
                    // Recupera la cadena JSON guardada bajo la clave 'userData'
                    const data = await AsyncStorage.getItem('userData');
                    if (data) {
                        // Parsea el JSON y actualiza el estado
                        setUserData(JSON.parse(data));
                    } else {
                        // Si no hay datos, redirige al login (sesión expirada o no iniciada)
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

    // Función para cerrar sesión: elimina los datos guardados y navega al login
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Círculos decorativos superiores e inferiores (estilo consistente con Login) */}
            <View style={[styles.circleDecoration, styles.topCircle]} />
            <View style={[styles.circleDecoration, styles.bottomCircle]} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Contenedor del avatar/logo */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../assets/logo.png')} // Ruta relativa al logo (desde screens/)
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>

                {/* Mensajes de bienvenida personalizados */}
                <Text style={styles.welcomeText}>Bienvenido,</Text>
                <Text style={styles.nameText}>{userData.nombre || 'Compañero'}</Text>

                {/* Tarjeta que muestra los datos del usuario */}
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
                    {/* Puedes agregar más campos si la API los envía y los guardas en AsyncStorage */}
                </View>

                {/* Botón para cerrar sesión */}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Hoja de estilos (consistente con la paleta de colores del sindicato)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Azul marino institucional
    },
    // Decoraciones circulares (fondo)
    circleDecoration: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#00a8ff',
        opacity: 0.3,
    },
    topCircle: {
        top: -100,
        right: -100,
    },
    bottomCircle: {
        bottom: -100,
        left: -100,
        backgroundColor: '#D4AF37', // Dorado con opacidad
        opacity: 0.15,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 100,
        padding: 10,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#D4AF37',
    },
    welcomeText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '300',
        textAlign: 'center',
    },
    nameText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D4AF37',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0B2A5C',
    },
    value: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#B22234', // Rojo institucional
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
});