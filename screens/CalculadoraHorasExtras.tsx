import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Clock, Calculator, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function CalculadoraHorasExtras({ navigation }: any) {
    const { colors, theme } = useTheme();

    const [smi, setSmi] = useState('');
    const [jornada, setJornada] = useState('8');
    const [horas, setHoras] = useState('');
    const [isInfecto, setIsInfecto] = useState(false);
    const [resultado, setResultado] = useState<any>(null);

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

    const calcular = () => {
        const smiNum = parseFloat(smi);
        const horasNum = parseFloat(horas);
        const jornadaNum = parseFloat(jornada);

        if (isNaN(smiNum) || smiNum <= 0 || isNaN(horasNum) || horasNum <= 0) {
            Alert.alert('Error', 'Por favor, ingresa los datos requeridos correctamente');
            return;
        }

        // Lógica: 12 horas usa 8 como base de contrato
        const jornadaEfectiva = (jornadaNum === 12) ? 8 : jornadaNum;

        const obtenerPago = (baseSueldo: number) => {
            const salarioDiario = baseSueldo / 30;
            const valorHoraNormal = salarioDiario / jornadaEfectiva;
            const valorHoraExtra = valorHoraNormal * 2;
            return valorHoraExtra * horasNum;
        };

        setResultado({
            normal: obtenerPago(smiNum),
            conInfecto: isInfecto ? obtenerPago(smiNum * 1.20) : null
        });
    };

    const format = (val: number) => 
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

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

            {/* CÍRCULOS DECORATIVOS */}
            <View style={[styles.circleDecoration1, { backgroundColor: colors.circle1 }]} />
            <View style={[styles.circleDecoration2, { backgroundColor: colors.circle2 }]} />
            <View style={[styles.circleDecoration3, { backgroundColor: colors.circle3 }]} />

            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

                {/* Header con botón de regreso */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={colors.textPrimary} size={24} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Horas Extras</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={[styles.cardHeader, { backgroundColor: colors.cardAccent }]}>
                            <Clock color="#FFF" size={24} />
                            <Text style={styles.cardTitle}>Pago de Horas Extras</Text>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textPrimary }]}>Sueldo Mensual Integrado (SMI):</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F8FF',
                                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#E0E8F0',
                                            color: colors.textPrimary
                                        }
                                    ]}
                                    placeholder="Ej: 12500.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                    value={smi}
                                    onChangeText={setSmi}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textPrimary }]}>Jornada Laboral:</Text>
                                <View style={styles.pickerContainer}>
                                    {['6.5', '8', '12'].map((opcion) => (
                                        <TouchableOpacity 
                                            key={opcion}
                                            style={[
                                                styles.chip, 
                                                jornada === opcion && styles.chipActive,
                                                { 
                                                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#ddd',
                                                    backgroundColor: jornada === opcion ? colors.cardAccent : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fafafa')
                                                }
                                            ]}
                                            onPress={() => setJornada(opcion)}
                                        >
                                            <Text style={[
                                                styles.chipText, 
                                                jornada === opcion && styles.chipTextActive,
                                                { color: jornada === opcion ? '#FFF' : colors.textSecondary }
                                            ]}>
                                                {opcion === '12' ? '12h (Velada)' : `${opcion}h`}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textPrimary }]}>Horas Extras Trabajadas:</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F8FF',
                                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#E0E8F0',
                                            color: colors.textPrimary
                                        }
                                    ]}
                                    placeholder="Ej: 5"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                    value={horas}
                                    onChangeText={setHoras}
                                />
                            </View>

                            <View style={styles.switchContainer}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>Infectocontagiosidad</Text>
                                    <Text style={[styles.switchSubLabel, { color: colors.textSecondary }]}>Aplica un 20% adicional al SMI</Text>
                                </View>
                                <Switch
                                    value={isInfecto}
                                    onValueChange={setIsInfecto}
                                    trackColor={{ false: "#d1d1d1", true: colors.cardAccent }}
                                    thumbColor={isInfecto ? '#FFF' : '#f4f3f4'}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.cardAccent }]}
                                onPress={calcular}
                            >
                                <Calculator color="#FFF" size={20} />
                                <Text style={styles.buttonText}>Calcular Pago Doble</Text>
                            </TouchableOpacity>

                            {resultado && (
                                <View style={styles.resWrapper}>
                                    <View style={[styles.resItem, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8F9FA' }]}>
                                        <Text style={[styles.resLabelText, { color: colors.textSecondary }]}>Pago Estándar:</Text>
                                        <Text style={[styles.resAmount, { color: colors.textPrimary }]}>{format(resultado.normal)}</Text>
                                    </View>

                                    {isInfecto && (
                                        <View style={[styles.resItem, styles.resInfecto, { backgroundColor: colors.cardAccent + '20' }]}>
                                            <Text style={[styles.resLabelText, { color: colors.textSecondary  }]}>Pago con 20%:</Text>
                                            <Text style={[styles.resAmount, { color: '#28a745' }]}>{format(resultado.conInfecto)}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    cardBody: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 18,
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    chip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
    },
    chipActive: {
        borderColor: 'transparent',
    },
    chipText: {
        fontWeight: '600',
        fontSize: 12,
    },
    chipTextActive: {
        color: '#FFF',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        marginBottom: 10,
    },
    switchLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    switchSubLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
        gap: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resWrapper: {
        marginTop: 25,
    },
    resItem: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    resInfecto: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    resLabelText: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
    },
    resAmount: {
        fontSize: 24,
        fontWeight: 'bold',
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