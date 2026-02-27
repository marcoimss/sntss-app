import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function PanelScreen({ navigation }: any) {
    const [userData, setUserData] = useState({
        nombre: '',
        seccion: '',
    });

    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                try {
                    const data = await AsyncStorage.getItem('userData');
                    if (data) {
                        const parsed = JSON.parse(data);
                        setUserData({
                            nombre: parsed.nombre || 'USUARIO',
                            seccion: parsed.seccion || 'XXX',
                        });
                    }
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                }
            };
            loadUserData();
        }, [])
    );

    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return { lastName: parts[0], firstName: '' };
        if (parts.length === 2) return { lastName: parts[0], firstName: parts[1] };
        const lastName = `${parts[0]} ${parts[1]}`;
        const firstName = parts.slice(2).join(' ');
        return { lastName, firstName };
    };

    const { lastName, firstName } = splitName(userData.nombre);

    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Salir',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userData');
                        navigation.replace('Login');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const menuItems = [
        { id: 1, titulo: 'Descargar Constancia', descripcion: 'Obtén tu documento oficial vigente', icono: '📄' },
        { id: 2, titulo: 'CCT', descripcion: 'Contrato Colectivo de Trabajo', icono: '📑' },
        { id: 3, titulo: 'Estatutos', descripcion: 'Reglamentos y normas sindicales', icono: '📚' },
        { id: 4, titulo: 'Calendario', descripcion: 'Fechas importantes y eventos', icono: '📅' },
        { id: 5, titulo: 'Scanner QR', descripcion: 'Registro de asistencia con código QR', icono: '📷', screen: 'Scanner' },
    ];

    return (
        <View style={styles.mainWrapper}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <View style={styles.leftSection}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.avatar}
                                resizeMode="contain"
                            />
                            <View style={styles.nameContainer}>
                                <Text style={styles.lastName} numberOfLines={1}>{lastName || 'APELLIDOS'}</Text>
                                <Text style={styles.firstName} numberOfLines={1}>{firstName || 'NOMBRES'}</Text>
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>Sección {userData.seccion}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.rightSection}>
                            <TouchableOpacity onPress={() => Alert.alert('Notificaciones', 'Sin novedades')} style={styles.actionButton}>
                                <View style={styles.notificationCircle}>
                                    <Text style={styles.iconEmojiHeader}>🔔</Text>
                                    <View style={styles.notificationDot} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogout} style={styles.actionButton}>
                                <View style={styles.logoutCircle}>
                                    <Text style={styles.iconEmojiHeader}>🚪</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Panel de Control</Text>
                        <Text style={styles.subtitle}>Bienvenido a tu portal digital SNTSS</Text>
                    </View>

                    {/* GRID */}
                    <View style={styles.gridContainer}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuCard}
                                onPress={() => item.screen ? navigation.navigate(item.screen) : Alert.alert('Próximamente', 'Disponible muy pronto')}
                            >
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>{item.icono}</Text>
                                </View>
                                <Text style={styles.menuTitle}>{item.titulo}</Text>
                                <Text style={styles.menuDescription}>{item.descripcion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>SNTSS Digital</Text>
                        <Text style={styles.footerText}>
                            Toda la información de tu sindicato al alcance de tu mano. Mantente informado.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* TAB BAR CON BOTÓN PERFIL MÁS PEQUEÑO */}
            <View style={styles.bottomTab}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Panel')}>
                    <Text style={styles.tabIcon}>🏠</Text>
                    <Text style={[styles.tabLabel, { color: '#003c82' }]}>Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Noticias', 'Próximamente')}>
                    <Text style={styles.tabIcon}>📰</Text>
                    <Text style={styles.tabLabel}>Noticias</Text>
                </TouchableOpacity>

                {/* PERFIL FLOTANTE REDIMENSIONADO */}
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Perfil')}>
                    <View style={styles.centerTab}>
                        <Text style={styles.centerTabIcon}>👤</Text>
                    </View>
                    <Text style={[styles.tabLabel, { marginTop: 18, fontWeight: 'bold' }]}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Digital', 'Próximamente')}>
                    <Text style={styles.tabIcon}>🪪</Text>
                    <Text style={styles.tabLabel}>Digital</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Ajustes', 'Próximamente')}>
                    <Text style={styles.tabIcon}>⚙️</Text>
                    <Text style={styles.tabLabel}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: { flex: 1, backgroundColor: '#F8FBFF' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
    header: {
        marginTop: Platform.OS === 'android' ? 60 : 25, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    avatar: { width: 55, height: 55, borderRadius: 27.5 },
    nameContainer: { marginLeft: 12, flex: 1 },
    lastName: { fontSize: 14, fontWeight: 'bold', color: '#003c82', textTransform: 'uppercase' },
    firstName: { fontSize: 14, fontWeight: '500', color: '#1B476A', textTransform: 'uppercase', marginBottom: 4 },
    badgeContainer: { backgroundColor: '#F0F7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
    badgeText: { fontSize: 11, color: '#003c82', fontWeight: '700' },
    rightSection: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { marginLeft: 8 },
    notificationCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
    notificationDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5252', borderWidth: 1.5, borderColor: '#FFFFFF' },
    logoutCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F5', justifyContent: 'center', alignItems: 'center' },
    iconEmojiHeader: { fontSize: 18 },
    titleContainer: { marginBottom: 25 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#003c82' },
    subtitle: { fontSize: 15, color: '#4a6fa5' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    menuCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: '#003c8210' },
    iconContainer: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    iconText: { fontSize: 22 },
    menuTitle: { fontSize: 15, fontWeight: 'bold', color: '#003c82', marginBottom: 4 },
    menuDescription: { fontSize: 11, color: '#4a6fa5' },
    footer: { marginTop: 20, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 2, borderColor: '#4a6fa530', borderStyle: 'dashed', alignItems: 'center' },
    footerTitle: { fontSize: 18, fontWeight: 'bold', color: '#003c82', marginBottom: 8 },
    footerText: { fontSize: 13, color: '#4a6fa5', textAlign: 'center' },
    
    // TAB BAR AJUSTADO
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        borderTopWidth: 1,
        borderTopColor: '#E1E8ED',
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 20,
    },
    tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    tabIcon: { fontSize: 20 },
    tabLabel: { fontSize: 10, color: '#708999', marginTop: 4, fontWeight: '600' },
    centerTab: {
        position: 'absolute',
        top: -28, // Menos elevado
        width: 54, // Tamaño reducido (antes 64)
        height: 54,
        borderRadius: 27,
        backgroundColor: '#003c82',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4, // Borde más fino
        borderColor: '#F8FBFF',
        elevation: 6,
    },
    centerTabIcon: { fontSize: 24, color: '#FFFFFF' }
});