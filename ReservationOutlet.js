import React, {useEffect, useState,useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {StylesAll} from './commanStyle/objectStyle';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import RBSheet from 'react-native-raw-bottom-sheet';
import {COLORS} from './Styles/colors';
import {showLocation} from 'react-native-map-link';

const ReservationOutlet = ({navigation, route}) => {
  const refRBSheet = useRef();

  const mapRef = React.createRef();
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [currentItem, setCurrentItem] = useState({});
  const[sourceLongitude,setSourceLongitude] = useState('')
  
  const [position, setPosition] = useState({
    latitude: 10.0,
    longitude: 10.0,
    latitudeDelta: 0.0001,
    longitudeDelta: 0.0001,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords;
      setSourceLongitude(crd.longitude);
      setPosition({
        latitude: crd.latitude,
        longitude: crd.longitude,
        latitudeDelta: 0.0421,
        longitudeDelta: 0.0421,
      });
    }).catch(
      (err) => {
        requestPermissions();
        console.log(err);
      },
      Platform.OS === 'android'
        ? {}
        : {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000},
    );
  }, []);

  const showIOSDevice = (itemId) => {
    let myData = route.params?.dataValue.coordinates.split(',');
    console.log('first Data', Number(myData[0]));
    console.log('first Data', Number(myData[1]));
    //'googleMaps://app?saddr=6.931970+79.857750&daddr=6.909877+79.848521'
    if (itemId === 1) {
      Linking.openURL(
        `http://maps.apple.com/maps?daddr=${myData[0]},${myData[1]}`,
      );
    } else if (itemId === 2) {
      Linking.openURL(`googleMaps://app?saddr=${myData[0]}&daddr=${myData[1]}`);
    } else {
      Linking.openURL(
        `https://waze.com/ul?q=${myData[0]},${myData[1]}"&navigate=yes&zoom=17`,
      );
    }
  };

  return (
    <View
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#fafbfb'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafbfb"></StatusBar>
      <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
        <View style={[StylesAll.flexWtrapper]}>
          <View style={StylesAll.headWrapper}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={[StylesAll.commonHeader, {marginBottom: 20}]}>
                <Image
                  source={require('./Image/back.png')}
                  style={StylesAll.headArrow}
                  resizeMode="contain"
                />
                <Text style={[StylesAll.headTitle]}>OUTLETS</Text>
              </View>
            </TouchableOpacity>
          </View>

          <MapView
            style={{flex: 2}}
            ref={mapRef}
            mapType="standard"
            showsUserLocation={setShowUserLocation}
            followsUserLocation={true}
            showsCompass={true}
            showsPointOfInterest={false}
            //region={this.state.region}
            //onRegionChange={this.onRegionChange}
            region={position}
            //coordinates={position}
            initialRegion={position}>
            <MapView.Marker coordinate={position} />
          </MapView>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              paddingHorizontal: 40,
              paddingVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                let myData = route.params?.dataValue.coordinates.split(',');

                Platform.OS === 'ios'
                  ? 
                  showLocation({
                    latitude: myData[0],
                    longitude: myData[1],
                    sourceLongitude: sourceLongitude,
                     googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                     googlePlaceId: 'AIzaSyB4aoN6mTSjWrnSIpBMLSyEv29GahbKeMs',  // optionally specify the google-place-id
                    alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                    
                })
                  : Linking.openURL(
                      `google.navigation:q=${
                        myData.length > 0 ? Number(myData[0]) : ''
                      }+${myData.length > 0 ? Number(myData[1]) : ''}`,
                    );
              }}>
              <View style={StylesAll.commonButton1}>
                <Text style={{ color: '#fff',fontFamily: 'SFCompactDisplay-Medium',
                                            fontSize : 16,}}>NAVIGATE NOW</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{paddingHorizontal: 44, paddingVertical: 20}}>
          <Text style={{color: '#000',fontFamily: 'SFCompactDisplay-Medium',
                                            fontSize : 18,}}>Address</Text>

          <Text>{route.params?.dataValue.address}</Text>
          <Text></Text>
          <Text style={{color: '#000',fontFamily: 'SFCompactDisplay-Medium',
                                            fontSize : 18,}}>Phone</Text>

          <Text>{route.params?.dataValue.outletPhone}</Text>
        </View>

        <View
          style={[
            StylesAll.flexWtrapper,
            {
              justifyContent: 'flex-end',
              paddingHorizontal: 40,
              paddingVertical: 20,
              flex: 0.5,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ScanQr');
            }}>
            <View style={StylesAll.commonButton1}>
              <Text style={{color: '#fff',fontFamily: 'SFCompactDisplay-Medium',
                                            fontSize : 16,}}>ORDER NOW</Text>
            </View>
          </TouchableOpacity>
        </View>

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={300}
          backgroundColor={COLORS.redTheme}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#fafbfb',
            }}>
            <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingBottom: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    showIOSDevice(2);
                  }}>
                  <View
                    style={{
                      margin: 10,
                      paddingVertical: 20,
                      backgroundColor: COLORS.app_browntheme,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Google</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    showIOSDevice(1);
                  }}>
                  <View
                    style={{
                      margin: 10,
                      paddingVertical: 20,
                      backgroundColor: COLORS.app_browntheme,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Apple</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    showIOSDevice(3);
                  }}>
                  <View
                    style={{
                      margin: 10,
                      paddingVertical: 20,
                      backgroundColor: COLORS.app_browntheme,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Waze</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </RBSheet>
      </SafeAreaView>
    </View>
  );
};

export default ReservationOutlet;
