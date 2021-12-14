/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
// import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './android/app/src/screens/Main';

const Stack = createNativeStackNavigator();

const AnaEkran = ({navigation}) => {
  return (
    <View style={Stil.AnaEkranView}>
      <ImageBackground
        source={require('./images/AnaEkranResim3.jpg')}
        resizeMode="cover"
        style={Stil.AnaEkranResim}>
        <Text style={Stil.AnaEkranBaslik}>Group UP!</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('KayitEkrani');
          }}
          style={Stil.AnaEkranButon}>
          <Text>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GirisEkrani');
          }}
          style={Stil.AnaEkranButon}>
          <Text>Giriş</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const KayitEkrani = ({navigation}) => {
  const [kAdi, setkAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [tel, setTel] = useState('');
  const [ad, setAd] = useState('');
  const [uri, setUri] = useState('');
  const [gorunurluk, gorunurlukAyarla] = useState(false);

  async function kayitOl() {
    let mevcutmu = false;
    const kullanicilar = firestore().collection('kullanicilar');

    kullanicilar
      .where('kullaniciAdi', '==', kAdi)
      .get()
      .then(query => {
        if (!query.empty) {
          mevcutmu = true;
          alert('Bu kullanıcı adı zaten alınmış!');
        }

        kullanicilar
          .where('telefonNo', '==', tel)
          .get()
          .then(query => {
            if (!query.empty) {
              mevcutmu = true;
              alert('Bu telefon numarası zaten alınmış!');
            }

            if (!mevcutmu) {
              const resimRef = storage().ref('kullaniciResimleri/' + kAdi);

              const task = resimRef.putFile(uri);

              task.then(async () => {
                let fotoUrl = await resimRef.getDownloadURL();

                kullanicilar
                  .doc(kAdi)
                  .set({
                    kullaniciAdi: kAdi,
                    sifre: sifre,
                    telefonNo: tel,
                    ad: ad,
                    fotoUrl: fotoUrl,
                  })
                  .then(() => {
                    ToastAndroid.show(
                      'Kayıt Oluşturma Başarılı.',
                      ToastAndroid.SHORT,
                    );
                    navigation.navigate('GirisEkrani');
                  });
              });
            }
          });
      });
  }

  function fotografCek() {
    const fotoAyari = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchCamera(fotoAyari, resim => {
      setUri(resim.assets[0].uri);
      gorunurlukAyarla(true);
    });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={Stil.KayitEkraniView}>
        <Text style={Stil.KullaniciInputHeader}>Kullanıcı Adı</Text>
        <TextInput
          onChangeText={text => setkAdi(text)}
          style={Stil.KayitEkraniTextInput}
          placeholder="Kullanıcı Adı"
        />
        <Text style={Stil.KullaniciInputHeader}>Şifre</Text>
        <TextInput
          onChangeText={text => setSifre(text)}
          style={Stil.KayitEkraniTextInput}
          placeholder="Şifre"
        />
        <Text style={Stil.KullaniciInputHeader}>Telefon Numarası</Text>
        <TextInput
          onChangeText={text => setTel(text)}
          style={Stil.KayitEkraniTextInput}
          placeholder="Telefon Numarası"
        />
        <Text style={Stil.KullaniciInputHeader}>Ad</Text>
        <TextInput
          onChangeText={text => setAd(text)}
          style={Stil.KayitEkraniTextInput}
          placeholder="Ad"
        />
        {!gorunurluk && (
          <TouchableOpacity
            onPress={() => {
              fotografCek();
            }}
            style={Stil.KayitEkraniButon}>
            <Text>Fotoğraf Ekle</Text>
          </TouchableOpacity>
        )}
        {gorunurluk && (
          <TouchableOpacity
            onPress={() => {
              kayitOl();
            }}
            style={Stil.KayitEkraniButon}>
            <Text>Kaydı Tamamla</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const GirisEkrani = ({navigation}) => {
  const [kAdi, setkAdi] = useState('');
  const [sifre, setSifre] = useState('');
  function giris() {
    const kullanicilar = firestore().collection('kullanicilar');

    kullanicilar
      .where('kullaniciAdi', '==', kAdi)
      .where('sifre', '==', sifre)
      .get()
      .then(query => {
        if (!query.empty) {
          ToastAndroid.show('Giriş Başarılı.', ToastAndroid.SHORT);
          navigation.navigate('Main', {kullanici: query.docs[0].data()});
        } else {
          alert('Böyle bir kullanıcı yok!');
        }
      });
  }

  return (
    <View style={Stil.KayitEkraniView}>
      <Text style={Stil.KullaniciInputHeader}>Kullanıcı Adı</Text>
      <TextInput
        onChangeText={newText => setkAdi(newText)}
        style={Stil.GirisEkraniTextInput}
        placeholder="Kullanıcı Adı"
      />
      <Text style={Stil.KullaniciInputHeader}>Şifre</Text>
      <TextInput
        onChangeText={newText => setSifre(newText)}
        style={Stil.GirisEkraniTextInput}
        placeholder="Şifre"
      />
      <TouchableOpacity
        onPress={() => {
          giris();
        }}
        style={Stil.GirisEkraniButon}>
        <Text>Giriş!</Text>
      </TouchableOpacity>
    </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AnaEkran" component={AnaEkran} />
        <Stack.Screen name="KayitEkrani" component={KayitEkrani} />
        <Stack.Screen name="GirisEkrani" component={GirisEkrani} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const Stil = StyleSheet.create({
  AnaEkranView: {
    flex: 1,
  },

  AnaEkranBaslik: {
    fontSize: 50,
    fontFamily: 'Lobster-Regular',
    color: '#00ADB5',
  },

  AnaEkranButon: {
    width: '50%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    margin: '5%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#222831',
  },

  AnaEkranResim: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  KayitEkraniView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },

  KayitEkraniTextInput: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '8%',
    marginHorizontal: '7%',
    marginBottom: '10%',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#222831',
  },

  KayitEkraniButon: {
    width: '50%',
    height: '7%',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    margin: '5%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#222831',
  },

  GirisEkraniTextInput: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '10%',
    minHeight: '10%',
    marginHorizontal: '10%',
    marginBottom: '10%',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#222831',
  },

  GirisEkraniButon: {
    width: '60%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#222831',
    margin: '7%',
  },

  KullaniciInputHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222831',
    marginBottom: '2%',
    textAlign: 'left',
  },
});
