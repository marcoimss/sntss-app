import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Switch, 
    Platform,
    Alert,
    Modal,
    TextInput,
    ScrollView,
    Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowLeft, Key, Mail, X, Save, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function AjustesScreen({ navigation }: any) {
    const { theme, toggleTheme, colors } = useTheme();
    
    // Estados para modales
    const [modalVisible, setModalVisible] = useState<'password' | 'email' | null>(null);
    
    // Estados para contraseña
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    
    // Estados para correo
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    
    // Estado de sesión
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    // Verificar sesión al cargar
    useEffect(() => {
        const checkSession = async () => {
            try {
                const data = await AsyncStorage.getItem('userData');
                if (data) {
                    const parsed = JSON.parse(data);
                    setIsLoggedIn(true);
                    setCurrentEmail(parsed.correo || 'No registrado');
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setIsLoggedIn(false);
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = () => {
        if (!currentPassword) {
            Alert.alert('Error', 'Ingresa tu contraseña actual');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setTimeout(() => {
            setModalVisible(null);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('✅ Éxito', 'Contraseña actualizada correctamente');
        }, 500);
    };

    const handleUpdateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newEmail || !emailRegex.test(newEmail)) {
            Alert.alert('Error', 'Ingresa un correo electrónico válido');
            return;
        }
        if (newEmail !== confirmEmail) {
            Alert.alert('Error', 'Los correos no coinciden');
            return;
        }

        setTimeout(() => {
            setCurrentEmail(newEmail);
            setModalVisible(null);
            setNewEmail('');
            setConfirmEmail('');
            Alert.alert('✅ Éxito', 'Correo actualizado correctamente');
        }, 500);
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

            {/* CÍRCULOS DECORATIVOS */}
            <View style={[styles.circleDecoration1, { backgroundColor: colors.circle1 }]} />
            <View style={[styles.circleDecoration2, { backgroundColor: colors.circle2 }]} />
            <View style={[styles.circleDecoration3, { backgroundColor: colors.circle3 }]} />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.backButton,
                        { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                    ]}
                >
                    <ArrowLeft color={colors.textPrimary} size={24} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Ajustes
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* TARJETA DE TEMA - SIEMPRE VISIBLE */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            {theme === 'dark' ? (
                                <Moon color={colors.textPrimary} size={24} />
                            ) : (
                                <Sun color={colors.textPrimary} size={24} />
                            )}
                            <Text style={[styles.label, { color: colors.textPrimary }]}>
                                Modo oscuro
                            </Text>
                        </View>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: '#003c82' }}
                            thumbColor={theme === 'dark' ? '#00a8ff' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* SOLO MOSTRAR OPCIONES DE SEGURIDAD SI HAY SESIÓN */}
                {isLoggedIn && (
                    <>
                        {/* SECCIÓN SEGURIDAD */}
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            SEGURIDAD
                        </Text>

                        {/* Cambiar Contraseña */}
                        <TouchableOpacity 
                            style={[styles.card, styles.optionCard, { backgroundColor: colors.card }]}
                            onPress={() => setModalVisible('password')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Key color={colors.cardAccent} size={24} />
                                    <View>
                                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                                            Cambiar contraseña
                                        </Text>
                                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>
                                            Actualiza tu contraseña de acceso
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Modificar Correo */}
                        <TouchableOpacity 
                            style={[styles.card, styles.optionCard, { backgroundColor: colors.card }]}
                            onPress={() => setModalVisible('email')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Mail color={colors.cardAccent} size={24} />
                                    <View>
                                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                                            Modificar correo electrónico
                                        </Text>
                                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>
                                            Actual: {currentEmail}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {/* Nota informativa */}
                <Text style={[styles.note, { color: colors.textSecondary }]}>
                    {isLoggedIn 
                        ? 'El cambio de tema se aplica en toda la app' 
                        : 'Inicia sesión para acceder a más opciones de seguridad'}
                </Text>
            </ScrollView>

            {/* MODAL CAMBIAR CONTRASEÑA */}
            <Modal
                visible={modalVisible === 'password'}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                                Cambiar contraseña
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(null)}>
                                <X color={colors.textSecondary} size={24} />
                            </TouchableOpacity>
                        </View>

                        {/* Contraseña actual */}
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Contraseña actual
                        </Text>
                        <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Ingresa tu contraseña actual"
                                placeholderTextColor={colors.textSecondary + '80'}
                                secureTextEntry={!showPassword.current}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
                                {showPassword.current ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                            </TouchableOpacity>
                        </View>

                        {/* Nueva contraseña */}
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Nueva contraseña
                        </Text>
                        <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor={colors.textSecondary + '80'}
                                secureTextEntry={!showPassword.new}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                                {showPassword.new ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                            </TouchableOpacity>
                        </View>

                        {/* Confirmar contraseña */}
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Confirmar nueva contraseña
                        </Text>
                        <View style={[styles.inputContainer, { borderColor: colors.cardAccent }]}>
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Repite tu nueva contraseña"
                                placeholderTextColor={colors.textSecondary + '80'}
                                secureTextEntry={!showPassword.confirm}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                                {showPassword.confirm ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.cardAccent }]}
                            onPress={handleUpdatePassword}
                        >
                            <Save color="#FFF" size={20} />
                            <Text style={styles.saveButtonText}>Actualizar contraseña</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* MODAL MODIFICAR CORREO */}
            <Modal
                visible={modalVisible === 'email'}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                                Modificar correo
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(null)}>
                                <X color={colors.textSecondary} size={24} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Correo actual
                        </Text>
                        <View style={[styles.infoBox, { backgroundColor: colors.cardAccent + '20' }]}>
                            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
                                {currentEmail}
                            </Text>
                        </View>

                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Nuevo correo electrónico
                        </Text>
                        <TextInput
                            style={[styles.inputFull, { color: colors.textPrimary, borderColor: colors.cardAccent }]}
                            placeholder="ejemplo@correo.com"
                            placeholderTextColor={colors.textSecondary + '80'}
                            value={newEmail}
                            onChangeText={setNewEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                            Confirmar nuevo correo
                        </Text>
                        <TextInput
                            style={[styles.inputFull, { color: colors.textPrimary, borderColor: colors.cardAccent }]}
                            placeholder="repite el nuevo correo"
                            placeholderTextColor={colors.textSecondary + '80'}
                            value={confirmEmail}
                            onChangeText={setConfirmEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.cardAccent }]}
                            onPress={handleUpdateEmail}
                        >
                            <Mail color="#FFF" size={20} />
                            <Text style={styles.saveButtonText}>Actualizar correo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 12,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    optionCard: {
        paddingVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    subLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    note: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
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
    
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 20,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
    },
    inputFull: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
    },
    infoBox: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 12,
        marginTop: 24,
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});