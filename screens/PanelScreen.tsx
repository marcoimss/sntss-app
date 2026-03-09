import React, { useState, useEffect } from 'react';
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
import { 
    FileText, 
    ShieldCheck, 
    BookOpen, 
    Calendar, 
    Calculator, 
    QrCode, 
    ChevronRight,
    LogOut,
    User,
    Home,
    Newspaper,
    Settings,
    CreditCard,
    Car,
    TrendingUp
} from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function PanelScreen({ navigation }: any) {
    const [userData, setUserData] = useState({ nombre: '', seccion: '' });
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

    // Cargar avatar guardado al iniciar
    useEffect(() => {
        const loadAvatar = async () => {
            try {
                const savedAvatar = await AsyncStorage.getItem('@user_avatar');
                if (savedAvatar) {
                    setUserAvatar(savedAvatar);
                }
            } catch (error) {
                console.error('Error al cargar avatar:', error);
            }
        };
        loadAvatar();
    }, []);

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

    const isLoggedIn = userData.nombre !== 'USUARIO' && userData.nombre !== '';

    // Función para separar apellidos y nombres
    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return { lastName: parts[0], firstName: '' };
        if (parts.length === 2) return { lastName: parts[0], firstName: parts[1] };
        const lastName = `${parts[0]} ${parts[1]}`;
        const firstName = parts.slice(2).join(' ');
        return { lastName, firstName };
    };

    const { lastName, firstName } = splitName(userData.nombre);

    // Funciones para manejar la foto de perfil
    const handleAvatarPress = () => {
        if (!isLoggedIn) {
            navigation.navigate('Login');
            return;
        }

        Alert.alert(
            'Foto de perfil',
            'Selecciona una opción',
            [
                { text: '📷 Tomar foto', onPress: openCamera },
                { text: '🖼️ Elegir de galería', onPress: openGallery },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    const openCamera = () => {
        const options: any = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.5,
            saveToPhotos: true,
        };

        launchCamera(options, async (response: any) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Error al tomar foto');
                return;
            }
            if (response.assets && response.assets[0]?.base64) {
                const base64 = response.assets[0].base64;
                await AsyncStorage.setItem('@user_avatar', base64);
                setUserAvatar(base64);
                Alert.alert('Éxito', 'Foto actualizada correctamente');
            }
        });
    };

    const openGallery = () => {
        const options: any = {
            mediaType: 'photo',
            includeBase64: true,
            quality: 0.5,
            selectionLimit: 1,
        };

        launchImageLibrary(options, async (response: any) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Error al seleccionar foto');
                return;
            }
            if (response.assets && response.assets[0]?.base64) {
                const base64 = response.assets[0].base64;
                await AsyncStorage.setItem('@user_avatar', base64);
                setUserAvatar(base64);
                Alert.alert('Éxito', 'Foto actualizada correctamente');
            }
        });
    };

    // Función para asignar el icono correcto de Lucide
    const getIcon = (titulo: string) => {
        const color = "#003c82";
        const size = 22;
        if (titulo.includes('Constancia')) return <FileText color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('CCT')) return <ShieldCheck color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Estatutos')) return <BookOpen color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Calendario') || titulo.includes('2 de Julio')) return <Calendar color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Hipotecario')) return <Home color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Mediano Plazo')) return <TrendingUp color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Aguinaldo')) return <Calculator color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Auto')) return <Car color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Scanner')) return <QrCode color={color} size={size} strokeWidth={1.8} />;
        return <Calculator color={color} size={size} strokeWidth={1.8} />;
    };

    const allMenuItems = [
        { id: 1, titulo: 'Descargar Constancia', descripcion: 'Obtén tu documento oficial vigente', screen: null, publico: false },
        { id: 2, titulo: 'CCT', descripcion: 'Contrato Colectivo de Trabajo', screen: null, publico: true },
        { id: 3, titulo: 'Estatutos', descripcion: 'Reglamentos y normas sindicales', screen: null, publico: true },
        { id: 4, titulo: 'Calendario', descripcion: 'Fechas importantes y eventos', screen: null, publico: true },
        { id: 5, titulo: 'Calculadora Crédito Hipotecario', descripcion: 'Simula tu crédito hipotecario', screen: 'CalculadoraHipotecario', publico: true },
        { id: 6, titulo: 'Calculadora Mediano Plazo', descripcion: 'Crédito hipotecario a mediano plazo', screen: 'CalculadoraMedianoPlazo', publico: true },
        { id: 7, titulo: 'Calculadora Aguinaldo', descripcion: 'Calcula tu aguinaldo', screen: 'CalculadoraAguinaldo', publico: true },
        { id: 8, titulo: 'Calculadora Auto', descripcion: 'Crédito para auto', screen: 'CalculadoraAuto', publico: true },
        { id: 9, titulo: 'Calculadora 2 de Julio', descripcion: 'Calculadora especial', screen: 'Calculadora2Julio', publico: true },
        { id: 10, titulo: 'Scanner QR', descripcion: 'Registro de asistencia rápido', screen: 'Scanner', publico: true },
    ];

    const menuItems = allMenuItems.filter(item => isLoggedIn || item.publico);

    // Manejador para el perfil condicional
    const handleProfilePress = () => {
        if (isLoggedIn) {
            navigation.navigate('Perfil');
        } else {
            navigation.navigate('Login');
        }
    };

    // Manejador para el botón de logout
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

    return (
        <View style={styles.mainWrapper}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* HEADER CON MENOS MARGEN SUPERIOR */}
                    <View style={styles.header}>
                        {/* Avatar */}
                        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarWrapper}>
                            {isLoggedIn && userAvatar ? (
                                <Image 
                                    source={{ uri: `data:image/jpeg;base64,${userAvatar}` }} 
                                    style={styles.avatar} 
                                />
                            ) : (
                                <Image 
                                    source={require('../assets/logo.png')} 
                                    style={styles.avatar} 
                                    resizeMode="contain" 
                                />
                            )}
                        </TouchableOpacity>

                        {/* Nombre y sección */}
                        <View style={styles.nameWrapper}>
                            {isLoggedIn ? (
                                <>
                                    <Text style={styles.lastName} numberOfLines={1}>{lastName || 'APELLIDOS'}</Text>
                                    <Text style={styles.firstName} numberOfLines={1}>{firstName || 'NOMBRES'}</Text>
                                    <Text style={styles.userSection} numberOfLines={1}>
                                        Sección {userData.seccion || 'SIN SECCIÓN'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.lastName}>BIENVENIDO</Text>
                                    <Text style={styles.firstName}>INVITADO</Text>
                                </>
                            )}
                        </View>

                        {/* Icono de logout */}
                        {isLoggedIn && (
                            <TouchableOpacity style={styles.logoutWrapper} onPress={handleLogout}>
                                <LogOut color="#003c82" size={22} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Panel de Control</Text>
                        <Text style={styles.subtitle}>Gestiona tus trámites y consultas SNTSS</Text>
                    </View>

                    <View style={styles.listContainer}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuListItem}
                                activeOpacity={0.7}
                                onPress={() => item.screen ? navigation.navigate(item.screen) : Alert.alert('Próximamente', 'Disponible muy pronto')}
                            >
                                <View style={styles.accentLine} />
                                <View style={styles.itemIconWrapper}>
                                    {getIcon(item.titulo)}
                                </View>
                                <View style={styles.itemTextWrapper}>
                                    <Text style={styles.itemTitle}>{item.titulo}</Text>
                                    <Text style={styles.itemDescription} numberOfLines={1}>{item.descripcion}</Text>
                                </View>
                                <ChevronRight color="#CBD5E0" size={18} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* TAB BAR */}
            <View style={styles.bottomTab}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Panel')}>
                    <Home color="#003c82" size={24} />
                    <Text style={[styles.tabLabel, styles.tabLabelActive]}>Inicio</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Noticias', 'Próximamente')}>
                    <Newspaper color="#708999" size={24} />
                    <Text style={styles.tabLabel}>Noticias</Text>
                </TouchableOpacity>
                
                <View style={styles.centerTabWrapper}>
                    <TouchableOpacity style={styles.centerTab} onPress={handleProfilePress}>
                        <User color="#FFF" size={28} />
                    </TouchableOpacity>
                    <Text style={styles.centerTabLabel}>Perfil</Text>
                </View>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Digital', 'Próximamente')}>
                    <CreditCard color="#708999" size={24} />
                    <Text style={styles.tabLabel}>Digital</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Ajustes', 'Próximamente')}>
                    <Settings color="#708999" size={24} />
                    <Text style={styles.tabLabel}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: { flex: 1, backgroundColor: '#F0F7FF' },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 130 },
    
    // HEADER CON MENOS MARGEN SUPERIOR
    header: {
        marginTop: Platform.OS === 'android' ? 60 : 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        width: '100%',
        marginBottom: 5,
    },
    avatarWrapper: {
        width: 60,
        height: 60,
        marginRight: 12,
    },
    avatar: { 
        width: 60, 
        height: 60, 
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#003c82',
    },
    nameWrapper: {
        flex: 1,
        marginRight: 10,
    },
    lastName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#003c82',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    firstName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1B476A',
        marginBottom: 4,
    },
    userSection: {
        fontSize: 12,
        color: '#4a6fa5',
        fontWeight: '500',
    },
    logoutWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    
    titleContainer: { marginVertical: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#003c82' },
    subtitle: { fontSize: 15, color: '#4a6fa5', marginTop: 4 },

    listContainer: { gap: 14 },
    menuListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: '#003c82', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    accentLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: '#003c82',
    },
    itemIconWrapper: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
    itemTextWrapper: { flex: 1, marginLeft: 15 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#003c82' },
    itemDescription: { fontSize: 12, color: '#718096', marginTop: 2 },

    bottomTab: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E1E8ED',
        elevation: 20,
    },
    tabItem: { flex: 1, alignItems: 'center' },
    tabLabel: { fontSize: 10, color: '#708999', marginTop: 4, fontWeight: '600' },
    tabLabelActive: { color: '#003c82' },
    centerTabWrapper: { 
        flex: 1, 
        alignItems: 'center', 
        top: -20,
    },
    centerTab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#003c82',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#F0F7FF',
        elevation: 10,
    },
    centerTabLabel: {
        fontSize: 10,
        color: '#708999',
        marginTop: 8,
        fontWeight: '600',
        textAlign: 'center',
    },
});