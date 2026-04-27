import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';

interface Props {
  onExplore?: () => void;
}

export default function HomeBanner({ onExplore }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textSide}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Import & Export</Text>
        </View>
        <Text style={styles.title}>
          Productos{'\n'}colombianos{'\n'}
          <Text style={styles.titleAccent}>al mundo</Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={onExplore}>
          <Text style={styles.buttonText}>Explorar ahora</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <Text style={styles.flag}>🇺🇸</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#2C2C2A',
  },
  textSide: {
    flex: 1,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  pillText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 14,
  },
  titleAccent: {
    color: COLORS.accent,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(61,170,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  circleInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(61,170,53,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 28,
  },
});