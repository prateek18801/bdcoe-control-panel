const jsontocsv = (data, config) => {
    const fields = `"${config.map(row => row.field).toString().replace(/,/g, '","')}"`;

    const escaped_csv = escapecomma(data).map(record => {
        return config.map(row => {
            return record[row.key] ? record[row.key].toString() : '';
        }).toString();
    });
    
    const csv_content = restorecomma(`"${escaped_csv.join('"\n"').replace(/,/g, '","')}"`);
    return [fields, csv_content].join('\n');
}

const escapecomma = (data) => {
    data.forEach(record => {
        Object.keys(record).forEach(key => {
            record[key] = record[key].toString().replaceAll(/,/g, '~!');
        });
    });
    return data;
}

const restorecomma = data => data.replaceAll(/~!/g, ',');

module.exports = jsontocsv;