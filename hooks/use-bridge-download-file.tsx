import * as React from "react";
import { Platform } from "react-native";
import RNFetchBlob from "react-native-blob-util";
import { DownloadDirectoryPath } from "react-native-fs";

export default function useBridgeDownloadFile() {
  const MIME = {
    pdf: "application/pdf",
    jpeg: "image/jpeg",
    png: "image/png",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  const onDownloadFile = React.useCallback(
    async (file: any, type: string, title: string) => {
      try {
        const {
          dirs: { DownloadDir, DocumentDir, LegacyDownloadDir },
        } = RNFetchBlob.fs;

        const directoryPath = Platform.select({
          ios: LegacyDownloadDir
            ? LegacyDownloadDir
            : DownloadDirectoryPath
            ? DownloadDirectoryPath
            : DocumentDir,
          android: LegacyDownloadDir
            ? LegacyDownloadDir
            : DownloadDirectoryPath
            ? DownloadDirectoryPath
            : DownloadDir,
        });

        const date = new Date();
        const filePath = `${directoryPath}/${title}_${Math.floor(
          date.getTime() + date.getSeconds() / 2
        )}.${type}`;
        const base64Str = file.split(",")?.[1];

        RNFetchBlob.fs
          .writeFile(filePath, base64Str, "base64")
          .then(() => {
            if (Platform.OS === "ios") {
              RNFetchBlob.ios.previewDocument(filePath);
            } else {
              RNFetchBlob.android.actionViewIntent(
                filePath,
                (MIME as any)[type]
              );
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    },
    []
  );

  return { onDownloadFile };
}
