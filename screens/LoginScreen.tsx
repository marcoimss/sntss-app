import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Almacenamiento local para guardar datos de sesión

// Componente principal de la pantalla de Login
// Recibe 'navigation' como prop para poder navegar a otras pantallas después del login exitoso
export default function LoginScreen({ navigation }: any) {
    // Estados locales para manejar los inputs y el estado de carga
    const [usuario, setUsuario] = useState('');        // Almacena la matrícula ingresada
    const [password, setPassword] = useState('');      // Almacena la contraseña
    const [loading, setLoading] = useState(false);     // Indica si está procesando la petición (para deshabilitar botón)

    // Función principal que se ejecuta al presionar el botón INGRESAR
    const handleLogin = async () => {
        // Validación rápida: campos vacíos
        if (!usuario || !password) {
            Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
            return;
        }

        // Inicia la carga: deshabilita el botón y muestra "INGRESANDO..."
        setLoading(true);

        try {
            // LOG DE DEPURACIÓN: muestra en consola (solo visible con Debug JS Remotely) lo que se enviará
            console.log('Enviando:', { matricula: usuario, pass: password, tipo: 'a' });

            // PETICIÓN HTTP al endpoint de la API (archivo PHP en el servidor)
            const response = await fetch('https://sntss.org/api_login.php', {
                method: 'POST',                          // Método POST como espera el backend
                headers: {
                    'Content-Type': 'application/json', // Indicamos que enviamos JSON
                },
                body: JSON.stringify({                   // Convertimos el objeto a JSON
                    matricula: usuario,                  // Campo esperado por el backend (matricula)
                    pass: password,                      // Campo esperado por el backend (pass)
                    tipo: 'a',                           // Tipo de usuario (activo por defecto)
                }),
            });

            // Procesamos la respuesta JSON que viene del servidor
            const data = await response.json();

            // Verificamos si el login fue exitoso (campo 'success' true)
            if (data.success) {
                // Guardamos TODOS los datos del usuario en AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify({
                    nombre: data.nombre,
                    matricula: data.matricula,
                    seccion: data.seccion,
                    categoria: data.categoria,
                    adscripcion: data.adscripcion,
                    telefono: data.telefono,
                    correo: data.correo,
                }));

                navigation.navigate('Perfil');
            } else {
                // Si el servidor responde con success: false, mostramos el mensaje de error que envía
                Alert.alert('Error', data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            // Error de red o de conexión (ej. servidor caído, sin internet, problema de SSL)
            Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu internet.');
            console.error(error); // Mostramos el error detallado en la consola para depurar
        } finally {
            // Finaliza la carga, reactiva el botón
            setLoading(false);
        }
    };

    // RENDERIZADO DE LA INTERFAZ
    return (
        <View style={styles.container}>
            {/* Elementos decorativos: círculos de fondo con opacidad */}
            <View style={styles.circleDecoration} />

            {/* Logo del sindicato (desde la carpeta assets) */}
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Tarjeta blanca que contiene el formulario */}
            <View style={styles.card}>
                <Text style={styles.welcomeText}>Bienvenido</Text>

                {/* Campo de texto para el usuario (matrícula) */}
                <TextInput
                    placeholder="Usuario"
                    placeholderTextColor="#8A9BB5"
                    style={styles.input}
                    value={usuario}
                    onChangeText={setUsuario}            // Actualiza el estado 'usuario'
                />

                {/* Campo de texto para la contraseña (con secureTextEntry para ocultar) */}
                <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#8A9BB5"
                    style={styles.input}
                    secureTextEntry                       // oculta el texto
                    value={password}
                    onChangeText={setPassword}             // Actualiza el estado 'password'
                />

                {/* Botón de ingreso: se deshabilita cuando 'loading' es true */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'INGRESANDO...' : 'INGRESAR'}
                    </Text>
                </TouchableOpacity>

                {/* Enlace para recuperación de contraseña (aún no funcional) */}
                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </View>

            {/* Círculo decorativo inferior (dorado) */}
            <View style={[styles.circleDecoration, styles.bottomCircle]} />
        </View>
    );
}

// ESTILOS (colores institucionales del SNTSS)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Azul marino del fondo del escudo
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleDecoration: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#00a8ff', // Azul más claro
        top: -100,
        right: -100,
        opacity: 0.3,
    },
    bottomCircle: {
        top: undefined,
        bottom: -100,
        left: -100,
        right: undefined,
        backgroundColor: '#D4AF37', // Dorado del escudo
        opacity: 0.15,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8, // Sombra en Android
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0B2A5C',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#F5F8FF',
        color: '#0B2A5C',
        marginBottom: 20,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D4AF37', // Borde dorado
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2a8adeff', // Rojo del escudo
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#B22234',
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    forgotPassword: {
        color: '#8A9BB5',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        fontWeight: '500',
    },
});