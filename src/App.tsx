import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const App: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

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

  return (
    <div>
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
          {selectedDates.map((date) => (
            <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
