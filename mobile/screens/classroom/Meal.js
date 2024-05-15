import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function FoodList({ route }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh Sách Món Ăn</Text>
            <FlatList
                data={foodData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.foodItem}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <Text style={styles.foodFunction}>{item.function}</Text>
                        <Text style={styles.foodIngredientCount}>
                            Số lượng nguyên liệu: {item.ingredients.length}
                        </Text>
                    </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    foodItem: {
        flexDirection: 'column',
        padding: 16,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    foodFunction: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 8,
    },
    foodIngredientCount: {
        fontSize: 16,
        color: 'gray',
    },
});
