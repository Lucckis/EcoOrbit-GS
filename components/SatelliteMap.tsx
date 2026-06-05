import { useTheme } from "@/context/ThemeContext";
import { analyzeRegion, toLocalDate } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
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

  const analyzeMutation = useMutation({
    mutationFn: analyzeRegion,
  });

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingCoord({ latitude, longitude });
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (!pendingCoord) return;

    const location: SelectedLocation = {
      ...pendingCoord,
      timestamp: new Date(),
    };

    setSelectedLocation(location);
    setModalVisible(false);

    analyzeMutation.mutate({
      lat: pendingCoord.latitude,
      lon: pendingCoord.longitude,
      data: toLocalDate(new Date()),
    });

    setPendingCoord(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setPendingCoord(null);
  };

  const handleCloseBanner = () => {
    setSelectedLocation(null);
    analyzeMutation.reset();
  };

  const handleRetry = () => {
    if (!selectedLocation) return;
    analyzeMutation.mutate({
      lat: selectedLocation.latitude,
      lon: selectedLocation.longitude,
      data: toLocalDate(selectedLocation.timestamp),
    });
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
            pinColor={
              analyzeMutation.data?.fireDetected
                ? colors.accent
                : colors.primary
            }
            title="Ponto analisado"
            description={
              analyzeMutation.data
                ? `${analyzeMutation.data.fireDetected ? "🔥 Risco" : "✅ Seguro"} — ${analyzeMutation.data.confidencePercentage?.toFixed(1)}%`
                : "Analisando..."
            }
          />
        )}
      </MapView>

      {selectedLocation && (
        <LocationBanner
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
          timestamp={selectedLocation.timestamp}
          onClose={handleCloseBanner}
          onRetry={handleRetry}
          isPending={analyzeMutation.isPending}
          isError={analyzeMutation.isError}
          result={analyzeMutation.data}
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
