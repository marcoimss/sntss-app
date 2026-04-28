import React, { useState, useEffect, useMemo } from 'react';
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
    Platform,
    Dimensions,
    Linking
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
    LogOut,
    User,
    Home,
    Newspaper,
    Settings,
    CreditCard,
    Car,
    TrendingUp,
    Download
} from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../context/ThemeContext';
import ReactNativeBlobUtil from 'react-native-blob-util';

const { width, height } = Dimensions.get('window');

export default function PanelScreen({ navigation }: any) {
    const { colors, theme } = useTheme();
    const [userData, setUserData] = useState({ nombre: '', seccion: '' });
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [glowCard, setGlowCard] = useState<number | null>(null);

    // PARTÍCULAS GALÁCTICAS 
    const particles = useMemo(() => 
        Array.from({ length: 80 }).map((_, i) => ({
            key: i,
            left: Math.random() * width,
            top: Math.random() * height,
            size: Math.random() * 4 + 1,
            color: colors.particleColors[i % colors.particleColors.length],
            opacity: Math.random() * 0.6 + 0.2,
        })), [colors.particleColors]
    );

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

    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return { lastName: parts[0], firstName: '' };
        if (parts.length === 2) return { lastName: parts[0], firstName: parts[1] };
        const lastName = `${parts[0]} ${parts[1]}`;
        const firstName = parts.slice(2).join(' ');
        return { lastName, firstName };
    };

    const { lastName, firstName } = splitName(userData.nombre);

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

    const downloadLocalPDF = async (assetModule: any, fileName: string) => {
        try {
            const assetInfo = Image.resolveAssetSource(assetModule);
            const sourceUri = String(assetInfo.uri);
            
            const destPath = Platform.OS === 'android' 
                ? `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`
                : `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

            if (sourceUri.startsWith('http')) {
                // Modo Debug
                await ReactNativeBlobUtil.config({ path: destPath }).fetch('GET', sourceUri);
            } else if (Platform.OS === 'android') {
                // Modo Release Android: Intentamos leer el asset directamente como base64
                // Esto suele funcionar mejor que 'cp' con URIs de recursos internos (ej: assets_cct)
                let success = false;
                try {
                    // Intentamos leerlo usando la URI que nos dio RN (ej: assets_cct o asset:/...)
                    const data = await ReactNativeBlobUtil.fs.readFile(sourceUri, 'base64');
                    await ReactNativeBlobUtil.fs.writeFile(destPath, data, 'base64');
                    success = true;
                } catch (e) {
                    // Si falla, intentamos con las rutas de force de antes
                    const possiblePaths = [
                        `asset:/assets/assets/${fileName}`,
                        `asset:/assets/${fileName}`,
                        `bundle-assets://assets/assets/${fileName}`,
                        `raw://${sourceUri}`,
                        `asset:/${sourceUri}.pdf`
                    ];
                    for (const path of possiblePaths) {
                        try {
                            await ReactNativeBlobUtil.fs.cp(path, destPath);
                            success = true;
                            break;
                        } catch (err) { continue; }
                    }
                }

                if (!success) {
                    throw new Error(`No se pudo extraer el recurso '${fileName}' del APK. (ID: ${sourceUri})`);
                }
            } else {
                // iOS Release
                const cleanPath = sourceUri.replace('file://', '');
                if (await ReactNativeBlobUtil.fs.exists(destPath)) {
                    await ReactNativeBlobUtil.fs.unlink(destPath);
                }
                await ReactNativeBlobUtil.fs.cp(cleanPath, destPath);
            }

            const fileExists = await ReactNativeBlobUtil.fs.exists(destPath);
            if (!fileExists) {
                throw new Error('Error de escritura: El archivo no se guardó en la memoria temporal.');
            }

            if (Platform.OS === 'ios') {
                ReactNativeBlobUtil.ios.previewDocument(destPath);
            } else {
                ReactNativeBlobUtil.android.actionViewIntent(destPath, 'application/pdf');
            }
        } catch (error: any) {
            console.error('Error abriendo PDF local: ', error);
            Alert.alert(
                'Error de Documento', 
                `Detalle: ${error.message}\n\nIntenta reiniciar la app o contacta a soporte.`
            );
        }
    };

    const getIcon = (titulo: string) => {
        const color = colors.textPrimary;
        const size = 24;
        if (titulo.includes('Constancia')) return <FileText color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('CCT')) return <ShieldCheck color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Estatutos')) return <BookOpen color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Tarjetón')) return <CreditCard color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Calendario') || titulo.includes('2 de Julio')) return <Calendar color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Hipotecario')) return <Home color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Mediano Plazo')) return <TrendingUp color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Aguinaldo')) return <Calculator color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Auto')) return <Car color={color} size={size} strokeWidth={1.8} />;
        if (titulo.includes('Scanner')) return <QrCode color={color} size={size} strokeWidth={1.8} />;
        return <Calculator color={color} size={size} strokeWidth={1.8} />;
    };

    // SOLO QUEDAN LAS OPCIONES PRINCIPALES
    const allMenuItems = [
        { id: 1, titulo: 'CCT', descripcion: 'Contrato Colectivo de Trabajo', screen: null, url: null, publico: true },
        { id: 2, titulo: 'Estatutos', descripcion: 'Reglamentos y normas', screen: null, url: null, publico: true },
        { id: 4, titulo: 'Tarjetón Activo', descripcion: 'Tarjetón Digital Activo IMSS', screen: null, url: 'https://rh.imss.gob.mx/Personal/TarjetonDigital/', publico: true },
        { id: 5, titulo: 'Tarjetón Jubilado', descripcion: 'Tarjetón Digital Jubilado IMSS', screen: null, url: 'https://rh.imss.gob.mx/Personal/tarjetonjubilados/(S(jbwnwvptmhsti5j5c0prqhpb))/default.aspx', publico: true },
        { id: 3, titulo: 'Calendario', descripcion: 'Fechas importantes y eventos', screen: 'Calendario', url: null, publico: true },
        { id: 9, titulo: 'Scanner QR', descripcion: 'Registro de asistencia', screen: 'Scanner', url: null, publico: true },
    ];

    const menuItems = allMenuItems.filter(item => isLoggedIn || item.publico);

    const handleProfilePress = () => {
        if (isLoggedIn) {
            navigation.navigate('Perfil');
        } else {
            navigation.navigate('Login');
        }
    };

    const handleCardPress = (item: any) => {
        setGlowCard(item.id);
        setTimeout(() => setGlowCard(null), 300);

        if (item.titulo === 'CCT') {
            downloadLocalPDF(require('../assets/CCT.pdf'), 'CCT.pdf');
            return;
        }

        if (item.titulo === 'Estatutos') {
            downloadLocalPDF(require('../assets/estatutos.pdf'), 'Estatutos.pdf');
            return;
        }

        if (item.url) {
            Linking.openURL(item.url).catch(() =>
                Alert.alert('Error', 'No se pudo abrir el enlace. Verifica tu conexión a internet.')
            );
            return;
        }

        if (item.screen) {
            navigation.navigate(item.screen);
        } else {
            Alert.alert(
                'Próximamente',
                'Esta función estará disponible muy pronto',
                [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            setTimeout(() => {
                                navigation.navigate('Panel');
                            }, 2000);
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    };

    // ESTILOS DENTRO DEL COMPONENTE (CORREGIDO - SIN DUPLICADOS)
    const styles = StyleSheet.create({
        mainWrapper: { 
            flex: 1, 
            backgroundColor: colors.background,
        },
        safeArea: { flex: 1 },
        scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
        
        circleDecoration1: {
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: colors.circle1,
            top: -150,
            right: -150,
            opacity: 0.1,
        },
        circleDecoration2: {
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: 175,
            backgroundColor: colors.circle2,
            bottom: -120,
            left: -120,
            opacity: 0.1,
        },
        circleDecoration3: {
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: colors.circle3,
            bottom: 100,
            right: -80,
            opacity: 0.07,
        },
        
        header: {
            marginTop: Platform.OS === 'android' ? 40 : 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 25,
        },
        avatarWrapper: {
            width: 55,
            height: 55,
            marginRight: 12,
        },
        avatar: { 
            width: 55, 
            height: 55, 
            borderRadius: 27.5,
            borderWidth: 2,
            borderColor: colors.avatarBorder,
        },
        nameWrapper: {
            flex: 1,
        },
        lastName: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textTransform: 'uppercase',
            marginBottom: 2,
        },
        firstName: {
            fontSize: 15,
            fontWeight: '500',
            color: colors.textSecondary,
            marginBottom: 2,
        },
        userSection: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        logoutButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            justifyContent: 'center',
            alignItems: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: colors.textPrimary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 3,
                },
            }),
        },

        downloadCard: {
            backgroundColor: '#003c82',
            borderRadius: 20,
            padding: 20,
            marginBottom: 25,
            width: '100%',
            ...Platform.select({
                ios: {
                    shadowColor: '#003c82',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        downloadContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        downloadIconWrapper: {
            width: 60,
            height: 60,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        downloadTextWrapper: {
            flex: 1,
        },
        downloadTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFF',
            marginBottom: 4,
        },
        downloadDescription: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 18,
        },
        downloadBadge: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            alignSelf: 'flex-start',
            marginTop: 12,
        },
        downloadBadgeText: {
            color: '#FFF',
            fontSize: 12,
            fontWeight: 'bold',
        },

        // BOTÓN DE CALCULADORAS (SOLO UNA VEZ)
        botonCalculadoras: {
            width: '100%',
            backgroundColor: colors.card,
            borderRadius: 20,
            marginBottom: 20,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        botonCalculadorasAccent: {
            height: 4, 
            width: '100%',
            backgroundColor: colors.cardAccent,
        },
        botonCalculadorasContent: {
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        botonIconWrapper: {
            width: 42,
            height: 42,
            borderRadius: 10,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 6,
        },
        botonCalculadorasText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },

        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
        },
        card: {
            width: '48%',
            backgroundColor: colors.card,
            borderRadius: 24,
            marginBottom: 12,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        cardGlow: {
            ...Platform.select({
                ios: {
                    shadowColor: '#00a8ff',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        cardAccent: {
            height: 5,
            width: '100%',
            backgroundColor: colors.cardAccent,
        },
        cardContent: {
            padding: 14,
            alignItems: 'center',
        },
        cardIconWrapper: {
            width: 50,
            height: 50,
            borderRadius: 12,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        cardTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 4,
            textAlign: 'center',
            lineHeight: 18,
        },
        cardDescription: {
            fontSize: 11,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 14,
        },

        bottomTab: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            backgroundColor: colors.bottomTab,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            justifyContent: 'space-around',
            alignItems: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 20,
                },
            }),
        },
        tabItem: { alignItems: 'center', flex: 1 },
        tabLabel: { 
            fontSize: 11, 
            color: colors.tabLabel, 
            marginTop: 4, 
            fontWeight: '500' 
        },
        tabLabelActive: { 
            color: colors.tabLabelActive, 
            fontWeight: 'bold' 
        },
        centerTab: {
            alignItems: 'center',
            top: -20,
            backgroundColor: colors.centerTab,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 30,
            ...Platform.select({
                ios: {
                    shadowColor: colors.centerTab,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        centerTabLabel: {
            fontSize: 11,
            color: '#FFF',
            marginTop: 2,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.mainWrapper}>
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

            <View style={styles.circleDecoration1} />
            <View style={styles.circleDecoration2} />
            <View style={styles.circleDecoration3} />

            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
                
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.header}>
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

                        {isLoggedIn && (
                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <LogOut color={colors.textPrimary} size={22} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {isLoggedIn && (
                        <TouchableOpacity style={styles.downloadCard} activeOpacity={0.8} onPress={() => downloadLocalPDF(require('../assets/constancia.pdf'), 'Constancia.pdf')}>
                            <View style={styles.downloadContent}>
                                <View style={styles.downloadIconWrapper}>
                                    <Download color="#FFF" size={32} strokeWidth={2.5} />
                                </View>
                                <View style={styles.downloadTextWrapper}>
                                    <Text style={styles.downloadTitle}>Descargar Constancia</Text>
                                    <Text style={styles.downloadDescription}>
                                        Obtén tu documento oficial de afiliación actualizado al instante.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.downloadBadge}>
                                <Text style={styles.downloadBadgeText}>OFICIAL</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* BOTÓN PARA IR A CALCULADORAS */}
                    <TouchableOpacity 
                        style={styles.botonCalculadoras}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Calculadoras')}
                    >
                        <View style={styles.botonCalculadorasAccent} />
                        
                        <View style={styles.botonCalculadorasContent}>
                            <View style={styles.botonIconWrapper}>
                                <Calculator 
                                    color={theme === 'dark' ? '#FFF' : colors.cardAccent} 
                                    size={24} 
                                    strokeWidth={2} 
                                />
                            </View>

                            <Text style={styles.botonCalculadorasText}>Calculadoras</Text>
                            <Text style={styles.cardDescription}>Préstamos</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.gridContainer}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    glowCard === item.id && styles.cardGlow
                                ]}
                                activeOpacity={0.7}
                                onPress={() => handleCardPress(item)}
                            >
                                <View style={styles.cardAccent} />
                                
                                <View style={styles.cardContent}>
                                    <View style={styles.cardIconWrapper}>
                                        {getIcon(item.titulo)}
                                    </View>
                                    <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
                                    <Text style={styles.cardDescription} numberOfLines={2}>{item.descripcion}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <View style={styles.bottomTab}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Panel')}>
                    <Home color={colors.tabIcon} size={24} />
                    <Text style={[styles.tabLabel, styles.tabLabelActive]}>Inicio</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Noticias', 'Próximamente')}>
                    <Newspaper color={colors.tabIcon} size={24} />
                    <Text style={styles.tabLabel}>Noticias</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.centerTab} onPress={handleProfilePress}>
                    <User color="#FFF" size={28} />
                    <Text style={styles.centerTabLabel}>Perfil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Digital', 'Próximamente')}>
                    <CreditCard color={colors.tabIcon} size={24} />
                    <Text style={styles.tabLabel}>Digital</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Ajustes')}>
                    <Settings color={colors.tabIcon} size={24} />
                    <Text style={styles.tabLabel}>Ajustes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}