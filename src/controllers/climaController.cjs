const puppeteer = require('puppeteer');

async function start(cidade){
    console.log('Buscando dados de clima');
    clima = await getClima(cidade);
    console.log(clima);
    return clima;
};

exports.init = async(req, res)=>{
    let cidade = req.query.cidade;

    if(!cidade) return res.status(400).send({ message: 'Passe uma cidade como parâmetro na query string (ex: ?cidade=paris)' });
    
    await start(cidade);
    return res.json(clima)
};

async function getClima(cidade){

    try {

        const isWindows = process.platform === 'win32';

        let browser = await puppeteer.launch({
            executablePath: isWindows ? undefined : '/usr/bin/chromium-browser',
            headless: isWindows ? false : true,
            // slowMo: 50,      // execução mais lenta
            // defaultViewport: null 
          });

        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR'
        });
    
        const url = `https://www.google.com/search?q=clima+${cidade}&oq=clima+&gs_lcrp=EgZjaHJvbWUqDAgAEAAYQxiABBiKBTIMCAAQABhDGIAEGIoFMhYIARAuGIMBGMcBGLEDGMkDGNEDGIAEMhAIAhAAGIMBGJIDGLEDGIAEMgYIAxBFGDkyDQgEEAAYkgMYgAQYigUyDQgFEAAYgwEYsQMYgAQyCQgGEAAYChiABDIMCAcQABgKGLEDGIAEMg0ICBAAGIMBGLEDGIAEMg0ICRAAGIMBGLEDGIAEqAIAsAIA&sourceid=chrome&ie=UTF-8`;
    
        await page.goto(url)
    
        const clima = {
            hoje:{
                cidade: await page.evaluate(()=>{
                    return document.querySelector('.eKPi4 .BBwThe').textContent;
                }),
                dia: await page.evaluate(()=>{
                    return document.querySelector('#wob_dts').textContent;
                }),
                temperatura: await page.evaluate(()=>{
                    return document.querySelector('#wob_tm').textContent;
                }),
                chuva: await page.evaluate(()=>{
                    return document.querySelector('#wob_pp').textContent;
                }),
                descricao: await page.evaluate(()=>{
                    return document.querySelector('#wob_wc img').getAttribute('alt');
                }),
                img: await page.evaluate(()=>{
                    return document.querySelector('#wob_wc img').getAttribute('src');
                }), 
            },
            semana:[],
        };
    
        for(let i = 0; i<=6; i++){
            
            obj = {
                dia: await page.evaluate((i)=>{
                    return document.querySelector(`div[data-wob-di="${i}"] .Z1VzSb`).textContent;
                },i),
                descricao: await page.evaluate((i)=>{
                    return document.querySelector(`div[data-wob-di="${i}"] .DxhUm img`).getAttribute('alt');
                },i),
                img: await page.evaluate((i)=>{
                    return document.querySelector(`div[data-wob-di="${i}"] .DxhUm img`).getAttribute('src');
                },i),
                tempMax: await page.evaluate((i)=>{
                    return document.querySelector(`div[data-wob-di="${i}"] .gNCp2e .wob_t`).textContent;
                },i),
                tempMin: await page.evaluate((i)=>{
                    return document.querySelector(`div[data-wob-di="${i}"] .QrNVmd .wob_t`).textContent;
                },i)
            };
    
            clima.semana.push(obj)
        };
        await browser.close();
        return clima

    } catch (e) {
        const errorGetClima = {
            catchError: e,
        };
        return errorGetClima;
    };
};
