import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest news
  useEffect(() => {
    fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWSAPI_KEY")
      .then(res => res.json())
      .then(data => {
        setNews(data.articles.slice(0, 10));
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  // Request notification permissions
  useEffect(() => {
    (async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permission not granted for notifications!");
        }
      }
    })();
  }, []);

  // Show local notification
  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // shows immediately
    });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>📰 Latest News</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "white", padding: 12, borderRadius: 12, marginBottom: 10, elevation: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>{item.title}</Text>
              <Text style={{ fontSize: 14, color: "gray", marginBottom: 8 }}>
                {item.description || "No description available"}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                  <Text style={{ color: "blue", fontWeight: "600" }}>Read More</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendNotification("Breaking News 🚨", item.title)}
                >
                  <Text style={{ color: "red", fontWeight: "600" }}>🔔 Notify Me</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}