import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { 
    Home, 
    TrendingUp, 
    Calculator, 
    Car, 
    Calendar,
    Clock,
    Banknote,
    ArrowLeft
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function CalculadorasScreen({ navigation }: any) {
    const { colors, theme } = useTheme();

    // PARTÍCULAS GALÁCTICAS (igual que en PanelScreen)
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

    const calculadoras = [
        { id: 1, titulo: 'Crédito Hipotecario', screen: 'CalculadoraHipotecario', icono: Home },
        { id: 2, titulo: 'Mediano Plazo', screen: 'CalculadoraMedianoPlazo', icono: TrendingUp },
        { id: 3, titulo: 'Aguinaldo', screen: 'CalculadoraAguinaldo', icono: Calculator },
        { id: 4, titulo: 'Auto', screen: 'CalculadoraAuto', icono: Car },
        { id: 5, titulo: '2 de Julio', screen: 'Calculadora2Julio', icono: Calendar },
        { id: 6, titulo: 'Horas Extras', screen: 'CalculadoraHorasExtras', icono: Clock },
        { id: 7, titulo: 'Cláusula 97', screen: 'CalculadoraClausula97', icono: Banknote },
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
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Calculadoras</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.gridContainer}>
                        {calculadoras.map((calc) => (
                            <TouchableOpacity
                                key={calc.id}
                                style={[
                                    styles.card,
                                    { backgroundColor: colors.card }
                                ]}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate(calc.screen)}
                            >
                                {/* Línea de acento */}
                                <View style={[styles.cardAccent, { backgroundColor: colors.cardAccent }]} />
                                
                                <View style={styles.cardContent}>
                                    <View style={styles.cardIconWrapper}>
                                        <calc.icono color={colors.textPrimary} size={32} />
                                    </View>
                                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                                        {calc.titulo}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
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
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    card: {
        width: '48%',
        borderRadius: 24,
        marginBottom: 12,
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
    cardAccent: {
        height: 5,
        width: '100%',
    },
    cardContent: {
        padding: 16,
        alignItems: 'center',
    },
    cardIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
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