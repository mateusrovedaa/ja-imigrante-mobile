import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

export default function UserList({ navigation }) {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        console.log(API_URL);
        try {
            setRefreshing(true); // Indica que a atualização está em andamento
            const response = await fetch(`http://${API_URL}/usuarios`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        } finally {
            setRefreshing(false); // Finaliza a atualização
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://${API_URL}/usuarios/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                fetchData(); // Recarrega a lista após a exclusão
            } else {
                throw new Error('Error deleting user');
            }
        } catch (error) {
            console.error(`Error deleting user: ${error}`);
            Alert.alert('Error', 'Failed to delete user');
        }
    };

    const navigateToEdit = (userId) => {
        // Navega para a tela de edição passando o ID do usuário como parâmetro
        navigation.navigate('UserEdit', { userId });
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.itemContent}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigateToEdit(item.id)}
                    style={styles.editButton}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => deleteUser(item.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing} // Indica se está em modo de atualização
                onRefresh={fetchData} // Chama fetchData ao puxar para baixo
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#f0f0f0',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
    },
    itemContent: {
        flexDirection: 'column',
        flex: 1, // Adicionado para ocupar o espaço restante
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666666',
    },
    buttonContainer: {
        flexDirection: 'row', // Adicionado para alinhar os botões horizontalmente
    },
    editButton: {
        backgroundColor: 'blue',
        borderRadius: 4,
        padding: 6,
        marginRight: 10,
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 4,
        padding: 6,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingTop: 10,
    },
});
