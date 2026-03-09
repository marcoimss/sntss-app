import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Platform
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function ConfirmacionScreen({ route, navigation }: any) {
    const { datosFijos } = route.params;

    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [tipoContratacion, setTipoContratacion] = useState('base');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [ineUri, setIneUri] = useState<string | null>(null);
    const [tarjetonUri, setTarjetonUri] = useState<string | null>(null);
    const [fotoUri, setFotoUri] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const validarCorreo = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const seleccionarImagen = (setter: (uri: string) => void) => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: false,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'No se pudo seleccionar la imagen');
                console.log('ImagePicker Error: ', response.errorMessage);
                return;
            }
            if (response.assets && response.assets[0]?.uri) {
                setter(response.assets[0].uri);
            }
        });
    };

    const handleRegistro = async () => {
        if (!correo || !telefono || !fechaIngreso || !password || !confirmPassword) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        if (!validarCorreo(correo)) {
            Alert.alert('Error', 'Correo inválido');
            return;
        }
        if (telefono.length < 10) {
            Alert.alert('Error', 'Teléfono debe tener 10 dígitos');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        if (!ineUri || !tarjetonUri || !fotoUri) {
            Alert.alert('Error', 'Debes subir los tres documentos');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('matricula', datosFijos.matricula);
        formData.append('seccion', datosFijos.seccion);
        formData.append('nombre', datosFijos.nombre);
        formData.append('curp', datosFijos.curp);
        formData.append('rfc', datosFijos.rfc);
        formData.append('categoria', datosFijos.categoria);
        formData.append('adscripcion', datosFijos.adscripcion);
        formData.append('correo', correo);
        formData.append('telefono', telefono);
        formData.append('tc', tipoContratacion);
        formData.append('fecha_ingreso', fechaIngreso);
        formData.append('pass', password);

        // Archivos
        formData.append('ine', {
            uri: ineUri,
            type: 'image/jpeg',
            name: `ine_${datosFijos.matricula}.jpg`,
        } as any);
        formData.append('tarjeton', {
            uri: tarjetonUri,
            type: 'image/jpeg',
            name: `tarjeton_${datosFijos.matricula}.jpg`,
        } as any);
        formData.append('foto', {
            uri: fotoUri,
            type: 'image/jpeg',
            name: `foto_${datosFijos.matricula}.jpg`,
        } as any);

        try {
            const response = await fetch('https://sntss.org/api_registro.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.log('Respuesta cruda:', text);
                Alert.alert('Error', 'Respuesta inválida del servidor');
                setLoading(false);
                return;
            }

            if (data.success) {
                Alert.alert('Éxito', 'Registro completado. Ahora puedes iniciar sesión.');
                navigation.popToTop();
            } else {
                Alert.alert('Error', data.message || 'No se pudo registrar');
            }
        } catch (error) {
            Alert.alert('Error de conexión', 'Verifica tu internet');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Círculos decorativos - 3 como en Panel */}
            <View style={styles.circleDecoration1} />
            <View style={styles.circleDecoration2} />
            <View style={styles.circleDecoration3} />

            <Text style={styles.mainTitle}>Confirmación</Text>
            <Text style={styles.welcomeSubtitle}>Verifica y completa tus datos</Text>

            <View style={styles.card}>
                {/* Datos fijos */}
                <View style={styles.fixedData}>
                    <Text style={styles.fixedLabel}>Nombre:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.nombre}</Text>

                    <Text style={styles.fixedLabel}>Matrícula:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.matricula}</Text>

                    <Text style={styles.fixedLabel}>Sección:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.seccion}</Text>

                    <Text style={styles.fixedLabel}>CURP:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.curp}</Text>

                    <Text style={styles.fixedLabel}>RFC:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.rfc}</Text>

                    <Text style={styles.fixedLabel}>Categoría:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.categoria}</Text>

                    <Text style={styles.fixedLabel}>Adscripción:</Text>
                    <Text style={styles.fixedValue}>{datosFijos.adscripcion}</Text>
                </View>

                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor="#8A9BB5"
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Teléfono (10 dígitos)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="5512345678"
                    placeholderTextColor="#8A9BB5"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                    maxLength={10}
                />

                <Text style={styles.inputLabel}>Fecha de ingreso IMSS</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#8A9BB5"
                    value={fechaIngreso}
                    onChangeText={setFechaIngreso}
                />

                <Text style={styles.inputLabel}>Tipo de contratación</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={tipoContratacion}
                        onValueChange={(itemValue: string) => setTipoContratacion(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#003c82"
                    >
                        <Picker.Item label="Base" value="base" />
                        <Picker.Item label="02" value="02" />
                    </Picker>
                </View>

                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#8A9BB5"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.inputLabel}>Confirmar contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor="#8A9BB5"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <Text style={styles.sectionTitle}>Documentos requeridos</Text>

                <TouchableOpacity style={styles.uploadButton} onPress={() => seleccionarImagen(setIneUri)}>
                    <Text style={styles.uploadButtonText}>Subir INE</Text>
                </TouchableOpacity>
                {ineUri && <Text style={styles.fileName}>Archivo: INE seleccionado</Text>}

                <TouchableOpacity style={styles.uploadButton} onPress={() => seleccionarImagen(setTarjetonUri)}>
                    <Text style={styles.uploadButtonText}>Subir Último tarjetón</Text>
                </TouchableOpacity>
                {tarjetonUri && <Text style={styles.fileName}>Archivo: Tarjetón seleccionado</Text>}

                <TouchableOpacity style={styles.uploadButton} onPress={() => seleccionarImagen(setFotoUri)}>
                    <Text style={styles.uploadButtonText}>Subir Foto del trabajador</Text>
                </TouchableOpacity>
                {fotoUri && <Text style={styles.fileName}>Archivo: Foto seleccionada</Text>}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRegistro}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'REGISTRANDO...' : 'Registrar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F7FF',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Círculos decorativos - 3 como en Panel
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
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#003c82',
        marginBottom: 5,
        letterSpacing: 2,
        textAlign: 'center',
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
        // Sombra azul como en Panel
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
    },
    inputLabel: {
        color: '#003c82',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F5F8FF',
        color: '#003c82',
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E8F0',
        fontSize: 15,
    },
    pickerContainer: {
        backgroundColor: '#F5F8FF',
        borderWidth: 1,
        borderColor: '#E0E8F0',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        color: '#003c82',
        height: 50,
    },
    button: {
        backgroundColor: '#003c82',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        // Sombra azul como en Panel
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
    buttonDisabled: {
        backgroundColor: '#4a6fa5',
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    fixedData: {
        backgroundColor: '#F0F7FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D4AF37',
    },
    fixedLabel: {
        color: '#4a6fa5',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
    },
    fixedValue: {
        color: '#003c82',
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '500',
    },
    sectionTitle: {
        color: '#003c82',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    uploadButton: {
        backgroundColor: '#F5F8FF',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#003c82', // Cambiado de dorado a azul
        borderStyle: 'dashed',
        marginBottom: 10,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#003c82',
        fontSize: 14,
        fontWeight: '500',
    },
    fileName: {
        color: '#4a6fa5',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
});