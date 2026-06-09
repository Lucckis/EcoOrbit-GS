import { useTheme } from "@/context/ThemeContext";
import { analyzeRegion, toLocalDate } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { LocationBanner } from "./LocationBanner";
import { LocationModal } from "./LocationModal";

interface SelectedLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export function SatelliteMap() {
  const { colors } = useTheme();
  const webViewRef = useRef<WebView>(null);

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

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "mapPress") {
        setPendingCoord({ latitude: data.lat, longitude: data.lng });
        setModalVisible(true);
      }
    } catch {}
  };

  const handleConfirm = () => {
    if (!pendingCoord) return;
    const location: SelectedLocation = {
      ...pendingCoord,
      timestamp: new Date(),
    };
    setSelectedLocation(location);
    setModalVisible(false);

    // Adiciona marcador no mapa
    webViewRef.current?.injectJavaScript(`
      if(window.currentMarker) window.currentMarker.remove();
      window.currentMarker = L.marker([${pendingCoord.latitude}, ${pendingCoord.longitude}])
        .addTo(map)
        .bindPopup("Analisando...")
        .openPopup();
      true;
    `);

    analyzeMutation.mutate({
      lat: pendingCoord.latitude,
      lon: pendingCoord.longitude,
      data: toLocalDate(new Date()),
    });

    setPendingCoord(null);
  };

  // Atualiza popup do marcador quando análise terminar
  if (analyzeMutation.isSuccess && analyzeMutation.data && selectedLocation) {
    const result = analyzeMutation.data;
    const popupText = result.fireDetected
      ? `🔥 Risco — ${result.confidencePercentage?.toFixed(1)}%`
      : `✅ Seguro — ${result.confidencePercentage?.toFixed(1)}%`;
    webViewRef.current?.injectJavaScript(`
      if(window.currentMarker) window.currentMarker.setPopupContent("${popupText}");
      true;
    `);
  }

  const handleCancel = () => {
    setModalVisible(false);
    setPendingCoord(null);
  };

  const handleCloseBanner = () => {
    setSelectedLocation(null);
    analyzeMutation.reset();
    webViewRef.current?.injectJavaScript(`
      if(window.currentMarker) { window.currentMarker.remove(); window.currentMarker = null; }
      true;
    `);
  };

  const handleRetry = () => {
    if (!selectedLocation) return;
    analyzeMutation.mutate({
      lat: selectedLocation.latitude,
      lon: selectedLocation.longitude,
      data: toLocalDate(selectedLocation.timestamp),
    });
  };

  const leafletHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([-14.235, -51.925], 4);

    // Camada satélite via Esri (gratuita, sem API key)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
    ).addTo(map);

    window.currentMarker = null;

    map.on('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mapPress',
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }));
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: leafletHTML }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={["*"]}
      />

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
  container: { flex: 1 },
  map: { flex: 1 },
});
