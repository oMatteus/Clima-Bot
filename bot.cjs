// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors')

console.log('Bot Clima');
let clima;
let cidade = 'Guarulhos';

async function getClima(cidade){
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser'
      });
    const page = await browser.newPage();


    const url = `https://www.google.com/search?q=clima+${cidade}&oq=clima+&gs_lcrp=EgZjaHJvbWUqDAgAEAAYQxiABBiKBTIMCAAQABhDGIAEGIoFMhYIARAuGIMBGMcBGLEDGMkDGNEDGIAEMhAIAhAAGIMBGJIDGLEDGIAEMgYIAxBFGDkyDQgEEAAYkgMYgAQYigUyDQgFEAAYgwEYsQMYgAQyCQgGEAAYChiABDIMCAcQABgKGLEDGIAEMg0ICBAAGIMBGLEDGIAEMg0ICRAAGIMBGLEDGIAEqAIAsAIA&sourceid=chrome&ie=UTF-8`;

    await page.goto(url);

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
    clima = await getClima(cidade);
    console.log(clima);
}
start();



const app = express();
app.use(cors());
app.listen(3333);

app.get('/status', (request, response)=>{
    const hora = new Date;
    return response.send({message:'server is up',status: 200,data: hora.toLocaleString('pt-BR',{dateStyle: 'full', timeStyle: 'short'})})
});

app.get('/get', (request, response)=>{
    return response.json(clima);
});


app.use(express.urlencoded({extended:true}));


app.post('/cidade:name', (req, res) => {
    let name = req.params.name;
    let body = req.body.name;
    cidade = name;
    cidade = body;
    return res.json(clima);
});
