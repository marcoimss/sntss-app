import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Printer, Info } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Configuración en español
LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// ==================== TODOS LOS EVENTOS 2026 ====================
const eventosCalendario = [
    { fecha: '2026-01-01', color: 'green', titulo: 'Año Nuevo' },
    { fecha: '2026-01-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-01-27', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-01-28', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-01-29', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-01-30', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-02-02', color: 'green', titulo: 'Constitución' },
    { fecha: '2026-02-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-02-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-02-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-02-24', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-02-25', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-02-26', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-02-28', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-03-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-03-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-03-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-03-16', color: 'green', titulo: 'Juárez' },
    { fecha: '2026-03-25', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-03-26', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-03-27', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-03-31', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-04-02', color: 'green', titulo: 'Jueves Santo' },
    { fecha: '2026-04-03', color: 'green', titulo: 'Viernes Santo' },
    { fecha: '2026-04-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-04-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-04-14', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-04-27', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-04-28', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-04-29', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-04-30', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-05-01', color: 'green', titulo: 'Trabajo' },
    { fecha: '2026-05-05', color: 'green', titulo: 'Puebla' },
    { fecha: '2026-05-10', color: 'green', titulo: 'Madres' },
    { fecha: '2026-05-12', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-05-13', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-05-14', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-05-26', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-05-27', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-05-28', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-05-30', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-06-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-06-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-06-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-06-25', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-06-26', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-06-27', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-06-30', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-07-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-07-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-07-14', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-07-20', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-07-21', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-07-22', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-07-23', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-07-24', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-07-27', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-07-28', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-07-29', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-07-31', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-08-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-08-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-08-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-08-25', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-08-26', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-08-27', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-08-31', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-09-09', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-09-10', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-09-11', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-09-16', color: 'green', titulo: 'Independencia' },
    { fecha: '2026-09-25', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-09-26', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-09-28', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-09-30', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-10-12', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-10-13', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-10-14', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-10-27', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-10-28', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-10-29', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-10-31', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-11-02', color: 'green', titulo: 'Muertos' },
    { fecha: '2026-11-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-11-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-11-12', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-11-16', color: 'green', titulo: 'Revolución' },
    { fecha: '2026-11-25', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-11-26', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-11-27', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-11-30', color: 'cyan', titulo: 'Jubilados' },
    { fecha: '2026-12-01', color: 'orange', titulo: 'Vacacional' },
    { fecha: '2026-12-10', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-12-11', color: 'blue', titulo: 'Banamex/Banorte' },
    { fecha: '2026-12-14', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-12-24', color: 'red', titulo: 'Santander/Scotia' },
    { fecha: '2026-12-25', color: 'green', titulo: 'Navidad' },
    { fecha: '2026-12-28', color: 'purple', titulo: 'Cheque' },
    { fecha: '2026-12-31', color: 'cyan', titulo: 'Jubilados' }
];

// Mapeo de colores para el calendario
const colorMap: Record<string, string> = {
    red: '#dc2626',
    green: '#16a34a',
    blue: '#2563eb',
    orange: '#ea580c',
    purple: '#7c3aed',
    cyan: '#0891b2'
};

export default function CalendarioScreen({ navigation }: any) {
    const { colors, theme } = useTheme();

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

    // Marcadores para el calendario
    const markedDates = eventosCalendario.reduce((acc, evento) => {
        acc[evento.fecha] = {
            marked: true,
            dotColor: colorMap[evento.color],
        };
        return acc;
    }, {} as any);

    // Función para mostrar selector de recordatorio
    const mostrarSelectorRecordatorio = (evento: any) => {
        Alert.alert(
            '📅 Recordatorio',
            `¿Cuándo quieres que te recuerde "${evento.titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: '1 día antes', onPress: () => programarNotificacion(evento, 1) },
                { text: '2 días antes', onPress: () => programarNotificacion(evento, 2) },
                { text: '3 días antes', onPress: () => programarNotificacion(evento, 3) },
            ],
            { cancelable: true }
        );
    };

    // Programar notificación
    const programarNotificacion = async (evento: any, diasAntes: number) => {
        try {
            const fechaEvento = new Date(evento.fecha);
            const fechaNotificacion = new Date(fechaEvento);
            fechaNotificacion.setDate(fechaEvento.getDate() - diasAntes);

            if (fechaNotificacion < new Date()) {
                Alert.alert('Error', 'La fecha ya pasó, no se puede programar recordatorio');
                return;
            }

            await notifee.requestPermission();
            await notifee.createChannel({
                id: 'recordatorios',
                name: 'Recordatorios de Pagos',
                importance: 4,
                vibration: true,
            });

            const notificacionKey = `${evento.fecha}_${evento.titulo}`;
            await AsyncStorage.setItem(notificacionKey, JSON.stringify({
                fechaEvento: evento.fecha,
                titulo: evento.titulo,
                diasAntes,
                fechaNotificacion: fechaNotificacion.toISOString()
            }));

            await notifee.displayNotification({
                title: '✅ Recordatorio Programado',
                body: `Te recordaré "${evento.titulo}" ${diasAntes} día(s) antes`,
                android: {
                    channelId: 'recordatorios',
                    pressAction: { id: 'default' },
                },
            });

            Alert.alert('Éxito', `Recordatorio programado para ${diasAntes} día(s) antes del evento`);

        } catch (error) {
            console.error('Error al programar notificación:', error);
            Alert.alert('Error', 'No se pudo programar el recordatorio');
        }
    };

    const getEventoPorFecha = (fecha: string) => {
        return eventosCalendario.find(e => e.fecha === fecha);
    };

    const legendItems = [
        { label: 'Santander/Scotia', color: '#dc2626' },
        { label: 'Festivos', color: '#16a34a' },
        { label: 'Banamex/Banorte', color: '#2563eb' },
        { label: 'Vacacional', color: '#ea580c' },
        { label: 'Cheque', color: '#7c3aed' },
        { label: 'Jubilados', color: '#0891b2' },
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

                {/* Header con botón de regreso e impresión */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={colors.textPrimary} size={24} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                            CALENDARIO <Text style={styles.bold}>2026</Text>
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                            CEN | SNTSS
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('CalendarioImprimible')} style={styles.printButton}>
                        <Printer color={colors.textPrimary} size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Info Alert */}
                    <View style={[styles.alertInfo, { backgroundColor: colors.cardAccent + '20' }]}>
                        <Info color={colors.cardAccent} size={16} />
                        <Text style={[styles.alertText, { color: colors.textSecondary }]}>
                            Toca un día marcado para programar un recordatorio de pago.
                        </Text>
                    </View>

                    {/* Calendario Principal - CORREGIDO: markingType="simple" */}
                    <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
                        <Calendar
                            current={'2026-01-01'}
                            markingType="simple"
                            markedDates={markedDates}
                            onDayPress={(day: any) => {
                                const evento = getEventoPorFecha(day.dateString);
                                if (evento) {
                                    mostrarSelectorRecordatorio(evento);
                                } else {
                                    Alert.alert('Sin eventos', 'No hay eventos programados para esta fecha');
                                }
                            }}
                            theme={{
                                backgroundColor: 'transparent',
                                calendarBackground: 'transparent',
                                textSectionTitleColor: colors.textPrimary,
                                selectedDayBackgroundColor: colors.cardAccent,
                                selectedDayTextColor: '#FFF',
                                todayTextColor: colors.cardAccent,
                                dayTextColor: colors.textPrimary,
                                textDisabledColor: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#cbd5e1',
                                monthTextColor: colors.textPrimary,
                                textMonthFontWeight: 'bold',
                                arrowColor: colors.textPrimary,
                            }}
                        />
                    </View>

                    {/* Leyenda de Colores */}
                    <View style={styles.legendContainer}>
                        <Text style={[styles.legendTitle, { color: colors.textSecondary }]}>
                            REFERENCIAS DE PAGO
                        </Text>
                        <View style={styles.legendGrid}>
                            {legendItems.map((item, index) => (
                                <View key={index} style={[styles.legendItem, { backgroundColor: colors.card, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}>
                                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                                    <Text style={[styles.legendText, { color: colors.textPrimary }]}>
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
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
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '300',
    },
    bold: {
        fontWeight: '900',
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        marginTop: 2,
    },
    printButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    alertInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    alertText: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    calendarCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 12,
        marginBottom: 20,
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
    legendContainer: {
        paddingHorizontal: 20,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendText: {
        fontSize: 10,
        fontWeight: '700',
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