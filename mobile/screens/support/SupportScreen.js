import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const scrollViewRef = useRef();

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            setMessages([...messages, { text: inputMessage, isUser: true }]);
            // Gửi tin nhắn tới chatbot ở đây nếu cần
            setInputMessage('');
        }
    };

    useEffect(() => {
        // Cuộn xuống cuối danh sách tin nhắn khi có tin mới
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.messageContainer}
                    contentContainerStyle={styles.messageContent}
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((message, index) => (
                        <View
                            key={index}
                            style={[
                                styles.message,
                                message.isUser ? styles.userMessage : styles.botMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{message.text}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChangeText={(text) => setInputMessage(text)}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                    >
                        <Text style={styles.sendButtonText}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    messageContainer: {
        flex: 1,
    },
    messageContent: {
        padding: 16,
    },
    message: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 8,
        marginVertical: 4,
    },
    messageText: {
        fontSize: 16,
        color: 'white',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#E5E5EA',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginLeft: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
