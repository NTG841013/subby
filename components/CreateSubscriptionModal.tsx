import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { icons } from '@/constants/icons';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (subscription: any) => void;
}

const CATEGORIES = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: '#FF5733',
  'AI Tools': '#33FF57',
  'Developer Tools': '#3357FF',
  Design: '#F333FF',
  Productivity: '#FF33A1',
  Cloud: '#33FFF3',
  Music: '#F3FF33',
  Other: '#888888',
};

const CreateSubscriptionModal = ({
  isVisible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [category, setCategory] = useState('Entertainment');

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Entertainment');
  };

  const isFormValid = name.trim() !== '' && !isNaN(parseFloat(price)) && parseFloat(price) > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const priceValue = parseFloat(price);
    const now = dayjs();
    const renewalDate = frequency === 'Monthly' 
      ? now.add(1, 'month').toISOString() 
      : now.add(1, 'year').toISOString();

    const newSubscription = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: priceValue,
      frequency,
      category,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category] || '#888888',
    };

    onSubmit(newSubscription);
    handleClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="modal-overlay flex-1 justify-end">
        <Pressable className="flex-1" onPress={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="modal-container"
        >
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable onPress={handleClose} className="modal-close">
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <ScrollView className="modal-body" showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-sans-medium text-muted-foreground mb-2">Name</Text>
              <TextInput
                className="auth-input"
                value={name}
                onChangeText={setName}
                placeholder="Subscription name"
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-sans-medium text-muted-foreground mb-2">Price</Text>
              <TextInput
                className="auth-input"
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="rgba(0,0,0,0.3)"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-sans-medium text-muted-foreground mb-2">Frequency</Text>
              <View className="flex-row bg-secondary/50 rounded-2xl p-1">
                <Pressable
                  onPress={() => setFrequency('Monthly')}
                  className={clsx(
                    'picker-option flex-1',
                    frequency === 'Monthly' && 'picker-option-active'
                  )}
                >
                  <Text
                    className={clsx(
                      'picker-option-text',
                      frequency === 'Monthly' && 'picker-option-text-active'
                    )}
                  >
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFrequency('Yearly')}
                  className={clsx(
                    'picker-option flex-1',
                    frequency === 'Yearly' && 'picker-option-active'
                  )}
                >
                  <Text
                    className={clsx(
                      'picker-option-text',
                      frequency === 'Yearly' && 'picker-option-text-active'
                    )}
                  >
                    Yearly
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-sans-medium text-muted-foreground mb-2">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={clsx(
                      'category-chip',
                      category === cat && 'category-chip-active'
                    )}
                  >
                    <Text
                      className={clsx(
                        'category-chip-text',
                        category === cat && 'category-chip-text-active'
                      )}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!isFormValid}
              className={clsx(
                'auth-button mb-6',
                !isFormValid && 'auth-button-disabled'
              )}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
