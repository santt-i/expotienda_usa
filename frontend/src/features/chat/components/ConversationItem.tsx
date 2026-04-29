import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { Conversation } from '../services/chat.service';

interface Props {
  conversation: Conversation;
  onPress: () => void;
}

export default function ConversationItem({ conversation, onPress }: Props) {
  // Inicial del nombre para el avatar
  const initial = conversation.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar con inicial */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      {/* Info de la conversación */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.time}>
            {new Date(conversation.lastMessageTime).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: '2-digit',
            })}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  time: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  lastMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});