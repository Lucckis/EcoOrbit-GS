import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

export interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { colors } = useTheme();
  const isUser = message.type === "user";

  const time = message.timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}>
      {!isUser && (
        <View
          style={[styles.botAvatar, { backgroundColor: colors.primary + "30" }]}
        >
          <Text style={styles.botAvatarEmoji}>🌿</Text>
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: colors.primary }]
              : [
                  styles.bubbleBot,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ],
          ]}
        >
          <Text
            style={[styles.text, { color: isUser ? "#FFFFFF" : colors.text }]}
          >
            {message.text}
          </Text>
        </View>
        <Text
          style={[
            styles.time,
            { color: colors.textMuted },
            isUser && styles.timeUser,
          ]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

export function TypingBubble() {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, styles.rowBot]}>
      <View
        style={[styles.botAvatar, { backgroundColor: colors.primary + "30" }]}
      >
        <Text style={styles.botAvatarEmoji}>🌿</Text>
      </View>
      <View
        style={[
          styles.bubble,
          styles.bubbleBot,
          styles.typingBubble,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.typingDots, { color: colors.primary }]}>
          ● ● ●
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 4, paddingHorizontal: 12 },
  rowUser: { justifyContent: "flex-end" },
  rowBot: { justifyContent: "flex-start", alignItems: "flex-end" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 16,
  },
  botAvatarEmoji: { fontSize: 16 },
  bubbleWrapper: { maxWidth: "78%" },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleBot: { borderBottomLeftRadius: 4, borderWidth: 1 },
  text: { fontSize: 14, lineHeight: 20 },
  time: { fontSize: 11, marginTop: 4, color: "gray" },
  timeUser: { textAlign: "right" },
  typingBubble: { paddingVertical: 12 },
  typingDots: { fontSize: 10, letterSpacing: 4 },
});
