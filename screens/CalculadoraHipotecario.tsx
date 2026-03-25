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
import { ArrowLeft, Home, Calculator, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function CalculadoraHipotecario({ navigation }: any) {
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
            Alert.alert('Error', 'Por favor, ingresa los conceptos 002 y 011');
            return;
        }

        // Lógica:
        // 1. Mensual Base = (C02 + C11) * 2
        // 2. Mensual Integrado = Mensual Base * 1.20 (20% prestaciones)
        // 3. Factores: 75 y 90
        
        const mensualBase = (val02 + val11) * 2;
        const mensualIntegrado = mensualBase * 1.20;

        setResultados({
            factor75: mensualIntegrado * 75,
            factor90: mensualIntegrado * 90,
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
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Crédito Hipotecario</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={[styles.cardHeader, { backgroundColor: colors.cardAccent }]}>
                            <Home color="#FFF" size={24} />
                            <Text style={styles.cardTitle}>Crédito Hipotecario</Text>
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                Calcula tu capacidad de préstamo para vivienda basado en tu sueldo integrado.
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
                                <Text style={styles.buttonText}>Calcular Crédito</Text>
                            </TouchableOpacity>

                            {resultados && (
                                <View style={styles.resultWrapper}>
                                    <View style={[styles.resultBox, { borderLeftColor: colors.cardAccent, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8F9FA' }]}>
                                        <Text style={[styles.resLabel, { color: colors.textSecondary }]}>Factor 75 (Enero-Julio)</Text>
                                        <Text style={[styles.resValue,{ color: theme === 'dark' ? '#60A5FA' : colors.cardAccent }]}>{format(resultados.factor75)}</Text>
                                    </View>

                                    <View style={[styles.resultBox, { borderLeftColor: '#28a745', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F8F9FA' }]}>
                                        <Text style={[styles.resLabel, { color: colors.textSecondary }]}>Factor 90 (Agosto-Diciembre)</Text>
                                        <Text style={[styles.resValue, { color: '#28a745' }]}>{format(resultados.factor90)}</Text>
                                    </View>
                                    
                                    <View style={styles.infoBox}>
                                        <Info color={colors.cardAccent} size={14} />
                                        <Text style={[styles.note, { color: colors.textSecondary }]}>
                                            * El cálculo ya incluye el 20% de prestaciones de ley.
                                        </Text>
                                    </View>
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
        fontSize: 14,
        lineHeight: 20,
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
    resultWrapper: {
        marginTop: 25,
    },
    resultBox: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        alignItems: 'center',
    },
    resLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 5,
    },
    resValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 5,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
    },
    note: {
        fontSize: 11,
        fontStyle: 'italic',
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