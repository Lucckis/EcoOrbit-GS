import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInputProps {
  onSend: (text: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  loading = false,
  disabled = false,
}: ChatInputProps) {
  const { colors } = useTheme();
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || loading || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const canSend = text.trim().length > 0 && !loading && !disabled;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.surfaceSecondary },
        ]}
        placeholder="Pergunte sobre risco de incêndio..."
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[
          styles.sendBtn,
          { backgroundColor: canSend ? colors.primary : colors.border },
        ]}
        onPress={handleSend}
        disabled={!canSend}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="send" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
