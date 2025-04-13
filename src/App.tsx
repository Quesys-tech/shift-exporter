import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const generateCsv = (subject: string, startTime: string, endTime: string, dates: Date[]) => {
  const header = 'Subject,Start Date,Start Time,End Date,End Time\n';
  const rows = dates.map((date) => {
    const formattedDate = date.toLocaleDateString('ja-JP');
    return `${subject},${formattedDate},${startTime},${formattedDate},${endTime}`;
  });
  return header + rows.join('\n');
}
const downloadCsv = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const getDuration = (startTime: string, endTime: string) => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Error: 時間の形式が正しくありません';
  }
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  if (duration < 0) {
    return 'Error: 終了時間が開始時間より早いです';
  } else if (duration == 0) {
    return 'Error: 終了時間と開始時間が同じです';
  } else {
    return `${Math.floor(duration / 60)}時間 ${duration % 60}分`;
  }
}

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
      <p>
        継続時間: {getDuration(startTime, endTime)}
      </p>
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
            <li key={date.toISOString()}>{date.toLocaleDateString()} {startTime}-{endTime}</li>
          ))}
          {sortedDates.length === 0 && <li>選択された日付はありません</li>}
        </ul>
        <button onClick={resetSelectedDates}>リセット</button>
      </div>
      {selectedDates.length > 0 && (
        <div>
          <button
            onClick={() => {
              const csv = generateCsv(subject, startTime, endTime, sortedDates);
              downloadCsv(csv, 'shifts' + subject + '.csv');
            }}
          >CSV形式でダウンロード</button>
        </div>
      )}
      <footer>
        <p>Shift calendar exporter by <a href="https://github.com/Quesys-tech">Queue-sys</a></p>
        <p><a href="https://github.com/Quesys-tech/shift-exporter">Repository</a></p>
      </footer>
    </div>
  );
};

export default App;
