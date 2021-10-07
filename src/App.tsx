import React, {useCallback, useRef, useState} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {addDays, differenceInDays, format, isDate} from 'date-fns';

import DateTimePicker from '@react-native-community/datetimepicker';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';

import Input from './components/Input';
import NumericInput from './components/NumericInput';

import {Container, Title} from './styles';

const App: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const dateRef = useRef<TextInput>(null);
  const today = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [dateValue, setDateValue] = useState<string>(
    format(today, 'dd/MM/yyyy'),
  );
  const [mumpsDateValue, setMumpsDateValue] = useState<string>(
    differenceInDays(today, new Date(1840, 11, 31, 0, 0)).toString(),
  );

  const mumpsToDate = (mumpsDateFormat: string): string => {
    const dateFormat = format(
      addDays(new Date(1840, 11, 31, 0, 0), Number(mumpsDateFormat)),
      'dd/MM/yyyy',
    );

    return dateFormat;
  };

  const dateToMumps = (dateFormat: Date): string => {
    const mumpsFormat = differenceInDays(
      dateFormat,
      new Date(1840, 11, 31, 0, 0),
    );

    return mumpsFormat.toString();
  };

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (date) {
        setSelectedDate(date);
        setDateValue(format(date, 'dd/MM/yyyy'));

        const days = dateToMumps(date);

        setMumpsDateValue(days);
      } else if (mumpsDateValue.length === 0) {
        setMumpsDateValue('');
      }
    },
    [mumpsDateValue],
  );

  const checkMumpsMaxDate = (mumpsDate: string): string => {
    if (Number(mumpsDate) > 2980013) {
      return '2980013';
    }
    return mumpsDate;
  };

  const handleMumpsDateChanged = useCallback((mumpsDate: string) => {
    if (mumpsDate.length > 0 && Number(mumpsDate) >= 0) {
      const checkedMumsDate = checkMumpsMaxDate(mumpsDate);

      setMumpsDateValue(checkedMumsDate);

      const date = mumpsToDate(checkedMumsDate);

      setDateValue(date);
    } else {
      setDateValue('');
    }
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#312e38"
        translucent
      />

      <View style={{flex: 1, backgroundColor: '#312e38'}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <GestureHandlerRootView style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{flex: 1}}>
              <Container>
                <View>
                  <Title>MUMPS Date Converter</Title>
                </View>

                <Form ref={formRef} onSubmit={() => {}}>
                  <Input
                    ref={dateRef}
                    icon="calendar"
                    name="date"
                    placeholder="Date (31/12/1840 to 31/12/9999)"
                    returnKeyType="send"
                    defaultValue={Date()}
                    value={dateValue}
                    showSoftInputOnFocus={false}
                    onTouchStart={handleToggleDatePicker}
                  />

                  {showDatePicker && (
                    <DateTimePicker
                      {...(Platform.OS === 'ios' && {textColor: '#f4ede8'})}
                      mode="date"
                      display={
                        Platform.OS === 'android' ? 'calendar' : 'spinner'
                      }
                      onChange={handleDateChanged}
                      value={selectedDate}
                      minimumDate={new Date(1840, 11, 31)}
                      maximumDate={new Date(9999, 11, 31)}
                    />
                  )}

                  <NumericInput
                    name="mumpsInternalDate"
                    icon="hash"
                    placeholder="Number of days (0 to 2980013)"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    returnKeyType="send"
                    value={mumpsDateValue}
                    onChangeText={handleMumpsDateChanged}
                    mask="[0000000]"
                  />
                </Form>
              </Container>
            </ScrollView>
          </GestureHandlerRootView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default App;
