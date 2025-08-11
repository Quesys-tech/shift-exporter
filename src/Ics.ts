import filenamify from "filenamify";
import { generateIcsCalendar, type IcsEvent, type IcsDateObject } from "ts-ics";

const generateIcsString = (subject: string, startTime: string, endTime: string, dates: Date[]): string => {
    const startTimeHours: number = parseInt(startTime.split(':')[0]);
    const startTimeMinutes: number = parseInt(startTime.split(':')[1]);
    const endTimeHours: number = parseInt(endTime.split(':')[0]);
    const endTimeMinutes: number = parseInt(endTime.split(':')[1]);

    const events: IcsEvent[] = dates.map(date => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const startDate = new Date(year, month, day, startTimeHours, startTimeMinutes, 0);
        const endDate = new Date(year, month, day, endTimeHours, endTimeMinutes, 0);

        const event: IcsEvent = {
            start: {
                date: startDate,
                type: 'DATE-TIME'
            } as IcsDateObject,
            end: {
                date: endDate,
                type: 'DATE-TIME'
            } as IcsDateObject,
            stamp: { date: new Date() } as IcsDateObject,
            summary: subject,
            description: subject,
            location: '',
            uid: `${subject}-${date.toISOString()}`,
        };
        return event;
    });

    return generateIcsCalendar({
        events,
        prodId: '-//Quesys Tech//Shift Exporter//EN',
        version: '2.0',
    });
}

export const downloadIcs = (subject: string, startTime: string, endTime: string, dates: Date[], filename: string) => {
    const ics = generateIcsString(subject, startTime, endTime, dates);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filenamify(filename));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}