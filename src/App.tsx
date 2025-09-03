import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { downloadIcs } from './Ics';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/esm/Badge';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Stack from 'react-bootstrap/esm/Stack';


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
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="h3 mb-3 text-center">Shift calendar exporter</h1>
          <Card className="shadow-sm">
            <Card.Body>

              <Form>
                <Form.Group className="mb-3" controlId="subject">
                  <Form.Label>件名</Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="アルバイト"
                  />
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3" controlId="startTime">
                    <Form.Label>開始時間</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={handleStartTimeChange}
                    />
                  </Col>
                  <Col md={6} className="mb-3" controlId="endTime">
                    <Form.Label>終了時間</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                    />
                  </Col>
                </Row>

                <div className="mb-3">
                  <Badge bg="secondary">
                    継続時間: {getDuration(startTime, endTime)}
                  </Badge>
                </div>

                <h2 className="h5 mt-3 mb-2">日付を選択してください:</h2>
                <div className="border rounded p-2 mb-3">
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
                </div>

                <Card className="mb-3">
                  <Card.Header className="py-2">選択された日付</Card.Header>
                  <ListGroup variant="flush">
                    {sortedDates.length > 0 ? (
                      sortedDates.map((date) => (
                        <ListGroup.Item key={date.toISOString()} className="d-flex justify-content-between align-items-center">
                          <span>
                            {date.toLocaleDateString("ja-JP")} {startTime} - {endTime}
                          </span>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>選択された日付はありません</ListGroup.Item>
                    )}
                  </ListGroup><Card.Footer>
                    <Button variant="outline-secondary" size="sm" onClick={resetSelectedDates}>
                      リセット
                    </Button>
                  </Card.Footer>
                </Card>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                  <Button
                    variant="primary"
                    disabled={selectedDates.length === 0}
                    onClick={() =>
                      downloadIcs(
                        subject,
                        startTime,
                        endTime,
                        sortedDates,
                        `shifts_${(subject || "シフト").trim()}.ics`
                      )
                    }
                  >
                    ICS形式でダウンロード
                  </Button>
                </Stack>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center small text-muted">
              <div>
                Shift calendar exporter by {" "}
                <a href="https://github.com/Quesys-tech" target="_blank" rel="noreferrer">
                  Queue-sys
                </a>
              </div>
              <div>
                <a href="https://github.com/Quesys-tech/shift-exporter" target="_blank" rel="noreferrer">
                  Repository
                </a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      {/* style for selected dates */}
      <style>{`
      .selected-date {
      background: var(--bs-primary) !important;
      color: #fff !important;
      border-radius: 50% !important;
      }
      `}</style>
    </Container>
  );
};

export default App;
