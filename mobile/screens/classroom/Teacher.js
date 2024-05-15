import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../login/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../../assets/js/date-time';


export default function TeacherInfoScreen({ route }) {
  const { teacherInfo } = route.params;
  console.log('teacherInfo', teacherInfo);
  const [parents, setParents] = useState(null);
  return (
    <ScrollView style={styles.container}>
      {teacherInfo && teacherInfo.map((teacher) => (
        <View style={styles.parentCard} key={teacher.id}>
          <Text style={styles.parentName}>{capitalizeFirstLetter(teacher.teacherName)}</Text>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="transgender" size={20} color="blue" /> */}
              <Text style={styles.label}>Giới tính:</Text>
            </View>
            <Text style={[styles.title]}>{capitalizeFirstLetter(teacher.teacherGender)}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="phone" size={20} color="green" /> */}
              <Text style={styles.label}>Số điện thoại:</Text>
            </View>
            <Text style={[styles.title]}>{teacher.teacherPhone}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="envelope" size={20} color="purple" /> */}
              <Text style={styles.label}>Email:</Text>
            </View>
            <Text style={[styles.title, styles.multiLineLabel]}>{teacher.teacherEmail}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="tasks" size={20} color="red" /> */}
              <Text style={[styles.label, styles.multiLineLabel]}>Địa chỉ:</Text>
            </View>
            <Text style={[styles.multiLineLabel, styles.title]}>{capitalizeFirstLetter(teacher.teacherAddress)}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="tasks" size={20} color="red" /> */}
              <Text style={[styles.label, styles.multiLineLabel]}>Nhiệm vụ:</Text>
            </View>
            <Text style={[styles.multiLineLabel, styles.title]}>{capitalizeFirstLetter(teacher.duty)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  parentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  parentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonText: {
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',

  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  radioButtonsContainer: {
    marginBottom: 10,
  },
  radioButtons: {
    // flexDirection: 'row',
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 10,
  },
  radioButton: {
    backgroundColor: '#dcdde1',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#3498db',
  },
  radioButtonText: {
    color: 'black',
  },
  radioButtonTextSelected: {
    color: 'white',
  },
  label: {
    fontSize: 14,
    marginTop: 0,
  },
  title: {
    fontSize: 14,
    marginLeft: 10,
    color: '#4a4a4a',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 0,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 5,
    marginRight: 15,

  },
  info: {
    marginLeft: 10,
  },
  textarea: {
    height: 50,
  },
  customButton: {
    backgroundColor: 'green', // Màu nền mặc định
    borderWidth: 1, // Độ dày của viền
    borderColor: 'green', // Màu viền mặc định
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  customButtonText: {
    color: 'white', // Màu văn bản
    fontWeight: 'bold'
  },
  multiLineLabel: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
