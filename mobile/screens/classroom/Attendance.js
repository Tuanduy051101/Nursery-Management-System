import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatDate } from '../../assets/js/date-time';
import { capitalizeFirstLetter } from '../../assets/js/date-time';

export default function AttendanceScreen({ route }) {
    const { attendance } = route.params;
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (attendance) {
            const formattedData = attendance.map(item => ({
                ...item,
                status: item.present === 'true' ? 'có mặt' : 'vắng mặt',
                sessionName: `${item.session.name} (${item.session.startTime} - ${item.session.endTime})`,
                dateFormat: formatDate(item.date),
            }));
            setFilteredData(formattedData.filter(item => item.date === selectedDate));
        }
    }, [attendance, selectedDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nhập vào ngày điểm danh</Text>
            <View style={styles.inputContainer}>
                <FontAwesome name="calendar" size={20} color="#333" style={styles.calendarIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Chọn ngày (YYYY-MM-DD)"
                    value={selectedDate}
                    onChangeText={text => setSelectedDate(text)}
                />
            </View>
            <Text style={styles.header}>Kết quả</Text>
            <FlatList
                data={filteredData}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.attendanceItem}>
                        <View style={styles.attendanceInfo}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Ngày:</Text>
                                <Text style={styles.value}>{item.dateFormat}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Buổi:</Text>
                                <Text style={styles.value}>{item.sessionName}</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={styles.label}>Trạng thái:</Text>
                                <Text style={[styles.value, { color: item.status == 'có mặt' ? 'green' : 'red' }]}>{item.status}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Lý do:</Text>
                                <Text style={[styles.value, { color: 'black' }]}>{item.reason}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'gray'
    },
    calendarIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    attendanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    attendanceInfo: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-start',
        padding: 5,
    },
    label: {
        fontSize: 14,
        color: 'black',
        marginRight: 10,

    },
    value: {
        fontSize: 14,
        color: '#007AFF',
    },
    attendanceStatus: {
        flex: 1,
        alignItems: 'flex-end',
    },
    attendanceStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2ECC71',
    },
});
