import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Banknote, Calculator, Award } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function CalculadoraClausula97({ navigation }: any) {
    const { colors, theme } = useTheme();

    const [c02, setC02] = useState('');
    const [c11, setC11] = useState('');
    const [resultados, setResultados] = useState<any>(null);

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
        const val02 = parseFloat(c02);
        const val11 = parseFloat(c11);

        if (isNaN(val02) || isNaN(val11)) {
            Alert.alert('Error', 'Por favor, ingresa ambos conceptos (002 y 011)');
            return;
        }

        // Lógica: baseMensual = (c02 + c11) * 2
        const baseMensual = (val02 + val11) * 2;

        setResultados({
            mes1: baseMensual * 1,
            mes2: baseMensual * 2,
            mes3: baseMensual * 3,
            mes4: baseMensual * 4,
        });
    };

    const format = (val: number) => 
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

    const niveles = [
        { label: '1 Mes', value: 'mes1', icon: '1️⃣', color: '#003c82' },
        { label: '2 Meses', value: 'mes2', icon: '2️⃣', color: '#1B476A' },
        { label: '3 Meses', value: 'mes3', icon: '3️⃣', color: '#2a8ade' },
        { label: '4 Meses', value: 'mes4', icon: '4️⃣', color: '#00a8ff' },
    ];

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
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Cláusula 97</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={[styles.cardHeader, { backgroundColor: colors.cardAccent }]}>
                            <Banknote color="#FFF" size={24} />
                            <Text style={styles.cardTitle}>Préstamos Cláusula 97</Text>
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                Calcula los montos disponibles para préstamos de 1 a 4 meses de sueldo base.
                            </Text>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textPrimary }]}>Concepto 002 (Sueldo):</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F8FF',
                                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#E0E8F0',
                                            color: colors.textPrimary
                                        }
                                    ]}
                                    placeholder="$ 0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                    value={c02}
                                    onChangeText={setC02}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textPrimary }]}>Concepto 011 (Ayuda):</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F8FF',
                                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#E0E8F0',
                                            color: colors.textPrimary
                                        }
                                    ]}
                                    placeholder="$ 0.00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                    value={c11}
                                    onChangeText={setC11}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.cardAccent }]}
                                onPress={calcular}
                            >
                                <Calculator color="#FFF" size={20} />
                                <Text style={styles.buttonText}>Calcular Niveles</Text>
                            </TouchableOpacity>

                            {resultados && (
                                <View style={styles.resultsGrid}>
                                    {niveles.map((nivel) => (
                                        <View
                                            key={nivel.value}
                                            style={[
                                                styles.resCard,
                                                {
                                                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                                                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E9ECEF'
                                                }
                                            ]}
                                        >
                                            <View style={styles.resHeader}>
                                                <Text style={styles.resIcon}>{nivel.icon}</Text>
                                                <Text style={[styles.resLabel, { color: colors.textSecondary }]}>{nivel.label}</Text>
                                            </View>
                                            <Text style={[styles.resValue, { color: colors.textSecondary }]}>
                                                {format(resultados[nivel.value])}
                                            </Text>
                                        </View>
                                    ))}
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
    description: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 13,
        lineHeight: 18,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
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
    resultsGrid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    resCard: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    resHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 4,
    },
    resIcon: {
        fontSize: 16,
    },
    resLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    resValue: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 4,
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