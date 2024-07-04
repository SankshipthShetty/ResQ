import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { CameraMode, CameraView, FlashMode } from "expo-camera";
import * as WebBrowser from "expo-web-browser";
import MainRowActions from "@/components/MainRowActions";
import CameraTools from "@/components/CameraTools";
import PictureView from "@/components/PictureView";

export default function Userpage3() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">("back");
  const [picture, setPicture] = React.useState<string>(""); // "https://picsum.photos/seed/696/3000/2000"
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    setPicture(response!.uri);
  }

  if (picture) {
    return <PictureView picture={picture} setPicture={setPicture} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        mode={cameraMode}
        zoom={cameraZoom}
        flash={cameraFlash}
        enableTorch={cameraTorch}
        facing={cameraFacing}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <CameraTools
              cameraZoom={cameraZoom}
              cameraFlash={cameraFlash}
              cameraTorch={cameraTorch}
              setCameraZoom={setCameraZoom}
              setCameraFacing={setCameraFacing}
              setCameraTorch={setCameraTorch}
              setCameraFlash={setCameraFlash}
            />
            <MainRowActions
              cameraMode={cameraMode}
              handleTakePicture={handleTakePicture}
              isRecording={false}
            />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
