const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const lastExec = new Date;

console.log('----------------------- Bot Clima Iniciado ---------------------------------');

let clima;

async function getClima(cidade){

    try {

        let browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser'
          });

        const page = await browser.newPage();
    
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
                    return document.querySelector('#wob_tci').getAttribute('alt');
                }),
                img: await page.evaluate(()=>{
                    return document.querySelector('#wob_tci').getAttribute('src');
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
 
async function start(cidade){
    console.log('Chamando o objeto clima');
    clima = await getClima(cidade);
    console.log(clima);
    return clima;
};
start('guarulhos')


//Express
const app = express();
app.use(cors());

app.get('/status', (request, response)=>{
    return response.send({message:'server is up',status: 200,lastExec: lastExec.toLocaleString('pt-BR',{dateStyle: 'full', timeStyle: 'short'})})
});

app.get('/clima/:cidade', async (request, response)=>{
    let cidade = request.params.cidade;

    await start(cidade);
    return response.json(clima)
});

app.listen(3333);