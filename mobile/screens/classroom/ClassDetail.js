import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../login/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../../assets/js/date-time';

export default function ClassroomDetailScreen({ navigation, route }) {
    const { owner, signOut } = useAuth();
    const { classId, className, year, grade, yearId, gradeId } = route.params;
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [cdi, setCDI] = useState(null);
    const [mealTicket, setMealTicket] = useState(null);
    const [tuition, setTuition] = useState(null);

    useEffect(() => {
        const apiUrl = `http://localhost:4001/api/classes/${classId}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setTeacherInfo(
                    data[0].assignment.map((i) => ({
                        _id: i._id,
                        duty: i.duty.name,
                        teacherName: i.teacher.name,
                        teacherPhone: i.teacher.phone,
                        teacherEmail: i.teacher.email,
                        teacherAddress: i.teacher.address,
                        teacherGender: i.teacher.gender == 'true' ? 'Nam' : 'Nữ',
                    }))
                );
                setAttendance(data[0].attendance.filter((i) => i.child._id == owner._id));
                setCDI(data[0].cdi.filter((i) => i.child._id == owner._id));
                setTuition(data[0].receipt.filter((i) => i.child._id == owner._id));
                setMealTicket(data[0].mealTicket.filter((i) => i.child._id == owner._id));
            })
            .catch((error) => console.error(error));
    }, [classId, owner]);

    const renderButton = (title, screen, params) => (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(screen, params)}
        >
            <Text style={styles.buttonText}>{title}</Text>
            <Icon name="chevron-right" size={12} color="#555" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerBorder}>
                        <TouchableOpacity style={styles.header}>
                            <Text style={styles.title}>Thông tin lớp học</Text>
                            <Icon name="chevron-down" size={12} color="#555" />
                        </TouchableOpacity>
                        <View style={styles.content}>
                            <Text style={styles.subContent}>Tên lớp: {capitalizeFirstLetter(className)}</Text>
                            <Text style={styles.subContent}>Năm học: {year}</Text>
                            <Text style={styles.subContent}>Khối: {capitalizeFirstLetter(grade)}</Text>
                        </View>
                    </View>

                    {renderButton('Thông tin giáo viên', 'TeacherInfo', { teacherInfo })}
                    {renderButton('Điểm danh', 'Attendance', { attendance })}
                    {renderButton('Chỉ số phát triển', 'Development', { cdi })}
                    {renderButton('Phiếu ăn', 'MealTicket', { mealTicket })}
                    {renderButton('Học phí', 'Tuition', { tuition, gradeId, yearId })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    subContent: {
        paddingVertical: 5,
        color: '#555',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerBorder: {
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 15,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
    },
    buttonText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        flex: 1,
    },
});
