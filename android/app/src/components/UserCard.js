import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
const UserCard = function ({kullaniciAdi, fotoUrl}) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.foto}
          source={{
            uri: fotoUrl,
          }}
        />
      </View>
      <View style={{marginLeft: 20}}>
        <Text style={{color: '#EEEEEE', fontSize: 15, marginRight: 20}}>
          Merhaba {kullaniciAdi}!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 10,
    minHeight: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222831',
  },
  foto: {
    width: 100,
    height: 100,
    margin: 20,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#00ADB5',
  },
});

export default UserCard;
