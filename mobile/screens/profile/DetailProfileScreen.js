import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../login/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../../assets/js/date-time';


export default function ParentInfoScreen() {
  const [parents, setParents] = useState(null);

  const { owner, signOut } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Sử dụng useEffect để gọi dữ liệu từ API khi mà owner thay đổi
    const apiUrl = `http://localhost:4001/api/children/${owner._id}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data);
        setParents(data.parentDetails);
      })
      .catch((error) => console.error(error));
  }, [owner]);

  const handleLogout = () => {
    signOut();
    navigation.replace('AuthLoading');
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [newParent, setNewParent] = useState({
    name: '',
    gender: 'Nam',
    phone: '',
    email: '',
    address: '',
    relationship: '',
  });

  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [deletingParentId, setDeletingParentId] = useState(null);

  // Validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required('Họ Tên không được để trống'),
    gender: yup.string().required('Giới Tính không được để trống'),
    phone: yup
      .string()
      .matches(/^\d{10}$/, 'Số Điện Thoại không hợp lệ')
      .required('Số Điện Thoại không được để trống'),
    email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
    address: yup.string(),
    relationship: yup.string(),
  });

  const addParent = () => {
    validationSchema
      .validate(newParent)
      .then(() => {
        setParents([...parents, { id: parents.length + 1, ...newParent }]);
        setModalVisible(false);
        setNewParent({
          name: '',
          gender: 'Nam',
          phone: '',
          email: '',
          address: '',
          relationship: '',
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const editParent = () => {
    if (editingParent) {
      validationSchema
        .validate(newParent)
        .then(() => {
          const index = parents.findIndex((parent) => parent.id === editingParent.id);
          if (index !== -1) {
            const updatedParents = [...parents];
            updatedParents[index] = { ...editingParent, ...newParent };
            setParents(updatedParents);
          }

          setModalVisible(false);
          setEditingParent(null);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  const deleteParent = (parentId) => {
    // Hiển thị Modal xác nhận xoá trước khi xoá
    setDeletingParentId(parentId);
    setConfirmDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = () => {
    if (deletingParentId) {
      const updatedParents = parents.filter((parent) => parent.id !== deletingParentId);
      setParents(updatedParents);
    }
    setConfirmDeleteModalVisible(false);
    setDeletingParentId(null);
  };

  const handleDeleteCanceled = () => {
    setConfirmDeleteModalVisible(false);
    setDeletingParentId(null);
  };

  const relationshipOptions = ['Tôi', 'Cha', 'Mẹ', 'Anh trai', 'Chị gái', 'Người giám hộ'];

  // Các radio đã chọn (state riêng biệt cho radio)
  const [selectedRelationship, setSelectedRelationship] = useState('');

  return (
    <ScrollView style={styles.container}>
      {parents && parents.map((parent) => (
        <View style={styles.parentCard} key={parent.id}>
          <Text style={styles.parentName}>{capitalizeFirstLetter(parent.name)}</Text>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="transgender" size={20} color="blue" /> */}
              <Text style={styles.label}>Giới tính:</Text>
            </View>
            <Text style={{ marginTop: 0 }}>{capitalizeFirstLetter(parent.gender == 'true' ? 'nam' : 'nữ')}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="phone" size={20} color="green" /> */}
              <Text style={styles.label}>Số điện thoại:</Text>
            </View>
            <Text style={{ marginTop: 0 }}>{parent.phone}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="envelope" size={20} color="purple" /> */}
              <Text style={styles.label}>Email:</Text>
            </View>
            <Text style={{ marginTop: 0 }}>{parent.email}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="map-marker" size={20} color="red" /> */}
              <Text style={[styles.label, styles.multiLineLabel]}>Địa chỉ:</Text>
            </View>
            <Text style={[styles.multiLineLabel]}>{capitalizeFirstLetter(parent.address)}</Text>
          </View>
          <View style={{
            borderBottomWidth: 1, borderColor: '#E0E0E0', marginHorizontal: -15, marginBottom: 10,
          }}></View>
          <View style={styles.infoContainer}>
            <View style={styles.labelContainer}>
              {/* <Icon name="user" size={20} color="orange" /> */}
              <Text style={styles.label}>Mối quan hệ:</Text>
            </View>
            <Text style={{ marginTop: 0 }}>{capitalizeFirstLetter(parent.relationship)}</Text>
          </View>
          {/* <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                setEditingParent(parent);
                setNewParent({ ...parent });
                setModalVisible(true);
              }}
            >
              <Icon name="pencil" size={20} color="blue" />
              <Text style={styles.iconButtonText}>Sửa</Text>
            </TouchableOpacity>
            <View style={{ margin: 10 }}></View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteParent(parent.id)}
            >
              <Icon name="trash" size={20} color="red" />
              <Text style={styles.iconButtonText}>Xoá</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      ))}

      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setNewParent({
            name: '',
            gender: 'Nam',
            phone: '',
            email: '',
            address: '',
            relationship: '',
          });
          setModalVisible(true);
        }}
      >
        <Icon name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Thêm Phụ Huynh</Text>
      </TouchableOpacity> */}
      {/* <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingParent ? 'Chỉnh Sửa Thông Tin' : 'Thêm Phụ Huynh Mới'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Họ Tên"
                onChangeText={(text) => setNewParent({ ...newParent, name: text })}
                value={newParent.name}
              />
              <View style={styles.radioButtonsContainer}>
                <Text style={styles.label}>Giới Tính:</Text>
                <View style={styles.radioButtons}>
                  {['Nam', 'Nữ'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.radioButton,
                        newParent.gender === gender ? styles.radioButtonSelected : null,
                      ]}
                      onPress={() => setNewParent({ ...newParent, gender })}
                    >
                      <Text
                        style={
                          newParent.gender === gender
                            ? styles.radioButtonTextSelected
                            : styles.radioButtonText
                        }
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Số Điện Thoại"
                onChangeText={(text) => setNewParent({ ...newParent, phone: text })}
                value={newParent.phone}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setNewParent({ ...newParent, email: text })}
                value={newParent.email}
              />
              <TextInput
                style={[styles.input, styles.textarea]}
                multiline={true}
                placeholder="Địa Chỉ"
                onChangeText={(text) => setNewParent({ ...newParent, address: text })}
                value={newParent.address}
              />
              <View style={styles.radioButtonsContainer}>
                <Text style={styles.label}>Mối Quan Hệ:</Text>
                <View style={styles.radioButtons}>
                  {relationshipOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.radioButton,
                        selectedRelationship === option ? styles.radioButtonSelected : null,
                      ]}
                      onPress={() => {
                        setSelectedRelationship(option);
                        setNewParent({ ...newParent, relationship: option });
                      }}
                    >
                      <Text
                        style={
                          selectedRelationship === option
                            ? styles.radioButtonTextSelected
                            : styles.radioButtonText
                        }
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={editingParent ? editParent : addParent}
                style={[
                  styles.customButton,
                  {
                    backgroundColor: editingParent ? 'yellow' : 'green',
                    borderColor: editingParent ? 'yellow' : 'green',
                    color: editingParent ? 'black' : 'white',
                  },
                ]}
              >
                <Text style={[styles.customButtonText, {
                  color: editingParent ? 'black' : 'white',
                }]}>
                  {editingParent ? 'Lưu' : 'Thêm'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingParent(null);
                }}
                style={[styles.customButton, { backgroundColor: 'red', borderColor: 'red' }]}
              >
                <Text style={styles.customButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal> */}

      {/* <Modal
        visible={confirmDeleteModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xoá</Text>
            <Text style={{ marginBottom: 20 }}>Bạn có chắc chắn muốn xoá phụ huynh này?</Text>
            <Button title="Xoá" onPress={() => handleDeleteConfirmed()} />
            <Button title="Hủy" onPress={() => handleDeleteCanceled()} />
          </View>
        </View>
      </Modal> */}
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
    borderRadius: 15,
    padding: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  iconButtonText: {
    marginLeft: 5,
    color: 'white',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    flexDirection: 'row',
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
    marginLeft: 0,
    fontSize: 14,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 10,
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
