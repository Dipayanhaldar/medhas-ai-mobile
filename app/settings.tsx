import { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { loadBackendUrl, loadMemory, saveBackendUrl, saveMemory } from "../lib/storage";
export default function Settings() {
  const [url, setUrl] = useState("");
  const [memory, setMemory] = useState("");
  useEffect(() => { (async () => { setUrl(await loadBackendUrl()); setMemory(await loadMemory()); })(); }, []);
  async function save() {
    if (url && !/^https?:\/\//i.test(url)) { Alert.alert("Check URL", "Enter a full backend URL starting with https://"); return; }
    await saveBackendUrl(url); await saveMemory(memory);
    Alert.alert("Saved", "Backend URL and local memory notes have been saved.");
  }
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.label}>AI backend URL</Text>
    <Text style={styles.help}>Enter the base URL of your own server that supports POST /v1/chat/completions. Do not put an API key in this app.</Text>
    <TextInput value={url} onChangeText={setUrl} placeholder="https://your-backend.example" placeholderTextColor="#7f89a7" autoCapitalize="none" autoCorrect={false} keyboardType="url" style={styles.input}/>
    <Text style={styles.label}>Memory notes (stored on this device)</Text>
    <Text style={styles.help}>Add preferences or context you want included in future requests. Avoid sensitive personal data.</Text>
    <TextInput value={memory} onChangeText={setMemory} placeholder="Example: Explain technical topics step by step." placeholderTextColor="#7f89a7" multiline style={[styles.input,styles.memory]}/>
    <Pressable onPress={save} style={styles.button}><Text style={styles.buttonText}>Save settings</Text></Pressable>
    <View style={styles.note}><Text style={styles.noteTitle}>Preview limitations</Text><Text style={styles.help}>A backend is not included or hosted by this project. Uploaded document understanding, web search, and speech-to-text are not implemented yet. Voice output uses your device's speech engine.</Text></View>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:"#101426"},content:{padding:20},title:{fontSize:28,fontWeight:"800",color:"#f4f6ff",marginBottom:24},label:{color:"#f4f6ff",fontSize:15,fontWeight:"700",marginTop:16,marginBottom:8},help:{color:"#a3acc8",fontSize:13,lineHeight:19,marginBottom:10},input:{borderRadius:12,backgroundColor:"#1b2238",color:"#fff",padding:14,borderWidth:1,borderColor:"#303954"},memory:{minHeight:130,textAlignVertical:"top"},button:{backgroundColor:"#5267eb",padding:15,borderRadius:12,alignItems:"center",marginTop:20},buttonText:{color:"#fff",fontWeight:"800"},note:{marginTop:28,padding:14,backgroundColor:"#202a42",borderRadius:12},noteTitle:{color:"#f4f6ff",fontWeight:"800",marginBottom:8}});
