import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Camera } from "expo-camera";

export default function QRCodeScanner({ setRecipient, setSteps }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setRecipient(data);
    setSteps({
      enterRecipientAddress: false,
      scanQRCode: false,
      enterAmountToSend: true,
      confirmTransaction: false,
      postTransaction: false,
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View className="flex-1 justify-center">
      <Camera
        className="flex-1"
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}
