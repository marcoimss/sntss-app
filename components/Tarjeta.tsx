import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    titulo: string;
    descripcion: string;
}

export default function Tarjeta({ titulo, descripcion }: Props) {
    return (
        <View
            style={{
                backgroundColor: '#222',
                padding: 20,
                borderRadius: 10,
                marginTop: 20,
                width: 250,
            }}>
            <Text style={{ color: '#00ff88', fontSize: 18, fontWeight: 'bold' }}>
                {titulo}
            </Text>

            <Text style={{ color: '#aaa', marginTop: 5 }}>
                {descripcion}
            </Text>
        </View>
    );
}
