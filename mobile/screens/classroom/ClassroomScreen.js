import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'; // Import a popular icon library
import { useAuth } from '../login/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../../assets/js/date-time';

export default function ClassroomScreen({ navigation }) {
    const { owner, signOut } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [classrooms, setClassroom] = useState(null);

    useEffect(() => {
        // Sử dụng useEffect để gọi dữ liệu từ API khi mà owner thay đổi
        const apiUrl = `http://localhost:4001/api/children/${owner._id}`;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setClassroom(data.classes.map(i => {
                    return {
                        _id: i._id,
                        name: i.name,
                        year: i.schoolYear.name,
                        yearId: i.schoolYear._id,
                        grade: i.grade.name,
                        gradeId: i.grade._id,
                    }
                }));
            })
            .catch((error) => console.error(error));
    }, [owner]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.header}></Text>
                {classrooms && classrooms.map((classroom) => (
                    <TouchableOpacity
                        key={classroom._id}
                        style={styles.classroomBox}
                        onPress={() => navigation.navigate('ClassroomDetail', {
                            classId: classroom._id,
                            className: classroom.name,
                            year: classroom.year,
                            grade: classroom.grade,
                            yearId: classroom.yearId,
                            gradeId: classroom.gradeId,
                        })}
                    >
                        <View style={styles.classroomInfoContainer}>
                            <Text style={styles.classroomName}>Lớp {capitalizeFirstLetter(classroom.name)}</Text>
                            <Text style={styles.classroomInfo}>Năm học {classroom.year}</Text>
                            <Text style={styles.classroomInfo}>{capitalizeFirstLetter(classroom.grade)}</Text>
                        </View>
                        <Feather name="chevron-right" style={styles.classroomArrow} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Light gray background
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Dark gray text
    },
    classroomBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'white', // White background
        borderRadius: 10,
        marginBottom: 16,
        marginHorizontal: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, // Reduce opacity
        shadowRadius: 4,
        elevation: 4,
    },
    classroomInfoContainer: {
        flex: 1,
    },
    classroomName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    classroomInfo: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
    classroomArrow: {
        fontSize: 24,
        color: '#007AFF',
    },
});
