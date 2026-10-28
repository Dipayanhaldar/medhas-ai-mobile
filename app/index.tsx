import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import * as Speech from "expo-speech";
import { askMedhas } from "../lib/api";
import { ChatMessage, loadMemory, loadMessages, saveMessages, saveMemory } from "../lib/storage";

const starter: ChatMessage = { id: "welcome", role: "assistant", content: "Hi! I'm Medhas.ai. Add your own compatible AI backend in Settings to start chatting. Your chat history and memory notes stay on this device.", createdAt: Date.now() };
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([starter]);
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { (async () => {
    const saved = await loadMessages(); if (saved.length) setMessages(saved);
    setMemory(await loadMemory());
  })(); }, []);
  async function send() {
    const text = input.trim(); if (!text || busy) return;
    const user: ChatMessage = { id: String(Date.now()), role: "user", content: text, createdAt: Date.now() };
    const updated = [...messages, user]; setMessages(updated); setInput(""); setBusy(true); setError("");
    await saveMessages(updated);
    try {
      const answer = await askMedhas(updated.map(m => ({ role: m.role, content: m.content })), memory);
      const finalMessages = [...updated, { id: String(Date.now() + 1), role: "assistant" as const, content: answer, createdAt: Date.now() }];
      setMessages(finalMessages); await saveMessages(finalMessages);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to contact the AI backend."); }
    finally { setBusy(false); }
  }
  async function updateMemory() {
    const value = await loadMemory(); setMemory(value);
  }
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.top}>
        <View><Text style={styles.brand}>Medhas.ai</Text><Text style={styles.subtitle}>Your personal AI companion</Text></View>
        <Link href="/settings" asChild><Pressable style={styles.settings}><Text style={styles.settingsText}>Settings</Text></Pressable></Link>
      </View>
      <View style={styles.banner}><Text style={styles.bannerText}>Early preview · Configure a backend to enable AI replies</Text></View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.messages}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.aiBubble]}>
          <Text style={styles.role}>{item.role === "user" ? "YOU" : "MEDHAS"}</Text>
          <Text style={styles.message}>{item.content}</Text>
          {item.role === "assistant" && <Pressable onPress={() => Speech.speak(item.content)}><Text style={styles.speak}>▶ Read aloud</Text></Pressable>}
        </View>}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.composer}>
        <TextInput value={input} onChangeText={setInput} placeholder="Ask Medhas anything..." placeholderTextColor="#7f89a7" multiline style={styles.input} editable={!busy} onSubmitEditing={send} />
        <Pressable onPress={send} disabled={busy || !input.trim()} style={[styles.send, (busy || !input.trim()) && styles.disabled]}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
        </Pressable>
      </View>
      <Text style={styles.foot}>Memory is stored locally on this device. Do not enter sensitive information.</Text>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#101426"},container:{flex:1,paddingHorizontal:16},top:{paddingTop:12,paddingBottom:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},brand:{fontSize:27,fontWeight:"800",color:"#f4f6ff"},subtitle:{color:"#9ba5c4",marginTop:3},settings:{paddingHorizontal:14,paddingVertical:9,borderRadius:12,backgroundColor:"#252d49"},settingsText:{color:"#fff",fontWeight:"600"},banner:{padding:10,borderRadius:10,backgroundColor:"#202a42",marginBottom:12},bannerText:{color:"#b8c8ff",fontSize:12},list:{flex:1},messages:{paddingBottom:14,gap:12},bubble:{padding:14,borderRadius:16,maxWidth:"94%"},userBubble:{alignSelf:"flex-end",backgroundColor:"#4b5ed7"},aiBubble:{alignSelf:"flex-start",backgroundColor:"#1b2238",borderWidth:1,borderColor:"#303954"},role:{fontSize:10,fontWeight:"800",color:"#aab6ff",marginBottom:6,letterSpacing:1},message:{fontSize:15,lineHeight:22,color:"#f1f3ff"},speak:{color:"#b8c8ff",marginTop:10,fontSize:12},error:{color:"#ff9d9d",paddingVertical:8},composer:{flexDirection:"row",alignItems:"flex-end",gap:8,paddingTop:10},input:{flex:1,minHeight:48,maxHeight:120,borderRadius:14,backgroundColor:"#1b2238",color:"#fff",paddingHorizontal:14,paddingVertical:12,borderWidth:1,borderColor:"#303954"},send:{height:48,paddingHorizontal:16,borderRadius:14,alignItems:"center",justifyContent:"center",backgroundColor:"#5267eb"},disabled:{opacity:.5},sendText:{color:"#fff",fontWeight:"700"},foot:{textAlign:"center",fontSize:10,color:"#6f7895",paddingTop:8,paddingBottom:6}
});
