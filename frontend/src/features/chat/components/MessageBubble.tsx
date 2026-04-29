import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../../core/theme/colors';
import { Message } from '../services/chat.service';
import { cartService } from '../../cart/services/cart.service';
import { chatService } from '../services/chat.service';

interface Props {
  message: Message;
  currentUserId: number;
  onQuoteAccepted?: () => void;
}

export default function MessageBubble({ message, currentUserId, onQuoteAccepted }: Props) {
  const isMe = message.senderId === currentUserId;
  const isQuote = message.isQuote;

  const handleAcceptQuote = async () => {
    if (!message.quoteProductId) return;

    const productId = message.quoteProductId;
    const quantity = message.quoteQuantity!;
    const quotePrice = message.quotePrice!; // Precio unitario (debe ser unitario, no total)

    console.log('📦 Aceptando cotización:', {
      productId,
      quantity,
      quotePrice,
      total: quotePrice * quantity,
    });

    try {
      // 1. Marcar cotización como aceptada en backend
      await chatService.acceptQuote(message.id);
      console.log('✅ Cotización marcada como aceptada en backend');

      // 2. Agregar al carrito con precio personalizado
      const cartItem = await cartService.addItem(productId, quantity, quotePrice);
      console.log('🛒 Producto agregado al carrito:', cartItem);

      Alert.alert('Éxito', 'Producto agregado al carrito con el precio acordado');
      if (onQuoteAccepted) onQuoteAccepted();
    } catch (error) {
      console.error('❌ Error al procesar la cotización:', error);
      Alert.alert('Error', 'No se pudo procesar la cotización');
    }
  };

  const handleRejectQuote = () => {
    Alert.alert('Cotización rechazada', 'Puedes negociar con el vendedor.');
  };

  if (isQuote) {
  console.log('Cotización recibida:', {
    isMe,
    quoteStatus: message.quoteStatus,
    isPending: message.quoteStatus === 'pending',
    showButtons: !isMe && message.quoteStatus === 'pending',
  });

    const total = (message.quotePrice || 0) * (message.quoteQuantity || 0);
    const isPending = message.quoteStatus === 'pending';
    const isAccepted = message.quoteStatus === 'accepted';

    return (
      <View style={[styles.wrapper, isMe ? styles.wrapperMe : styles.wrapperOther]}>
        <View style={[styles.bubble, styles.quoteBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.quoteTitle}>📄 Cotización</Text>
          <Text style={styles.quoteProduct}>{message.quoteProductName}</Text>
          <Text style={styles.quoteDetail}>Cantidad: {message.quoteQuantity}</Text>
          <Text style={styles.quoteDetail}>Precio unitario: ${message.quotePrice}</Text>
          <Text style={styles.quoteTotal}>Total: ${total.toLocaleString()}</Text>

          {!isMe && isPending && (
            <View style={styles.quoteActions}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptQuote}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectQuote}>
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          )}
          {isAccepted && <Text style={styles.acceptedText}>✓ Cotización aceptada</Text>}

          <Text style={styles.time}>
            {new Date(message.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }

  // Mensaje normal
  return (
    <View style={[styles.wrapper, isMe ? styles.wrapperMe : styles.wrapperOther]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>{message.content}</Text>
        <Text style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}>
          {new Date(message.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 3, marginHorizontal: 8 },
  wrapperMe: { alignItems: 'flex-end' },
  wrapperOther: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  bubbleMe: { backgroundColor: COLORS.primaryDark, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, borderWidth: 0.5, borderColor: COLORS.border },
  text: { fontSize: 14, lineHeight: 20 },
  textMe: { color: COLORS.white },
  textOther: { color: COLORS.text },
  time: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  timeMe: { color: 'rgba(255,255,255,0.6)' },
  timeOther: { color: COLORS.textSecondary },
  quoteBubble: { minWidth: 200 },
  quoteTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 14 },
  quoteProduct: { fontWeight: '500', marginBottom: 2 },
  quoteDetail: { fontSize: 12, color: COLORS.textSecondary },
  quoteTotal: { fontWeight: 'bold', marginTop: 4, color: COLORS.accent },
  quoteActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 8 },
  acceptButton: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  rejectButton: { backgroundColor: COLORS.error, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  buttonText: { color: COLORS.white, fontWeight: '500', fontSize: 12 },
  acceptedText: { fontSize: 12, color: COLORS.success, textAlign: 'center', marginTop: 8 },
});