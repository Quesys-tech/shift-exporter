import { generateCsv } from '../src/Csv';

test('CSV generation', () => {
    const subject = 'Test Subject';
    const startTime = '09:00';
    const endTime = '17:00';
    const dates = [new Date('2023-10-01'), new Date('2023-10-02')];

    const expectedCsv = `Subject,Start Date,Start Time,End Date,End Time
Test Subject,2023/10/1,09:00,2023/10/1,17:00
Test Subject,2023/10/2,09:00,2023/10/2,17:00`;
    const generatedCsv = generateCsv(subject, startTime, endTime, dates);
    expect(generatedCsv).toBe(expectedCsv);
});
test('CSV generation with special characters', () => {
    const subject = 'Test, Subject "with" special characters';
    const startTime = '09:00';
    const endTime = '17:00';
    const dates = [new Date('2023-10-01'), new Date('2023-10-02')];

    const expectedCsv = `Subject,Start Date,Start Time,End Date,End Time
"Test, Subject ""with"" special characters",2023/10/1,09:00,2023/10/1,17:00
"Test, Subject ""with"" special characters",2023/10/2,09:00,2023/10/2,17:00`;
    const generatedCsv = generateCsv(subject, startTime, endTime, dates);
    expect(generatedCsv).toBe(expectedCsv);
});
