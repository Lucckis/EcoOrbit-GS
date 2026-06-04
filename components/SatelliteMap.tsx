import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { LocationBanner } from "./LocationBanner";
import { LocationModal } from "./LocationModal";

interface SelectedLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

const INITIAL_REGION = {
  latitude: -14.235,
  longitude: -51.925,
  latitudeDelta: 28,
  longitudeDelta: 28,
};

export function SatelliteMap() {
  const { colors } = useTheme();

  const [pendingCoord, setPendingCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingCoord({ latitude, longitude });
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (pendingCoord) {
      setSelectedLocation({
        ...pendingCoord,
        timestamp: new Date(),
      });
    }
    setModalVisible(false);
    setPendingCoord(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setPendingCoord(null);
  };

  const handleCloseBanner = () => {
    setSelectedLocation(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        mapType="satellite"
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            pinColor={colors.primary}
            title="Ponto selecionado"
            description={`${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}
          />
        )}
      </MapView>

      {selectedLocation && (
        <LocationBanner
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
          timestamp={selectedLocation.timestamp}
          onClose={handleCloseBanner}
        />
      )}

      <LocationModal
        visible={modalVisible}
        latitude={pendingCoord?.latitude ?? 0}
        longitude={pendingCoord?.longitude ?? 0}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
