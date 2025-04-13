const escapeCsv = (str: string) => {
    if (str.includes('"')) {
        str = str.replace(/"/g, '""');
    }
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        str = `"${str}"`;
    }
    return str;
}

export const generateCsv = (subject: string, startTime: string, endTime: string, dates: Date[]) => {
    const subject_escaped = escapeCsv(subject);
    const header = 'Subject,Start Date,Start Time,End Date,End Time\n';
    const rows = dates.map((date) => {
        const formattedDate = date.toLocaleDateString('ja-JP');
        return `${subject_escaped},${formattedDate},${startTime},${formattedDate},${endTime}`;
    });
    return header + rows.join('\n');
}