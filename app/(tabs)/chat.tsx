import {
  ChatBubble,
  TypingBubble,
  type Message,
} from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { useTheme } from "@/context/ThemeContext";
import { getChatHistory, sendChat, type ChatHistoryItem } from "@/services/api";
import { getErrorMessage } from "@/services/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

// ── Conversor: histórico da API → Messages ─────────────────────
function historyToMessages(history: ChatHistoryItem[]): Message[] {
  return history.map((item, i) => ({
    id: `hist-${i}`,
    type: (item.role === "user" ? "user" : "bot") as "user" | "bot",
    text: item.content,
    timestamp: new Date(),
  }));
}

// ── Mensagem de boas-vindas ────────────────────────────────────
const WELCOME: Message = {
  id: "welcome",
  type: "bot",
  text: "👋 Olá! Sou o assistente ambiental do EcoOrbit. Posso responder dúvidas sobre risco de incêndio, clima e preservação ambiental. Como posso ajudar?",
  timestamp: new Date(),
};

export default function ChatScreen() {
  const { colors } = useTheme();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);

  const historyQuery = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
    staleTime: 0,
  });

  useEffect(() => {
    if (historyQuery.data && historyQuery.data.length > 0) {
      const historical = historyToMessages(historyQuery.data);
      setMessages([WELCOME, ...historical]);
    }
  }, [historyQuery.data]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: sendChat,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: data.resposta,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (err) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: "bot",
          text: `⚠️ ${getErrorMessage(err)}`,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", text, timestamp: new Date() },
    ]);
    sendMutation.mutate({ pergunta: text });
  };

  // ── Render ────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onContentSizeChange={scrollToEnd}
        refreshControl={
          <RefreshControl
            refreshing={historyQuery.isFetching}
            onRefresh={historyQuery.refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          historyQuery.isError ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.accent + "18" },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.accent }]}>
                Não foi possível carregar o histórico. Puxe para recarregar.
              </Text>
            </View>
          ) : null
        }
      />

      {sendMutation.isPending && <TypingBubble />}

      <ChatInput onSend={handleSend} loading={sendMutation.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 12, paddingBottom: 4 },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
  },
  errorText: { fontSize: 13, textAlign: "center" },
});
