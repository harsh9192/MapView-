import {
    StyleSheet,
    View,
  } from "react-native";
  import React, { useRef } from "react";
  import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
  import Geolocation from "@react-native-community/geolocation";

  
  const CustomMapView = () => {
    const [region, setRegion] = React.useState(null);
    const [store, setStore] = React.useState([]);
    const mapRef = useRef();
    React.useEffect(() => {}, []);
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (info) => {
          if (info) {
            doSearch(info.coords.latitude, info.coords.longitude);
          }
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    };
  
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {region != null ? (
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={region}
              zoomEnabled
              provider={PROVIDER_GOOGLE}
            >
              {store.map((item) => {
                return (
                  <Marker
                    onPress={() => onMarkerPress(item)}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                  ></Marker>
                );
              })}
            </MapView>
          ) : null}
        </View>
    );
  };
  
  export default CustomMapView;
  
  const styles = StyleSheet.create({
      button: {
          height: 40,
          width: 40,
          backgroundColor: "#fff",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 60,
          left: 20,
        },
    });
  


  
  
  
  
  
  
  
  
  