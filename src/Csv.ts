const escapeCsv = (str: string) => {
    if (str.includes('"')) {
        str = str.replace(/"/g, '""');
    }
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        str = `"${str}"`;
    }
    return str;
}

const generateCsv = (subject: string, startTime: string, endTime: string, dates: Date[]) => {
    const subject_escaped = escapeCsv(subject);
    const header = 'Subject,Start Date,Start Time,End Date,End Time\n';
    const rows = dates.map((date) => {
        const formattedDate = date.toLocaleDateString('ja-JP');
        return `${subject_escaped},${formattedDate},${startTime},${formattedDate},${endTime}`;
    });
    return header + rows.join('\n');
}

export const downloadCsv = (subject: string, startTime: string, endTime: string, dates: Date[], filename: string) => {
    const csv = generateCsv(subject, startTime, endTime, dates);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}