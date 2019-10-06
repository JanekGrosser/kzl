const env = 'dev';


const dev = {

}

const test = {

}

const prod = {

}


const config = {dev, test, prod};
module.exports = config[env];