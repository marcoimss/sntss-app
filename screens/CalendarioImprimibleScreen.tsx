// @ts-nocheck
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Printer, Info, Share2 } from 'lucide-react-native';
import Print from 'react-native-print';
import Share from 'react-native-share';

// TODOS LOS EVENTOS 2026 
const eventosCalendario = [
    { fecha: '2026-01-01', color: 'green' },
    { fecha: '2026-01-12', color: 'purple' },
    { fecha: '2026-01-27', color: 'red' },
    { fecha: '2026-01-28', color: 'blue' },
    { fecha: '2026-01-29', color: 'purple' },
    { fecha: '2026-01-30', color: 'orange' },
    { fecha: '2026-02-02', color: 'green' },
    { fecha: '2026-02-10', color: 'red' },
    { fecha: '2026-02-11', color: 'blue' },
    { fecha: '2026-02-12', color: 'purple' },
    { fecha: '2026-02-24', color: 'red' },
    { fecha: '2026-02-25', color: 'blue' },
    { fecha: '2026-02-26', color: 'purple' },
    { fecha: '2026-02-28', color: 'cyan' },
    { fecha: '2026-03-10', color: 'red' },
    { fecha: '2026-03-11', color: 'blue' },
    { fecha: '2026-03-12', color: 'purple' },
    { fecha: '2026-03-16', color: 'green' },
    { fecha: '2026-03-25', color: 'red' },
    { fecha: '2026-03-26', color: 'blue' },
    { fecha: '2026-03-27', color: 'purple' },
    { fecha: '2026-03-31', color: 'cyan' },
    { fecha: '2026-04-02', color: 'green' },
    { fecha: '2026-04-03', color: 'green' },
    { fecha: '2026-04-10', color: 'red' },
    { fecha: '2026-04-11', color: 'blue' },
    { fecha: '2026-04-14', color: 'purple' },
    { fecha: '2026-04-27', color: 'red' },
    { fecha: '2026-04-28', color: 'blue' },
    { fecha: '2026-04-29', color: 'purple' },
    { fecha: '2026-04-30', color: 'cyan' },
    { fecha: '2026-05-01', color: 'green' },
    { fecha: '2026-05-05', color: 'green' },
    { fecha: '2026-05-10', color: 'green' },
    { fecha: '2026-05-12', color: 'red' },
    { fecha: '2026-05-13', color: 'blue' },
    { fecha: '2026-05-14', color: 'purple' },
    { fecha: '2026-05-26', color: 'red' },
    { fecha: '2026-05-27', color: 'blue' },
    { fecha: '2026-05-28', color: 'purple' },
    { fecha: '2026-05-30', color: 'cyan' },
    { fecha: '2026-06-10', color: 'red' },
    { fecha: '2026-06-11', color: 'blue' },
    { fecha: '2026-06-12', color: 'purple' },
    { fecha: '2026-06-25', color: 'red' },
    { fecha: '2026-06-26', color: 'blue' },
    { fecha: '2026-06-27', color: 'purple' },
    { fecha: '2026-06-30', color: 'cyan' },
    { fecha: '2026-07-10', color: 'red' },
    { fecha: '2026-07-11', color: 'blue' },
    { fecha: '2026-07-14', color: 'purple' },
    { fecha: '2026-07-20', color: 'orange' },
    { fecha: '2026-07-21', color: 'orange' },
    { fecha: '2026-07-22', color: 'orange' },
    { fecha: '2026-07-23', color: 'orange' },
    { fecha: '2026-07-24', color: 'orange' },
    { fecha: '2026-07-27', color: 'red' },
    { fecha: '2026-07-28', color: 'blue' },
    { fecha: '2026-07-29', color: 'purple' },
    { fecha: '2026-07-31', color: 'cyan' },
    { fecha: '2026-08-10', color: 'red' },
    { fecha: '2026-08-11', color: 'blue' },
    { fecha: '2026-08-12', color: 'purple' },
    { fecha: '2026-08-25', color: 'red' },
    { fecha: '2026-08-26', color: 'blue' },
    { fecha: '2026-08-27', color: 'purple' },
    { fecha: '2026-08-31', color: 'cyan' },
    { fecha: '2026-09-09', color: 'red' },
    { fecha: '2026-09-10', color: 'blue' },
    { fecha: '2026-09-11', color: 'purple' },
    { fecha: '2026-09-16', color: 'green' },
    { fecha: '2026-09-25', color: 'red' },
    { fecha: '2026-09-26', color: 'blue' },
    { fecha: '2026-09-28', color: 'purple' },
    { fecha: '2026-09-30', color: 'cyan' },
    { fecha: '2026-10-12', color: 'red' },
    { fecha: '2026-10-13', color: 'blue' },
    { fecha: '2026-10-14', color: 'purple' },
    { fecha: '2026-10-27', color: 'red' },
    { fecha: '2026-10-28', color: 'blue' },
    { fecha: '2026-10-29', color: 'purple' },
    { fecha: '2026-10-31', color: 'cyan' },
    { fecha: '2026-11-02', color: 'green' },
    { fecha: '2026-11-10', color: 'red' },
    { fecha: '2026-11-11', color: 'blue' },
    { fecha: '2026-11-12', color: 'purple' },
    { fecha: '2026-11-16', color: 'green' },
    { fecha: '2026-11-25', color: 'red' },
    { fecha: '2026-11-26', color: 'blue' },
    { fecha: '2026-11-27', color: 'purple' },
    { fecha: '2026-11-30', color: 'cyan' },
    { fecha: '2026-12-01', color: 'orange' },
    { fecha: '2026-12-10', color: 'red' },
    { fecha: '2026-12-11', color: 'blue' },
    { fecha: '2026-12-14', color: 'purple' },
    { fecha: '2026-12-24', color: 'red' },
    { fecha: '2026-12-25', color: 'green' },
    { fecha: '2026-12-28', color: 'purple' },
    { fecha: '2026-12-31', color: 'cyan' }
];

const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const targetYear = 2026;

// Colores suaves (pastel)
const colorMap = {
    red: '#fee2e2',
    green: '#dcfce7',
    blue: '#dbeafe',
    orange: '#ffedd5',
    purple: '#ede9fe',
    cyan: '#cffafe'
};

export default function CalendarioImprimibleScreen({ navigation }) {
    const { colors, theme } = useTheme();
    const [printing, setPrinting] = useState(false);

    const generarHTML = () => {
        const renderAllMonths = () => {
            let html = '';
            for (let month = 0; month < 12; month++) {
                let firstDay = new Date(targetYear, month, 1).getDay();
                firstDay = firstDay === 0 ? 6 : firstDay - 1;
                const daysInMonth = new Date(targetYear, month + 1, 0).getDate();
                const daysInPrevMonth = new Date(targetYear, month, 0).getDate();

                let tableBody = '';
                let date = 1;
                let nextDate = 1;

                for (let i = 0; i < 6; i++) {
                    let row = '<tr>';
                    let hasDays = false;

                    for (let j = 0; j < 7; j++) {
                        if (i === 0 && j < firstDay) {
                            const prevDay = daysInPrevMonth - firstDay + j + 1;
                            row += `<td class="empty-day"><span class="day-number">${prevDay}</span></td>`;
                        } 
                        else if (date > daysInMonth) {
                            row += `<td class="empty-day"><span class="day-number">${nextDate}</span></td>`;
                            nextDate++;
                        } 
                        else {
                            hasDays = true;
                            const dateStr = `${targetYear}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                            const evento = eventosCalendario.find(e => e.fecha === dateStr);

                            if (evento) {
                                const bgColor = colorMap[evento.color];
                                row += `<td style="background-color: ${bgColor}; border-top: 1px solid #e2e8f0;">
                                            <span class="day-number" style="color: #475569;">${date}</span>
                                         </td>`;
                            } else {
                                row += `<td><span class="day-number">${date}</span></td>`;
                            }
                            date++;
                        }
                    }
                    row += '</tr>';
                    if (hasDays) tableBody += row;
                    if (date > daysInMonth) break;
                }

                html += `
                    <div class="month-card">
                        <div class="month-title">${monthNames[month]}</div>
                        <table class="calendar-table">
                            <thead>
                                <tr>
                                    <th>LU</th><th>MA</th><th>MI</th><th>JU</th><th>VI</th><th>SA</th><th>DO</th>
                                </tr>
                            </thead>
                            <tbody>${tableBody}</tbody>
                        </table>
                    </div>
                `;
            }
            return html;
        };

        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Calendario SNTSS 2026</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: white; font-family: 'Segoe UI', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: Letter; margin: 5mm 4mm; }
                .calendar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
                .month-card { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; page-break-inside: avoid; }
                .month-title { background: #f8fafc; text-align: center; padding: 4px; font-weight: 800; font-size: 0.65rem; color: #003c82; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
                .calendar-table { width: 100%; border-collapse: collapse; }
                .calendar-table th { text-align: center; padding: 2px; font-weight: 700; font-size: 0.45rem; color: #64748b; border: 1px solid #e2e8f0; background: white; }
                .calendar-table td { border: 1px solid #e2e8f0; width: 14.28%; height: 32px; position: relative; vertical-align: top; padding: 1px; background: white; }
                .day-number { position: absolute; bottom: 1px; right: 2px; font-size: 0.55rem; font-weight: 700; color: #94a3b8; }
                .empty-day { background: #fafafa; }
                .legend-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; padding: 8px; border-top: 1px solid #e2e8f0; }
                .legend-item { display: flex; align-items: center; gap: 6px; padding: 4px 12px; background: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0; }
                .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
                .legend-text { font-size: 0.55rem; font-weight: 600; color: #334155; }
                .print-header { background: linear-gradient(135deg, #001f3f 0%, #003c82 100%); color: white; padding: 8px 15px; border-radius: 12px; margin-bottom: 12px; text-align: center; }
                .print-header h1 { font-size: 1.1rem; font-weight: 300; }
                .print-header h1 span { font-weight: 900; }
                .print-header p { color: #00e5ff; font-size: 0.6rem; letter-spacing: 2px; }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>CALENDARIO <span>2026</span></h1>
                <p>CEN | SNTSS</p>
            </div>
            <div class="calendar-grid">
                ${renderAllMonths()}
            </div>
            <div class="legend-container">
                <div class="legend-item"><div class="legend-dot" style="background:#dc2626"></div><span class="legend-text">Santander/Scotia</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#16a34a"></div><span class="legend-text">Festivos</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#2563eb"></div><span class="legend-text">Banamex/Banorte</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#ea580c"></div><span class="legend-text">Vacacional</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#7c3aed"></div><span class="legend-text">Cheque</span></div>
                <div class="legend-item"><div class="legend-dot" style="background:#0891b2"></div><span class="legend-text">Jubilados</span></div>
            </div>
        </body>
        </html>`;
    };

    const handlePrint = async () => {
        setPrinting(true);
        try {
            const html = generarHTML();
            await Print.print({ html });
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir la vista de impresión. Verifica que tengas una impresora configurada.');
            console.error(error);
        } finally {
            setPrinting(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft color={colors.textPrimary} size={24} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Calendario Imprimible</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={[styles.cardHeader, { backgroundColor: colors.cardAccent }]}>
                            <Printer color="#FFF" size={24} />
                            <Text style={styles.cardTitle}>Imprimir Calendario 2026</Text>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.infoContainer}>
                                <Info color={colors.cardAccent} size={20} />
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    El calendario incluye todas las fechas de pago y eventos importantes del año 2026.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.cardAccent }, printing && styles.buttonDisabled]}
                                onPress={handlePrint}
                                disabled={printing}
                            >
                                {printing ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Printer color="#FFF" size={20} />
                                )}
                                <Text style={styles.buttonText}>
                                    {printing ? 'PREPARANDO...' : 'Imprimir Calendario'}
                                </Text>
                            </TouchableOpacity>

                            <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
                                📄 Formato carta • Listo para imprimir
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
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
    title: { fontSize: 20, fontWeight: 'bold' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    card: { 
        borderRadius: 24, 
        overflow: 'hidden',
        ...Platform.select({ 
            ios: { 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 6 
            }, 
            android: { elevation: 2 } 
        })
    },
    cardHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 16, 
        gap: 8 
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    cardBody: { padding: 20 },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: 'rgba(0,60,130,0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    button: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 14, 
        borderRadius: 12, 
        marginTop: 10, 
        gap: 8 
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    footerNote: {
        textAlign: 'center',
        fontSize: 11,
        marginTop: 16,
    },
});