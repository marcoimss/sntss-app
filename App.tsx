import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import PanelScreen from './screens/PanelScreen';
import Loader from './components/Loader/Loader';
import ScannerScreen from './screens/ScannerScreen';
import BusquedaScreen from './screens/BusquedaScreen';
import ConfirmacionScreen from './screens/ConfirmacionScreen';
import CalculadoraHipotecario from './screens/CalculadoraHipotecario';
import CalculadoraMedianoPlazo from './screens/CalculadoraMedianoPlazo';
import CalculadoraAguinaldo from './screens/CalculadoraAguinaldo';
import CalculadoraAuto from './screens/CalculadoraAuto';
import Calculadora2Julio from './screens/Calculadora2Julio';
import CalculadoraHorasExtras from './screens/CalculadoraHorasExtras';
import CalculadoraClausula97 from './screens/CalculadoraClausula97';
import AjustesScreen from './screens/AjustesScreen';
import CalculadorasScreen from './screens/CalculadorasScreen';
import CalendarioScreen from './screens/CalendarioScreen';
import CalendarioImprimibleScreen from './screens/CalendarioImprimibleScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader onFinish={handleLoaderFinish} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Panel" component={PanelScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen name="Busqueda" component={BusquedaScreen} />
          <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} />
          <Stack.Screen name="CalculadoraHipotecario" component={CalculadoraHipotecario} />
          <Stack.Screen name="CalculadoraMedianoPlazo" component={CalculadoraMedianoPlazo} />
          <Stack.Screen name="CalculadoraAguinaldo" component={CalculadoraAguinaldo} />
          <Stack.Screen name="CalculadoraAuto" component={CalculadoraAuto} />
          <Stack.Screen name="Calculadora2Julio" component={Calculadora2Julio} />
          <Stack.Screen name="CalculadoraHorasExtras" component={CalculadoraHorasExtras} />
          <Stack.Screen name="CalculadoraClausula97" component={CalculadoraClausula97} />
          <Stack.Screen name="Ajustes" component={AjustesScreen} />
          <Stack.Screen name="Calculadoras" component={CalculadorasScreen} />
          <Stack.Screen name="Calendario" component={CalendarioScreen} />
          <Stack.Screen name="CalendarioImprimible" component={CalendarioImprimibleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}