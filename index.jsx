const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')

const url = 'https://www.pep-hprovence.com/pepiniere-haute-provence-varietes-familles-fruitiers-catalogue/#nosfamilles'
function saveToFile() {
    https.get(url, (res) => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        })

        res.on('end', () => {
            const $ = cheerio.load(data)
            let items = []
            $('.elementor-post').each((i, el) => {
                const item = $(el)
                const link = item.find('.elementor-post__thumbnail__link').attr('href')
                let title = item.find('h2').text()

                title = title.replace(/\s+/g, ' ').trim()
                if (title.includes('Variété : ')) {
                    title = title.replace('Variété : ', '')
                }

                if (title.includes(' ©')) {
                    // remove the © at beginning of the title
                    title = title.replace(' © ', '')
                    // add the © at the end of the title
                    title = title + '©'
                }
                // first letter of the title should be uppercase
                title = title.charAt(0).toUpperCase() + title.slice(1)

                const image = item.find('img').attr('src')

                items.push({ title, link, image })
            })
        })
    }).on('error', (err) => {
        console.log('Error: ' + err.message)
    })
}
// store saveToFile() => items.json file into a variable 
let items = require('./items.json')
items = items.slice(66, 67)

// let write promises
async function getSingleItemDatafromUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => { 
                const $ = cheerio.load(data)
                let rawData = $('.elementor-widget-wrap').eq(4).html()
                resolve(rawData)
            })
        })
    })
}

async function getItems() {
    for (let item of items) {
        let rawData = await getSingleItemDatafromUrl(item.link)
        // remove all data-sheets-value attribute and its value
        rawData = rawData.replace(/data-sheets-value=".*?"/g, '');
        // remove all data-sheets-userformat attribute and its value
        rawData = rawData.replace(/data-sheets-userformat=".*?"/g, '');

        console.log(rawData)
        if (rawData?.match(/PORTE-GREFFE(.*)POLLINISATION/)) {
            item.portegreffe = rawData.toString().match(/PORTE-GREFFE(.*)POLLINISATION/)[1].trim();
        }
        if (rawData?.match(/PORTE-GREFFE(.*)POLLINISATEUR/)) {
            item.portegreffe = rawData.toString().match(/PORTE-GREFFE(.*)POLLINISATEUR/)[1].trim();
        }

        if (rawData?.match(/POLLINISATION(.*)\n/)) {
            item.pollinisation = rawData.match(/POLLINISATION(.*)\n/)[1].trim();
        }
        if (rawData?.match(/POLLINISATION(.*)DATE DE MATURITÉ/)) {
            item.pollinisation = rawData.match(/POLLINISATION(.*)DATE DE MATURITÉ/)[1].trim();
        }

        if (rawData?.match(/DATE DE MATURITÉ(.*)HISTORIQUE/)) {
            item.dateDeMaturite = rawData.match(/DATE DE MATURITÉ(.*)HISTORIQUE/)[1].trim();
        }

        if (rawData?.match(/DATE DE MATURITE(.*)HISTORIQUE/)) {
            item.dateDeMaturite = rawData.match(/DATE DE MATURITE(.*)HISTORIQUE/)[1].trim();
        }

        if (rawData?.match(/DATE DE MATURITÉ(.*)\n/)) {
            item.dateDeMaturite = rawData.match(/DATE DE MATURITÉ(.*)\n/)[1].trim();
        }

        if (rawData?.match(/HISTORIQUE(.*)\n/)) {
            item.historique = rawData.match(/HISTORIQUE(.*)\n/)[1]?.trim();
        }

        if (rawData?.match(/CARACTÉRISTIQUES, CULTURE &amp; SAISONNALITÉ(.*)\n/)) {
            item.caracteristiques = rawData.match(/CARACTÉRISTIQUES, CULTURE &amp; SAISONNALITÉ(.*)\n/)[1].trim()
        }
        if (rawData?.match(/CARACTÉRISTIQUES DE CULTURE(.*)\n/)) {
            item.caracteristiques = rawData.match(/CARACTÉRISTIQUES DE CULTURE(.*)\n/)[1].trim()
        }
        if (rawData?.match(/DESCRIPTION &amp; QUALITÉS GUSTATIVES(.*)\n/)) {
            item.description = rawData.match(/DESCRIPTION &amp; QUALITÉS GUSTATIVES(.*)\n/)[1].trim();
        }
        console.log(item, "hey")
    }
}

getItems()
