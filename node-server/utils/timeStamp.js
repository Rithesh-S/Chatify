function timeStampGenerator() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));
    const timestamp = istTime.getFullYear() + '-' +
                      ('0' + (istTime.getMonth() + 1)).slice(-2) + '-' +
                      ('0' + istTime.getDate()).slice(-2) + ' ' +
                      ('0' + istTime.getHours()).slice(-2) + ':' +
                      ('0' + istTime.getMinutes()).slice(-2) + ':' +
                      ('0' + istTime.getSeconds()).slice(-2);
    
    return timestamp;
}

module.exports = {
    timeStampGenerator
};
