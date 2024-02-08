const express = require('express');
const query = require('samp-query');
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/lex/samp', function (req, res) {
    const ip = req.query.ip;
    const port = req.query.port;
    const Serverip = `${ip}:${port}`;
    var options = {
        host: ip,
        port: port
    };

    query(options, function (error, response) {
        if (error) {
            console.log(error);
            res.status(404).json({ 'error': 'Something Went Wrong. Please Check IP and Port Correctly or Try Again Later' });
        } else {
            function createStrList(arr) {
                const indexLen = Math.floor(Math.log10(arr.length - 1)) + 1;
                let nameLen = 0;

                for (const item of arr) {
                    if (item.name.length > nameLen) nameLen = item.name.length;
                }

                return arr.map((x, i) => [`${i}${" ".repeat(indexLen - `${i}`.length)} ${x.name}${" ".repeat(nameLen - x.name.length)} ${x.score}  ${x.ping}`]).slice(0, 16).join("\n");
            }

            let Players = (createStrList(response['players']));
            res.json({
                'response': {
                    'serverip': Serverip,
                    'address': response["address"],
                    'serverping': response["ping"],
                    'hostname': response["hostname"],
                    'gamemode': response["gamemode"],
                    'language': response["mapname"],
                    'passworded': response["passworded"],
                    'maxplayers': response["maxplayers"],
                    'isPlayerOnline': response["online"],
                    'rule': {
                        'lagcomp': response["rules"].lagcomp,
                        'mapname': response["rules"].mapname,
                        'version': response["rules"].version,
                        'weather': response["rules"].weather,
                        'weburl': response["rules"].weburl,
                        'worldtime': response["rules"].worldtime
                    },
                    'isPlayersIngame': Players || 'More than 100 players on server'
                }
            });
        }
    });
});

app.get('*', function (req, res) {
    res.status(404).json({ '®DEV.LEX': 'Welcome to Lex Bot API' });
});

const PORT = process.env.PORT || 7006;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);