import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#ffffff',
  overlay = true,
}) => (
  <View style={[styles.container, overlay && styles.overlay]}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={[styles.message, {color}]}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingIndicator;
