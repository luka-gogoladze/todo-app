import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryButton = ({ icon, title, count, color, iconComponent: Icon, iconColor }) => (
    <TouchableOpacity style={styles.touchableCard}>
        <View style={[styles.cardContent, { backgroundColor: color }]}>
            <Icon name={icon} size={24} color={iconColor} />
            <View style={styles.cardText}>
                <Text style={styles.cardCount}>{count}</Text>
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function Index() {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Tbilisi' });
    const insets = useSafeAreaInsets();

    const [categories, setCategories] = React.useState([
        { id: '1', title: 'Health', icon: 'heart', color: 'rgba(121, 144, 248, 0.1)', iconColor: 'rgba(121, 144, 248,1)', iconComponent: Ionicons },
        { id: '2', title: 'Work', icon: 'briefcase', color: 'rgba(70, 207, 139, 0.1)', iconColor: 'rgba(70, 207, 139,1)', iconComponent: Ionicons },
        { id: '3', title: 'Mental Health', icon: 'psychology', color: 'rgba(200, 100, 255, 0.1)', iconColor: 'rgba(200, 100, 255,1)', iconComponent: MaterialIcons },
        { id: '4', title: 'Others', icon: 'folder', color: 'rgba(150, 150, 150, 0.1)', iconColor: 'rgba(150, 150, 150,1)', iconComponent: MaterialIcons }
    ]);

    const [todos, setTodos] = React.useState([
        { id: '1', text: 'Drink 8 glasses of water', category: 'Health' },
        { id: '2', text: 'Finish project proposal', category: 'Work' },
        { id: '3', text: 'Meditate for 10 minutes', category: 'Mental Health' },
    ]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [newTodoText, setNewTodoText] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('Others');

    const handleAddTodo = () => {
        if (newTodoText.trim() === '') {
            alert('Please enter a to-do item.');
            return;
        }
        const newTodo = {
            id: String(Date.now()),
            text: newTodoText,
            category: selectedCategory,
        };
        setTodos([...todos, newTodo]);
        setNewTodoText('');
        setModalVisible(false);
    };

    const handleDeleteTodo = (idToDelete) => {
        setTodos(todos.filter(todo => todo.id !== idToDelete));
    };

    const openAddModal = () => {
        setSelectedCategory('Others'); // Reset to default category when opening modal
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView style={styles.scrollView}>
                <View style={[styles.container, { paddingTop: insets.top }]}>
                    <Text style={styles.headerText}>Today <Text style={styles.dateText}>{dateString}</Text></Text>
                    <View style={styles.gridContainer}>
                        {categories.map(cat => {
                            const count = todos.filter(todo => todo.category === cat.title).length;
                            return (
                                <CategoryButton
                                    key={cat.id}
                                    title={cat.title}
                                    icon={cat.icon}
                                    color={cat.color}
                                    iconColor={cat.iconColor}
                                    iconComponent={cat.iconComponent}
                                    count={count}
                                />
                            );
                        })}
                    </View>
                </View>

                <View style={styles.todocontainer}>
                    {todos.map(todo => (
                        <TouchableOpacity key={todo.id} style={styles.listItem}>
                            <View style={styles.taskRow}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={false}
                                    onValueChange={() => handleDeleteTodo(todo.id)}
                                    color={'#393433'}
                                />
                                <Text style={styles.taskText}>{todo.text}</Text>
                                <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                                    <Ionicons name="trash" size={24} color="#ff3b30" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{todo.category.toUpperCase()}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={28} color="#555" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>New To-Do</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Go for a run"
                            value={newTodoText}
                            onChangeText={setNewTodoText}
                        />
                        <View style={styles.categorySelectorContainer}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory === cat.title && styles.categoryButtonSelected
                                    ]}
                                    onPress={() => setSelectedCategory(cat.title)}
                                >
                                    <Text style={[
                                        styles.categoryButtonText,
                                        selectedCategory === cat.title && styles.categoryButtonTextSelected
                                    ]}>{cat.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddTodo}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <TouchableOpacity style={styles.fab} onPress={openAddModal}>
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const CHECKBOX_SIZE = 24;
const ROW_GAP = 15;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        marginTop: 10,
    },
    dateText: {
        color: '#888',
        fontWeight: '500',
        fontFamily: 'Inter-Medium'
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    touchableCard: {
        width: '48%',
        marginBottom: 16,
    },
    cardContent: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: 100,
    },
    cardCount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardTitle: {
        color: 'rgba(18, 18, 18, 0.7)',
        fontFamily: 'Inter-Medium',
        fontSize: 16,
    },
    cardText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    todocontainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    listItem: {
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ROW_GAP,
    },
    checkbox: {
        width: CHECKBOX_SIZE,
        height: CHECKBOX_SIZE,
        borderRadius: 6,
    },
    taskText: {
        fontSize: 16,
        color: '#121212',
        flex: 1,
    },
    tagContainer: {
        backgroundColor: 'rgba(121, 144, 248, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
        marginLeft: CHECKBOX_SIZE + ROW_GAP,
    },
    tagText: {
        color: '#393433',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#393433',
        justifyContent: 'center',
        alignItems: 'center',
        right: 30,
        bottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#393433',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        elevation: 2,
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    categorySelectorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        margin: 4,
    },
    categoryButtonSelected: {
        backgroundColor: '#393433',
        borderColor: '#393433',
    },
    categoryButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    categoryButtonTextSelected: {
        color: '#fff',
    }
});