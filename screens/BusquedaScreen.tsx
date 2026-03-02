import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function BusquedaScreen({ navigation }: any) {
    const [matricula, setMatricula] = useState('');
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
    const [curp, setCurp] = useState('');
    const [loading, setLoading] = useState(false);
    const [cargandoSecciones, setCargandoSecciones] = useState(true);

    useEffect(() => {
        cargarSecciones();
    }, []);

    const cargarSecciones = async () => {
        try {
            const response = await fetch('https://sntss.org/api_secciones.php');
            const data = await response.json();
            if (data.success) {
                setSecciones(data.secciones);
            } else {
                Alert.alert('Error', 'No se pudieron cargar las secciones');
            }
        } catch (error) {
            Alert.alert('Error de conexión', 'Verifica tu internet');
        } finally {
            setCargandoSecciones(false);
        }
    };

    const handleBuscar = async () => {
        if (!matricula.trim() || !seccionSeleccionada || !curp.trim()) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://sntss.org/api_validar_registro.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matricula: matricula.trim(),
                    seccion: seccionSeleccionada,
                    curp: curp.trim().toUpperCase()
                })
            });

            const data = await response.json();

            if (data.success) {
                navigation.navigate('Confirmacion', {
                    datosFijos: data.datos
                });
            } else {
                Alert.alert('Error', data.message || 'No se pudo validar');
            }
        } catch (error) {
            Alert.alert('Error de conexión', 'Verifica tu internet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.circleDecoration} />
            <View style={[styles.circleDecoration, styles.bottomCircle]} />

            <Text style={styles.mainTitle}>Registro SNTSS</Text>
            <Text style={styles.welcomeSubtitle}>Primer ingreso - Verifica tus datos</Text>

            <View style={styles.card}>
                <Text style={styles.inputLabel}>Matrícula</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese su matrícula"
                    placeholderTextColor="#8A9BB5"
                    value={matricula}
                    onChangeText={setMatricula}
                    keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Sección</Text>
                <View style={styles.pickerContainer}>
                    {cargandoSecciones ? (
                        <ActivityIndicator size="small" color="#003c82" />
                    ) : (
                        <Picker
                            selectedValue={seccionSeleccionada}
                            onValueChange={(itemValue: string) => setSeccionSeleccionada(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#003c82"
                        >
                            <Picker.Item label="Seleccione una sección" value="" />
                            {secciones.map((sec: any) => (
                                <Picker.Item
                                    key={sec.id}
                                    label={`${sec.romano} - ${sec.nombre}`}
                                    value={sec.idSeccion}
                                />
                            ))}
                        </Picker>
                    )}
                </View>

                <Text style={styles.inputLabel}>CURP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese su CURP"
                    placeholderTextColor="#8A9BB5"
                    value={curp}
                    onChangeText={(text) => setCurp(text.toUpperCase())}
                    autoCapitalize="characters"
                    maxLength={18}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleBuscar}
                    disabled={loading || cargandoSecciones}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'VALIDANDO...' : 'Buscar →'}
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
});