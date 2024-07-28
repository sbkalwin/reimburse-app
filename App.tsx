import React from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { request, PERMISSIONS, check } from "react-native-permissions";
import useBridgeDownloadFile from "./hooks/use-bridge-download-file";

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

  const { onDownloadFile } = useBridgeDownloadFile()

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

  React.useEffect(() => {
    async function exec() {
      try {
        // const resultRequestRead = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        // const resultRequestWrite = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        // const resultRequestWrite = await PermissionsAndroid.request('android.permission.READ_MEDIA_IMAGES')
        await PermissionsAndroid.request(
          "android.permission.READ_MEDIA_IMAGES"
        );
        await PermissionsAndroid.request("android.permission.READ_MEDIA_AUDIO");
        await PermissionsAndroid.request("android.permission.READ_MEDIA_VIDEO");
        await PermissionsAndroid.request(
          "android.permission.WRITE_EXTERNAL_STORAGE"
        );
        await PermissionsAndroid.request("android.permission.CAMERA")
        // console.log( resultRequestWrite)
      } catch (e) {
        console.log(e);
      }
    }
    exec();
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
            androidLayerType="hardware"
            onMessage={(event) => {
              const data = event.nativeEvent.data;
              if (!data || data === "null") return;
              const translate = JSON.parse(data)
              onDownloadFile(translate.data, 'xlsx', `download`)
            }}
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
