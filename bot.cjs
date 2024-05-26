// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const express = require('express');

console.log('Bot Clima');
let clima;

async function getClima(){
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
      });
    const page = await browser.newPage();

    const cidade = 'Guarulhos';
    const url = `https://www.google.com/search?q=clima+${cidade}&oq=clima+&gs_lcrp=EgZjaHJvbWUqDAgAEAAYQxiABBiKBTIMCAAQABhDGIAEGIoFMhYIARAuGIMBGMcBGLEDGMkDGNEDGIAEMhAIAhAAGIMBGJIDGLEDGIAEMgYIAxBFGDkyDQgEEAAYkgMYgAQYigUyDQgFEAAYgwEYsQMYgAQyCQgGEAAYChiABDIMCAcQABgKGLEDGIAEMg0ICBAAGIMBGLEDGIAEMg0ICRAAGIMBGLEDGIAEqAIAsAIA&sourceid=chrome&ie=UTF-8`;

    await page.goto(url);

    const clima = {
        hoje:{
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
        previsao:[
            {
                dia: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="0"] .Z1VzSb').textContent;
                }),
                descricao: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="0"] .DxhUm img').getAttribute('alt');
                }),
                img: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="0"] .DxhUm img').getAttribute('src');
                }),
                tempMax: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="0"] .gNCp2e .wob_t').textContent;
                }),
                tempMin: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="0"] .QrNVmd .wob_t').textContent;
                }),
                // chuva: await page.evaluate(()=>{
                //     return document.querySelector('#wob_pp').textContent;
                // }),
                
            },
            {
                dia: await page.evaluate(()=>{
                    return document.querySelector('div[data-wob-di="1"] .Z1VzSb').textContent;
                }),
            }
            
        ],
    }

    await browser.close();
    return clima
};

 
async function start(){
    console.log('chamou');
    clima = await getClima();
    console.log(clima);
}
start();

const app = express();

app.get('/status', (request, response)=>{
    return response.send({message:'server is up',status: 200})
})

app.get('/get', (request, response)=>{
    return response.json(clima)
})

app.listen(3333)