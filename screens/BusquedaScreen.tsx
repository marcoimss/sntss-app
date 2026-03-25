import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    Platform,
    Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Home, Search, User, MapPin, FileText, AlertCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function BusquedaScreen({ navigation }: any) {
    const { colors, theme } = useTheme();
    const [matricula, setMatricula] = useState('');
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
    const [curp, setCurp] = useState('');
    const [loading, setLoading] = useState(false);
    const [cargandoSecciones, setCargandoSecciones] = useState(true);

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
                    Primer Registro
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
                <Text style={[styles.mainTitle, { color: colors.cardAccent }]}>Registro SNTSS</Text>
                <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                    Primer ingreso - Verifica tus datos
                </Text>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    {/* Campo Matrícula */}
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                        <User size={16} color={colors.cardAccent} /> Matrícula
                    </Text>
                    <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                        <User size={20} color={colors.cardAccent} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary }]}
                            placeholder="Ingrese su matrícula"
                            placeholderTextColor={colors.textSecondary + '80'}
                            value={matricula}
                            onChangeText={setMatricula}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Campo Sección */}
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                        <MapPin size={16} color={colors.cardAccent} /> Sección
                    </Text>
                    <View style={[styles.pickerContainer, { backgroundColor: colors.cardAccent + '10', borderColor: colors.cardAccent }]}>
                        {cargandoSecciones ? (
                            <ActivityIndicator size="small" color={colors.cardAccent} style={styles.pickerLoading} />
                        ) : (
                            <Picker
                                selectedValue={seccionSeleccionada}
                                onValueChange={(itemValue: string) => setSeccionSeleccionada(itemValue)}
                                style={[styles.picker, { color: colors.textPrimary }]}
                                dropdownIconColor={colors.cardAccent}
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

                    {/* Campo CURP */}
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                        <FileText size={16} color={colors.cardAccent} /> CURP
                    </Text>
                    <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                        <FileText size={20} color={colors.cardAccent} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary }]}
                            placeholder="Ingrese su CURP"
                            placeholderTextColor={colors.textSecondary + '80'}
                            value={curp}
                            onChangeText={(text) => setCurp(text.toUpperCase())}
                            autoCapitalize="characters"
                            maxLength={18}
                        />
                    </View>

                    {/* Botón Buscar */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.cardAccent }, (loading || cargandoSecciones) && styles.buttonDisabled]}
                        onPress={handleBuscar}
                        disabled={loading || cargandoSecciones}
                    >
                        <Search color="#FFF" size={20} />
                        <Text style={styles.buttonText}>
                            {loading ? 'VALIDANDO...' : 'Buscar'}
                        </Text>
                    </TouchableOpacity>

                    {/* Mensaje informativo */}
                    <View style={styles.infoContainer}>
                        <AlertCircle size={14} color={colors.textSecondary} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Ingresa los datos que aparecen en tu credencial del SNTSS
                        </Text>
                    </View>
                </View>
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 2,
        textAlign: 'center',
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
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
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
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
    },
    pickerLoading: {
        paddingVertical: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 12,
        marginTop: 20,
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
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    infoText: {
        fontSize: 11,
        textAlign: 'center',
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