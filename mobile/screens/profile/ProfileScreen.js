import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../login/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../../assets/js/date-time';

export default function ProfileScreen({ navigation }) {
  const { owner, signOut } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const apiUrl = `http://localhost:4001/api/children/${owner._id}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => console.error(error));
  }, [owner]);

  const handleLogout = () => {
    signOut();
    navigation.replace('AuthLoading');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {profileData && (
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMOzr5g9Yzv4s8uA5rDpj7Brb2rXlVbLFa6A&usqp=CAU',
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>{capitalizeFirstLetter(profileData.name)}</Text>
          </View>

          {/* Thông Tin Cá Nhân */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Thông Tin Cá Nhân</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                {/* <Icon name="venus-mars" size={20} color="blue" /> */}
                <Text style={styles.title}>Giới tính:</Text>
                <Text style={styles.label}>{profileData.gender == 'true' ? 'Nam' : 'Nữ'}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="calendar" size={20} color="green" /> */}
                <Text style={styles.title}>Sinh nhật:</Text>
                <Text style={styles.label}>{formatDate(profileData.birthday)}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="home" size={20} color="red" /> */}
                <Text style={styles.title}>Địa chỉ:</Text>
                <Text style={[styles.label, styles.multiLineLabel]}>{capitalizeFirstLetter(profileData.address)}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="home" size={20} color="red" /> */}
                <Text style={styles.title}>Trạng thái:</Text>
                <Text style={styles.label}>{capitalizeFirstLetter(profileData.statusChild)}</Text>
              </View>
            </View>
          </View>

          {/* Thông Tin Trung Tâm Chăm Sóc Trẻ */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Thông tin nhà trẻ</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                {/* <Icon name="venus-mars" size={20} color="blue" /> */}
                <Text style={styles.title}>Tên nhà trẻ:</Text>
                <Text style={styles.label}>{capitalizeFirstLetter(profileData.childcareCenter[profileData.childcareCenter.length - 1].name)}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="calendar" size={20} color="green" /> */}
                <Text style={styles.title}>Số điện thoại:</Text>
                <Text style={styles.label}>{profileData.childcareCenter[profileData.childcareCenter.length - 1].phone}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="home" size={20} color="red" /> */}
                <Text style={styles.title}>E-mail:</Text>
                <Text style={[styles.label, { flexWrap: 'wrap', }]}>{profileData.childcareCenter[profileData.childcareCenter.length - 1].email}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* <Icon name="home" size={20} color="red" /> */}
                <Text style={styles.title}>Địa chỉ:</Text>
                <Text style={[styles.label, styles.multiLineLabel]}>{capitalizeFirstLetter(profileData.childcareCenter[profileData.childcareCenter.length - 1].address)}</Text>
              </View>
            </View>
          </View>

          {/* Nút */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DetailProfile')}>
            <Text style={styles.buttonText}>Xem Thông Tin Phụ Huynh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Đăng Xuất</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#5a31f4',
    marginHorizontal: -20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 80,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'start',
    overflow: 'hidden',
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    marginLeft: 15,
    color: 'black',
  },
  title: {
    fontSize: 14,
    marginTop: 0,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  multiLineLabel: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  logoutButton: {
    backgroundColor: '#f44336', // Màu đỏ
  },
});
