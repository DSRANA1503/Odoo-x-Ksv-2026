import { parse } from "json2csv";

export const downloadCsv = (res: any, fileName: string, fields: string[], data: any[]) => {
  try {
    const csv = parse(data, { fields });
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error generating CSV' });
  }
};
