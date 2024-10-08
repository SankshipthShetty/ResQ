import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { firestore, storage } from "../constants/firebaseConfig";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import UploadProgressBar from "./UploadProgressBar";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureView({ picture, setPicture }: PictureViewProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const uploadImageToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `ReportedPictures/${new Date().getTime()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await saveRecordToFirestore(downloadURL);
            const encodedUrl = btoa(downloadURL); // Encode the URL using Base64
            Alert.alert(
              "Upload successful!",
              "",
              [
                {
                  text: "OK",
                  onPress: () => router.push(`./3_ReportForm?imageUrl=${encodedUrl}`)
                }
              ]
            );
            setPicture("");
            setUploadProgress(0);
          });
        }
      );
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const saveRecordToFirestore = async (url: string) => {
    try {
      await addDoc(collection(firestore, "ReportedPictures"), {
        url,
        createdAt: new Date().toISOString(),
      });
      console.log("Document saved correctly");
    } catch (e) {
      console.error("Error saving document", e);
    }
  };

  return (
    <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut}>
      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
          top: -25,
        }}
      >
        <IconButton
          onPress={async () => {
            saveToLibraryAsync(picture);
            Alert.alert("Picture saved!");
          }}
          iosName={"arrow.down"}
          androidName="save"
        />
        <IconButton
          onPress={async () => await shareAsync(picture)}
          iosName={"square.and.arrow.up"}
          androidName="share"
        />
      </View>

      <View
        style={{
          position: "absolute",
          zIndex: 1,
          paddingTop: 50,
          left: 6,
          top: -25,
        }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName={"xmark"}
          androidName="close"
        />
      </View>

      <View
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: 50,
          left: "50%",
          transform: [{ translateX: -40 }],
          width: 100,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onPress={async () => await uploadImageToFirebase(picture)}
          iosName={"triangle"}
          androidName="arrow-forward-circle"
        />
      </View>

      <Image
        source={{ uri: picture }}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 1,
        }}
      />

      {uploadProgress > 0 && <UploadProgressBar progress={uploadProgress} />}
    </Animated.View>
  );
}
