import * as React from "react";
import { SymbolView } from "expo-symbols";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Asset, getAssetsAsync } from "expo-media-library";
import { Image } from "expo-image";
import { CameraMode } from "expo-camera";

interface MainRowActionsProps {
  handleTakePicture: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
}

export default function MainRowActions({
  cameraMode,
  handleTakePicture,
  isRecording,
}: MainRowActionsProps) {
  const [assets, setAssets] = React.useState<Asset[]>([]);

  React.useEffect(() => {
    (async () => {
      const { assets } = await getAssetsAsync();
      setAssets(assets);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTakePicture}>
        <SymbolView
          name={
            cameraMode === "picture"
              ? "circle"
              : isRecording
              ? "record.circle"
              : "circle.circle"
          }
          size={50}
          type="hierarchical"
          tintColor={"white"}
          animationSpec={{
            effect: {
              type: "bounce",
            },
            repeating: isRecording,
          }}
          fallback={<View style={styles.fallbackView} />} // Add your fallback view here
        />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
  fallbackView: {
    width: 80,
    height: 80,
    backgroundColor: "#FFFF", // Use a direct color value
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
