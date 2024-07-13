//camera view

import * as React from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CameraMode, CameraView, FlashMode } from "expo-camera";
import { useRouter } from 'expo-router';
import MainRowActions from "@/components/MainRowActions";
import CameraTools from "@/components/CameraTools";
import PictureView from "@/components/PictureView";
import IconButton from "@/components/IconButton";

export default function Userpage3() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">("back");
  const [picture, setPicture] = React.useState<string>(""); // "https://picsum.photos/seed/696/3000/2000"
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const router = useRouter(); // Use the useRouter hook

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
            <IconButton
            onPress={() => router.push('./Userpage1')}
            iosName={"xmark"}
            androidName="close"
            />

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

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
