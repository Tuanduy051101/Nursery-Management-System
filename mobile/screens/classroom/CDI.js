import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function DevelopmentScreen({ route }) {
    const { cdi } = route.params;
    const [selectedMonth, setSelectedMonth] = useState('');
    const [childDevelopment, setChildDevelopment] = useState(null);

    useEffect(() => {
        if (cdi) {
            console.log(cdi.filter(i => i.month.name == selectedMonth));
            setChildDevelopment(cdi.filter(i => i.month.name == selectedMonth)[0]);
        }
    }, [cdi, selectedMonth]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Nhập tháng</Text>

            <TextInput
                style={styles.input}
                placeholder="Nhập tháng (MM)"
                value={selectedMonth}
                onChangeText={text => setSelectedMonth(text)}
            />
            <Text style={styles.header}>Kết quả</Text>

            {childDevelopment && (
                <View style={styles.developmentDetails}>
                    <Text style={styles.developmentTitle}>Chỉ số phát triển trẻ tháng {selectedMonth}</Text>
                    <View style={styles.developmentInfoContainer}>
                        <Text style={styles.developmentLabel}>Chiều cao:</Text>
                        <Text style={styles.developmentInfo}>{childDevelopment.height} cm</Text>
                    </View>
                    <View style={styles.developmentInfoContainer}>
                        <Text style={styles.developmentLabel}>Cân nặng:</Text>
                        <Text style={styles.developmentInfo}>{childDevelopment.weight} kg</Text>
                    </View>
                    <View style={styles.developmentInfoContainer}>
                        <Text style={styles.developmentLabel}>Sức khỏe:</Text>
                        <Text style={styles.developmentInfo}>{childDevelopment.health}</Text>
                    </View>
                    <View style={styles.developmentInfoContainer}>
                        <Text style={styles.developmentLabel}>Số bông hồng:</Text>
                        <Text style={styles.developmentInfo}>{childDevelopment.roses}</Text>
                    </View>
                    <View style={styles.developmentInfoContainer}>
                        <Text style={styles.developmentLabel}>Ghi chú:</Text>
                        <Text style={styles.developmentInfo}>{childDevelopment.note}</Text>
                    </View>
                </View>
            )}
        </ScrollView>
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
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    developmentDetails: {
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    developmentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    developmentInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    developmentLabel: {
        fontSize: 14,
        color: 'black',
    },
    developmentInfo: {
        fontSize: 16,
    },
});
