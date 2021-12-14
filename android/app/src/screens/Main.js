import React from 'react';
import {
  View,
  StyleSheet,
  DrawerLayoutAndroid,
  Pressable,
  Text,
} from 'react-native';
import UserCard from '../components/UserCard';

const Main = function ({route, navigation}) {
  const {ad, fotoUrl, kullaniciAdi, sifre, telefonNo} = route.params.kullanici;
  const navigationView = function () {
    return (
      <View style={{alignItems: 'center'}}>
        <UserCard kullaniciAdi={kullaniciAdi} fotoUrl={fotoUrl} />
        <Pressable style={styles.button}>
          <Text style={{fontSize: 15, color: '#222831'}}>
            Yeni Etkinlik Oluştur
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <DrawerLayoutAndroid
      drawerWidth={300}
      renderNavigationView={navigationView}></DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '50%',
    height: '10%',
    backgroundColor: '#EEEEEE',
    margin: '5%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#222831',
    alignItems: 'center',
  },
});
export default Main;
