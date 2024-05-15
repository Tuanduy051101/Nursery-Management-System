import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { formatDate, } from '../../assets/js/date-time';
import { formatCurrencyVND } from '../../assets/js/money';
import { capitalizeFirstLetter } from '../../assets/js/date-time';

export default function TuitionScreen({ route }) {
    const { tuition, yearId, gradeId } = route.params;
    const [collectionRates, setCollectionRate] = useState(null);

    useEffect(() => {
        // Sử dụng useEffect để gọi dữ liệu từ API khi mà owner thay đổi
        const apiUrl = `http://localhost:4001/api/collectionRates/`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setCollectionRate(data.filter(i => i.grade._id == gradeId && i.schoolYear._id == yearId))
            })
            .catch((error) => console.error(error));
    }, [yearId, gradeId]);

    return (
        <ScrollView style={styles.container}>
            {/* <Text style={styles.header}>Thông Tin Học Phí</Text> */}
            <View style={styles.tuitionDetails}>
                <View style={styles.tuitionInfoContainer}>
                    <Text style={styles.tuitionLabel}>Tổng Số Tiền:</Text>
                    <Text style={styles.tuitionInfo}>{formatCurrencyVND(tuition[0].total)}</Text>
                </View>
                <View style={styles.tuitionInfoContainer}>
                    <Text style={styles.tuitionLabel}>Ngày Bắt Đầu Thu:</Text>
                    <Text style={styles.tuitionInfo}>{formatDate(tuition[0].dateStart)}</Text>
                </View>
                <View style={styles.tuitionInfoContainer}>
                    <Text style={styles.tuitionLabel}>Ngày Kết Thúc Thu:</Text>
                    <Text style={styles.tuitionInfo}>{formatDate(tuition[0].dateEnd)}</Text>
                </View>
                <View style={styles.tuitionInfoContainer}>
                    <Text style={styles.tuitionLabel}>Ngày Đóng:</Text>
                    <Text style={styles.tuitionInfo}>{tuition[0].datePerForm != 'chưa thanh toán' ? formatDate(tuition[0].datePerForm) : 'Chưa thanh toán'}</Text>
                </View>
                <View style={styles.tuitionInfoContainer}>
                    <Text style={styles.tuitionLabel}>Trạng Thái:</Text>
                    <Text style={styles.tuitionInfo}>{tuition[0].status == 'true' ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
                </View>
            </View>
            <View style={styles.feeList}>
                <Text style={styles.feeListTitle}>Danh Sách Khoản Thu</Text>
                {collectionRates && collectionRates.map((fee, index) => (
                    <View key={index} style={styles.feeItem}>
                        <Text style={styles.feeName}>{capitalizeFirstLetter(fee.tuitionFees.name)}</Text>
                        <Text style={styles.feeAmount}>{formatCurrencyVND(fee.money)}</Text>
                    </View>
                ))}
            </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black',
        textAlign: 'center',
    },
    tuitionDetails: {
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    tuitionInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tuitionLabel: {
        fontSize: 14,
        color: 'black',
    },
    tuitionInfo: {
        fontSize: 14,
    },
    feeList: {
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    feeListTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    feeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    feeName: {
        flex: 1,
        fontSize: 16,
    },
    feeAmount: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 30,
    },
});
