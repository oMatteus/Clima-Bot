// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors')

console.log('Bot Clima');
let clima;

async function getClima(cidade=guarulhos){
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
      });
    const page = await browser.newPage();

    // const cidade = 'Guarulhos';
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
            // {
            //     dia: await page.evaluate(()=>{
            //         return document.querySelector('div[data-wob-di="1"] .Z1VzSb').textContent;
            //     }),
            //     descricao: await page.evaluate(()=>{
            //         return document.querySelector('div[data-wob-di="1"] .DxhUm img').getAttribute('alt');
            //     }),
            //     img: await page.evaluate(()=>{
            //         return document.querySelector('div[data-wob-di="1"] .DxhUm img').getAttribute('src');
            //     }),
            //     tempMax: await page.evaluate(()=>{
            //         return document.querySelector('div[data-wob-di="1"] .gNCp2e .wob_t').textContent;
            //     }),
            //     tempMin: await page.evaluate(()=>{
            //         return document.querySelector('div[data-wob-di="1"] .QrNVmd .wob_t').textContent;
            //     })
            // },
        ],
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

        clima.previsao.push(obj)
    };

    await browser.close();
    return clima
};
 
async function start(){
    clima = await getClima();
    console.log(clima);
}
// start();

const app = express();
app.use(cors())

app.get('/status', (request, response)=>{
    const hora = new Date;
    return response.send({message:'server is up',status: 200,data: hora.toLocaleDateString('pt-BR',{dateStyle: 'full', timeStyle: 'short'})})
});

app.get('/get:cidade', (request, response)=>{
    getClima(request.params.cidade);
    start();
    return response.json(clima);
});

app.listen(3333)