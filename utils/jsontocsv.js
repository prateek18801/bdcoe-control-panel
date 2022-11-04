const jsontocsv = (data, config) => {
    let escaped_csv = escapecomma(data).map(row => Object.values(row));
    escaped_csv.unshift(Object.keys(data[0]));
    const CSV = restorecomma(`"${escaped_csv.join('"\n"').replace(/,/g, '","')}"`);
    return CSV;
}

const escapecomma = (data) => {
    return data.map(row => {
        return Object.keys(row).map(key => {
            return row[key] = row[key].toString().replace(/,/g, '~!');
        });
    });
}

const restorecomma = (data) => {
    return data.replace(/~!/g, ',');
}

module.exports = jsontocsv;