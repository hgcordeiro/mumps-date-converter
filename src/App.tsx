import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  addDays,
  addSeconds,
  differenceInDays,
  differenceInSeconds,
  format,
  getDate,
  getMonth,
  getYear,
} from 'date-fns';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import Input from './components/Input';
import NumericInput from './components/NumericInput';

import { Container, Title } from './styles';

const radioButtonsData: RadioButtonProps[] = [
  {
    id: '1', // acts as primary key, should be unique and non-empty string
    label: '$HOROLOG',
    value: '0',
    selected: true,
  },
  {
    id: '2',
    label: '$ZZPH',
    value: '1',
    selected: false,
  },
];

const App: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const today = new Date();
  const day = getDate(today);
  const month = getMonth(today);
  const year = getYear(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(today);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isMumpsDateFocused, setIsMumpsDateFocused] = useState(false);

  const [radioButtons, setRadioButtons] =
    useState<RadioButtonProps[]>(radioButtonsData);

  const [dateValue, setDateValue] = useState<string>(
    format(today, 'dd/MM/yyyy'),
  );

  const [timeValue, setTimeValue] = useState<string>(format(today, 'HH:mm:ss'));

  const [mumpsDateValue, setMumpsDateValue] = useState<string>(
    differenceInDays(today, new Date(1840, 11, 31, 0, 0, 0)).toString(),
  );

  const [mumpsTimeValue, setMumpsTimeValue] = useState<string>(
    differenceInSeconds(today, new Date(year, month, day, 0, 0, 0)).toString(),
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

  const mumpsToTime = (mumpsTimeFormat: string): string => {
    const timeFormat = format(
      addSeconds(new Date(1840, 11, 31, 0, 0), Number(mumpsTimeFormat)),
      'HH:mm:ss',
    );

    return timeFormat;
  };

  const timeToMumps = (timeFormat: Date): string => {
    const timeFormatDay = getDate(timeFormat);
    const timeFormatMonth = getMonth(timeFormat);
    const timeFormatYear = getYear(timeFormat);
    const mumpsTimeFormat = differenceInSeconds(
      timeFormat,
      new Date(timeFormatYear, timeFormatMonth, timeFormatDay, 0, 0, 0),
    );

    return mumpsTimeFormat.toString();
  };

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (date) {
        setSelectedDate(date);
        setDateValue(format(date, 'dd/MM/yyyy'));

        const days = String(
          Number(dateToMumps(date)) + Number(radioButtons[1].selected),
        );

        setMumpsDateValue(days);
      } else if (mumpsDateValue.length === 0) {
        setMumpsDateValue('');
      }
    },
    [mumpsDateValue.length, radioButtons],
  );

  const checkMumpsMaxDate = (mumpsDate: string): string => {
    if (Number(mumpsDate) > 2980013) {
      return '2980013';
    }
    return mumpsDate;
  };

  const handleMumpsDateChanged = useCallback(
    (mumpsDate: string) => {
      if (mumpsDate.length > 0 && Number(mumpsDate) >= 0) {
        const checkedMumpsDate = checkMumpsMaxDate(mumpsDate);

        setMumpsDateValue(checkedMumpsDate);

        const date = mumpsToDate(
          String(Number(checkedMumpsDate) - Number(radioButtons[1].selected)),
        );

        setDateValue(date);
      } else {
        setDateValue('');
      }
    },
    [radioButtons],
  );

  const handlePressRadioButton = useCallback(
    (radioButtonsArray: RadioButtonProps[]) => {
      setRadioButtons(radioButtonsArray);

      // if (Platform.OS === 'android') {
      //   setShowDatePicker(false);
      // }
      if (selectedDate) {
        setSelectedDate(selectedDate);
        setDateValue(format(selectedDate, 'dd/MM/yyyy'));

        const days = String(
          Number(dateToMumps(selectedDate)) + Number(radioButtons[1].selected),
        );

        setMumpsDateValue(days);
      } else if (mumpsDateValue.length === 0) {
        setMumpsDateValue('');
      }
    },
    [mumpsDateValue, radioButtons, selectedDate],
  );

  // useMemo(() => {
  //   console.log('useEffect');
  //   console.log(radioButtons[0].selected);
  //   console.log(radioButtons[1].selected);
  //   if (Platform.OS === 'android') {
  //     setShowDatePicker(false);
  //   }
  //   if (selectedDate) {
  //     setSelectedDate(selectedDate);
  //     setDateValue(format(selectedDate, 'dd/MM/yyyy'));

  //     const days = String(
  //       Number(dateToMumps(selectedDate)) + Number(radioButtons[1].selected),
  //     );

  //     setMumpsDateValue(days);
  //   } else if (mumpsDateValue.length === 0) {
  //     setMumpsDateValue('');
  //   }
  // }, [radioButtons, selectedDate]);

  const handleToggleTimePicker = useCallback(() => {
    setShowTimePicker((state) => !state);
  }, []);

  const handleTimeChanged = useCallback(
    (event: any, time: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }
      if (time) {
        setSelectedTime(time);
        setTimeValue(format(time, 'HH:mm:ss'));

        const seconds = timeToMumps(time);

        setMumpsTimeValue(seconds);
      } else if (mumpsTimeValue.length === 0) {
        setMumpsTimeValue('');
      }
    },
    [mumpsTimeValue],
  );

  const checkMumpsMaxTime = (mumpsTime: string): string => {
    if (Number(mumpsTime) > 86399) {
      return '86399';
    }
    return mumpsTime;
  };

  const handleMumpsTimeChanged = useCallback((mumpsTime: string) => {
    if (mumpsTime.length > 0 && Number(mumpsTime) >= 0) {
      const checkedMumpsTime = checkMumpsMaxTime(mumpsTime);

      setMumpsTimeValue(checkedMumpsTime);

      const time = mumpsToTime(checkedMumpsTime);

      setTimeValue(time);
    } else {
      setTimeValue('');
    }
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#312e38"
        translucent
      />

      <View style={{ flex: 1, backgroundColor: '#312e38' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flex: 1 }}
            >
              <Container>
                <View>
                  <Title>MUMPS Date Converter</Title>
                </View>

                <Form ref={formRef} onSubmit={() => {}}>
                  <RadioGroup
                    radioButtons={radioButtons}
                    onPress={handlePressRadioButton}
                    layout="row"
                  />
                  <Input
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
                      {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })}
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

                  <Input
                    icon="watch"
                    name="time"
                    placeholder="Time (00:00:00 to 23:59:59)"
                    returnKeyType="send"
                    defaultValue={Date()}
                    value={timeValue}
                    showSoftInputOnFocus={false}
                    onTouchStart={handleToggleTimePicker}
                  />

                  {showTimePicker && (
                    <DateTimePicker
                      {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })}
                      mode="time"
                      display={Platform.OS === 'android' ? 'clock' : 'spinner'}
                      onChange={handleTimeChanged}
                      value={selectedTime}
                      minimumDate={new Date(1840, 11, 31, 0, 0, 0)}
                      maximumDate={new Date(9999, 11, 31, 23, 59, 59)}
                    />
                  )}

                  <NumericInput
                    name="mumpsInternalTime"
                    icon="hash"
                    placeholder="Number of seconds (0 to 86399)"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    returnKeyType="send"
                    value={mumpsTimeValue}
                    onChangeText={handleMumpsTimeChanged}
                    mask="[00000]"
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
