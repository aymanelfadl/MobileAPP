import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddSpendModal = ({ visible, employee, onClose }) => {
   
    const [spends, setSpends] = useState('');

    const handleSpendAmount = async () => {
        try {
            const employeeDoc = await firestore().collection('itemsCollection').doc(employee.id).get();
            const currentSpends = employeeDoc.data().spends ;
            const totalSpends = parseFloat(spends) + currentSpends;
            
            await firestore().collection('itemsCollection').doc(employee.id).update({
                spends: totalSpends,
                timestamp: new Date(),
            });
    
            const logData = {
                employeeId: employee.id,
                operation: `Employee ${employee.description} spends updated`,
                timestamp: new Date(),
            };
            await firestore().collection('changeLogs').add(logData);

            setSpends("");
            onClose();
        } catch (error) {
            console.error('Error updating spends:', error);
        }
    }
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Add Spends</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter spend amount"
                        placeholderTextColor="black"
                        keyboardType="numeric"
                        value={spends}
                        onChangeText={(text) => {
                        if (/^-?\d*\.?\d*$/.test(text)) { 
                            setSpends(text);
                        }}}
                    />
                    <TouchableOpacity style={[styles.btn, styles.AddspendBtn]} onPress={handleSpendAmount}>
                        <Text style={styles.btnText}>Add Spends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.closeButton]} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change this to transparent
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 10,
        elevation: 5,
        width: '80%'
    },
    title: {
        fontSize: 25,
        color: "#000",
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#262626',
        backgroundColor: "#FFF",
        borderRadius: 15,
        color: "#000",
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    btn: {
        backgroundColor: "#262626",
        padding: 8,
        borderRadius: 100,
        marginBottom: 15,
    },
    btnText: {
        color: "#fff",
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: "#ff0000",
        padding: 8,
        borderRadius: 100,
        marginBottom: -10,
    },
    closeButtonText: {
        color: "#fff",
        textAlign: "center",
    },
    AddspendBtn: {
        backgroundColor: "#0066cc",
        padding: 10,
        marginBottom: 15,
    },
});

export default AddSpendModal;
