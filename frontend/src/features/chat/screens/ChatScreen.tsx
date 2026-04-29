// src/features/chat/screens/ChatScreen.tsx (versión sin Picker)
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../../core/context/AuthContext';
import { chatService, Message } from '../services/chat.service';
import { socketService } from '../services/socket.service';
import MessageBubble from '../components/MessageBubble';
import { COLORS } from '../../../core/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { distributorService } from '../../distributor/services/distributor.service';
import { Product } from '../../products/services/products.service';

export default function ChatScreen() {
  const route = useRoute();
  const { userId, name, contextType, contextId, contextTitle } = route.params as {
    userId: number;
    name: string;
    contextType?: string;
    contextId?: number;
    contextTitle?: string;
  };
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const isSeller = user?.role === 'DISTRIBUIDOR';

  // Estado para productos del vendedor
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Estado para el modal de cotización
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [quoteQuantity, setQuoteQuantity] = useState('1');
  const [quotePrice, setQuotePrice] = useState('');
  const [productSelectorVisible, setProductSelectorVisible] = useState(false);

  // Cargar productos cuando el modal se abre (si es vendedor)
  useEffect(() => {
    if (modalVisible && isSeller && sellerProducts.length === 0) {
      loadSellerProducts();
    }
  }, [modalVisible]);

  const loadSellerProducts = async () => {
    setLoadingProducts(true);
    try {
      const products = await distributorService.getMyProducts();
      setSellerProducts(products);
      if (products.length > 0) {
        setSelectedProductId(products[0].id);
        setSelectedProductName(products[0].name);
        setQuotePrice(products[0].priceCOP.toString());
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus productos');
    } finally {
      setLoadingProducts(false);
    }
  };

  const selectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedProductName(product.name);
    setQuotePrice(product.priceCOP.toString());
    setProductSelectorVisible(false);
  };

  const sendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const tempMessage: any = {
      id: -Date.now(),
      senderId: user!.id,
      receiverId: userId,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);
    setInputText('');
    socketService.sendMessage(userId, trimmed, contextType, contextId);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendQuote = () => {
    setModalVisible(true);
  };

  const handleSendQuote = () => {
    if (!selectedProductId) {
      Alert.alert('Error', 'Selecciona un producto');
      return;
    }
    const quantity = parseInt(quoteQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Error', 'Cantidad válida requerida');
      return;
    }
    const price = parseFloat(quotePrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Precio válido requerido');
      return;
    }
    socketService.sendQuote(userId, selectedProductId, quantity, price);
    setModalVisible(false);
    setSelectedProductId(null);
    setSelectedProductName('');
    setQuoteQuantity('1');
    setQuotePrice('');
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.senderId === userId || newMessage.receiverId === userId) {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id || (msg.id < 0 && msg.content === newMessage.content));
          if (exists) return prev;
          return [...prev, newMessage];
        });
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    };

    const initializeChat = async () => {
      try {
        if (!socketService.isConnected()) {
          await socketService.connect();
        }
        const data = await chatService.getMessages(userId);
        setMessages(data);
      } catch (error) {
        console.error('❌ Error cargando chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
    socketService.onNewMessage(handleNewMessage);
    return () => socketService.offNewMessage(handleNewMessage);
  }, [userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{name}</Text>
            {contextTitle && (
              <Text style={styles.contextText}>Consultando sobre: {contextTitle}</Text>
            )}
          </View>
          {isSeller && (
            <TouchableOpacity style={styles.quoteButton} onPress={sendQuote}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.white} />
              <Text style={styles.quoteButtonText}>Cotizar</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} currentUserId={user!.id} />}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de cotización principal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enviar cotización</Text>

            {loadingProducts ? (
              <ActivityIndicator size="small" color={COLORS.accent} style={{ marginVertical: 20 }} />
            ) : (
              <>
                {sellerProducts.length === 0 ? (
                  <Text style={styles.modalText}>No tienes productos. Crea uno primero.</Text>
                ) : (
                  <>
                    <Text style={styles.modalLabel}>Producto:</Text>
                    <TouchableOpacity
                      style={styles.productSelectorButton}
                      onPress={() => setProductSelectorVisible(true)}
                    >
                      <Text style={styles.productSelectorText}>
                        {selectedProductName || 'Seleccionar producto'}
                      </Text>
                      <Ionicons name="chevron-down-outline" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <Text style={styles.modalLabel}>Cantidad:</Text>
                    <TextInput
                      style={styles.modalInput}
                      keyboardType="numeric"
                      value={quoteQuantity}
                      onChangeText={setQuoteQuantity}
                    />

                    <Text style={styles.modalLabel}>Precio unitario (COP):</Text>
                    <TextInput
                      style={styles.modalInput}
                      keyboardType="numeric"
                      value={quotePrice}
                      onChangeText={setQuotePrice}
                    />
                  </>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSend]}
                onPress={handleSendQuote}
                disabled={sellerProducts.length === 0}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal selector de producto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={productSelectorVisible}
        onRequestClose={() => setProductSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Seleccionar producto</Text>
            <FlatList
              data={sellerProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productItem}
                  onPress={() => selectProduct(item)}
                >
                  <Text style={styles.productItemName}>{item.name}</Text>
                  <Text style={styles.productItemPrice}>${item.priceCOP.toLocaleString()}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel, { marginTop: 12 }]}
              onPress={() => setProductSelectorVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... estilos existentes (mantén los mismos)
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  contextText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  quoteButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  quoteButtonText: { color: COLORS.white, fontSize: 12, fontWeight: '500' },
  messagesList: { paddingVertical: 16, flexGrow: 1 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: COLORS.text,
  },
  sendButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.text,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    color: COLORS.text,
  },
  modalInput: {
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  productSelectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  productSelectorText: {
    fontSize: 16,
    color: COLORS.text,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  productItemName: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  productItemPrice: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.gray,
  },
  modalButtonSend: {
    backgroundColor: COLORS.accent,
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  modalText: {
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.textSecondary,
  },
});