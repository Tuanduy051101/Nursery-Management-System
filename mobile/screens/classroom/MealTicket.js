import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatDate } from '../../assets/js/date-time';

export default function MealTicketcreen({ route }) {
    const { mealTicket } = route.params;
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredMeals, setFilteredMeals] = useState([]);

    useEffect(() => {
        if (mealTicket) {
            const formattedMeals = mealTicket.map(i => ({
                ...i,
                formattedDate: formatDate(i.meal.date),
                sessionName: `${i.meal.session.name} (${i.meal.session.startTime} - ${i.meal.session.endTime})`,
            }));
            setFilteredMeals(formattedMeals.filter(i => i.meal.date == selectedDate));
        }
    }, [mealTicket, selectedDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nhập vào ngày</Text>
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
                data={filteredMeals}
                keyExtractor={meal => meal._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.mealItem}>
                        <View style={styles.mealDetails}>
                            <Text style={styles.mealPart}>Ngày: {item.formattedDate}</Text>
                            <Text style={styles.mealPart}>Buổi: {item.sessionName}</Text>
                            {/* <Text style={styles.mealPart}>Khẩu Phần Ăn: {item.food}</Text> */}
                            <Text style={styles.mealPart}>Đánh Giá: {item.evaluate}</Text>
                            <Text style={styles.mealPart}>Nhận Xét: {item.remark}</Text>
                            <Text style={styles.mealPart}>Ghi Chú: {item.note}</Text>
                        </View>
                        <FontAwesome name="chevron-right" size={24} color="#007AFF" style={styles.chevronIcon} />
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 16,
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
    },
    calendarIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: 'black',
    },
    mealItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    mealInfo: {
        flex: 1,
    },
    mealDetails: {
        flex: 1,
    },
    mealDate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    mealSession: {
        fontSize: 16,
        color: 'black',
    },
    mealPart: {
        fontSize: 16,
        color: 'black',
        marginBottom: 8,
    },
    chevronIcon: {
        marginLeft: 8,
    },
});

