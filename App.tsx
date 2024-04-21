import React from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function App() {
  //https://github.com/resonatecoop/stream-app/commit/645547530367a60b73c09aa621b66ee22478eafa
  const webViewRef = React.useRef<WebView>(null);

  const onAndroidBackPress = React.useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }

    return false;
  }, [webViewRef]);

  React.useEffect((): (() => void) | undefined => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return (): void => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <WebView
            cacheEnabled
            cacheMode="LOAD_DEFAULT"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{
              uri: "https://reimburse-webapp-sigma.vercel.app/",
            }}
            mixedContentMode="never"
            allowsBackForwardNavigationGestures
            style={{ flex: 1 }}
            hideKeyboardAccessoryView
            overScrollMode="never"
            pullToRefreshEnabled={false}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
