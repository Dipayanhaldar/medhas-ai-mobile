import AsyncStorage from "@react-native-async-storage/async-storage";
export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; createdAt: number };
const CHAT_KEY = "medhas.chat.v1";
const MEMORY_KEY = "medhas.memory.v1";
const API_KEY = "medhas.backend.v1";
export async function loadMessages(): Promise<ChatMessage[]> {
  try { return JSON.parse((await AsyncStorage.getItem(CHAT_KEY)) || "[]"); } catch { return []; }
}
export async function saveMessages(messages: ChatMessage[]) {
  await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-100)));
}
export async function loadMemory(): Promise<string> {
  return (await AsyncStorage.getItem(MEMORY_KEY)) || "";
}
export async function saveMemory(value: string) {
  await AsyncStorage.setItem(MEMORY_KEY, value);
}
export async function loadBackendUrl(): Promise<string> {
  return (await AsyncStorage.getItem(API_KEY)) || "";
}
export async function saveBackendUrl(value: string) {
  await AsyncStorage.setItem(API_KEY, value.trim().replace(/\/$/, ""));
}
