import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const App: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };
  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;

    const dateExists = selectedDates.some(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );

    if (dateExists) {
      setSelectedDates(selectedDates.filter(
        (selectedDate) => selectedDate.getTime() !== date.getTime()
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };
  const resetSelectedDates = () => {
    setSelectedDates([]);
  };
  const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());

  return (
    <div>
      <label>
        件名:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <label>
        開始時間:
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </label>
      <label>
        終了時間:
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </label>
      <h2>日付を選択してください:</h2>
      <DatePicker
        inline
        selected={null}
        onChange={handleDateClick}
        highlightDates={selectedDates}
        dayClassName={(date) =>
          selectedDates.some(
            (selectedDate) => selectedDate.getTime() === date.getTime()
          )
            ? 'selected-date'
            : ''
        }
      />
      <div>
        <h3>選択された日付:</h3>
        <ul>
          {sortedDates.map((date) => (
            <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
          ))}
        </ul>
        <button onClick={resetSelectedDates}>リセット</button>
      </div>
    </div>
  );
};

export default App;
