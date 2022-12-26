// consider the following code selectors
// first item // document.querySelector("#elementor-tab-content-1502 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-f6253d7.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-7ff6c2b.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-2460.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-disponible-abricotiers > div")
// document.querySelector("#elementor-tab-content-1502 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-f6253d7.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-7ff6c2b.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-3394.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-disponible-abricotiers > div")
// document.querySelector("#elementor-tab-content-1502 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-f6253d7.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-7ff6c2b.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-3890.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-disponible-abricotiers")
// document.querySelector("#elementor-tab-content-1502 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-60f789a.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-1b9046b.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-3872.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-indisponibles-abricots > div")
// document.querySelector("#elementor-tab-content-15010 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-39fc3cf.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-b19edd7.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-14957.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-indisponible-kiwis > div")
// last item // document.querySelector("#elementor-tab-content-15017 > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-cb03b83.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div.elementor-element.elementor-element-faaea8d.elementor-grid-6.elementor-posts--align-center.elementor-grid-tablet-2.elementor-grid-mobile-1.elementor-posts--thumbnail-top.elementor-card-shadow-yes.elementor-posts__hover-gradient.elementor-widget.elementor-widget-posts > div > div > article.elementor-post.elementor-grid-item.post-6237.post.type-post.status-publish.format-standard.has-post-thumbnail.hentry.category-indisponible-vignes > div")

// url of the page: https://www.pep-hprovence.com/pepiniere-haute-provence-varietes-familles-fruitiers-catalogue/#nosfamilles
// Can you create a selector that will select all the items in the page
// and return an array of divs 
// each div contains the information of one item
// using fs, write the array to a file in csv format
// using https to make the request 
// using cheerio to parse the html

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

        if(title.includes(' ©')) {
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


// store items.json file into a variable
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
                // select div when .elementor-widget-wrap is the 4th occurence of .elementor-widget-wrap
                let rawData = $('.elementor-widget-wrap').eq(4).html()
                resolve(rawData)
            })
        })
    })
}

async function getItems() {
    for (let item of items) {
        let rawData = await getSingleItemDatafromUrl(item.link)

        // Now lets considerer the rawdata we just got
        // rawData: '\n' +
        // '\t\t\t\t\t\t\t\t<div class="elementor-element elementor-element-732beef elementor-widget elementor-widget-text-editor" data-id="732beef" data-element_type="widget" data-widget_type="text-editor.default">\n' +
        // '\t\t\t\t<div class="elementor-widget-container">\n' +
        // '\t\t\t\t\t\t\t<p><strong>PORTE-GREFFE :</strong> Myrobolan / Montclar.<br><b>POLLINISATION</b> : Floraison demi-tardive (fin-mars). Autofertilité partielle. A polliniser.<br><strong>DATE DE MATURITÉ : </strong>Fin-juillet.<br><strong>HISTORIQUE : </strong>Obtenu par M. Beaugé en 1830, et non pas originaire de la ville de Baugé en Maine et Loire.</p>\t\t\t\t\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t<div class="elementor-element elementor-element-d76db7c elementor-widget elementor-widget-text-editor" data-id="d76db7c" data-element_type="widget" data-widget_type="text-editor.default">\n' +
        // '\t\t\t\t<div class="elementor-widget-container">\n' +
        // '\t\t\t\t\t\t\t<p><strong>CARACTÉRISTIQUES, CULTURE &amp; SAISONNALITÉ</strong> :<br>Bonne vigueur, port dressé. Bonne productivité.</p>\t\t\t\t\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t<div class="elementor-element elementor-element-51a1f3f elementor-widget elementor-widget-text-editor" data-id="51a1f3f" data-element_type="widget" data-widget_type="text-editor.default">\n' +
        // '\t\t\t\t<div class="elementor-widget-container">\n' +
        // '\t\t\t\t\t\t\t<p><strong>DESCRIPTION &amp; QUALITÉS GUSTATIVES </strong> :<br>Fruit de calibre moyen à chair ferme, fine, juteuse et fondante qui n’adhère pas au noyau. Peau rouge orangé pubescente. </p>\t\t\t\t\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t<div class="elementor-element elementor-element-74b64ba elementor-widget elementor-widget-text-editor" data-id="74b64ba" data-element_type="widget" data-widget_type="text-editor.default">\n' +
        // '\t\t\t\t<div class="elementor-widget-container">\n' +
        // '\t\t\t\t\t\t\t<p><b>CONDITIONNEMENTS :</b><br>En racines nues et conteneurs. <br>Taille: à partir du scion (2ans), jusqu’à 30cm de périmètre de tronc<br></p>\n' +
        // '<p></p>\t\t\t\t\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t<div class="elementor-element elementor-element-13b58ca elementor-widget elementor-widget-button" data-id="13b58ca" data-element_type="widget" data-widget_type="button.default">\n' +
        // '\t\t\t\t<div class="elementor-widget-container">\n' +
        // '\t\t\t\t\t<div class="elementor-button-wrapper">\n' +
        // '\t\t\t<a href="https://www.pep-hprovence.com/wp-content/uploads/2021/10/Nouveaux-tarifs-novembre-2021.png" class="elementor-button-link elementor-button elementor-size-sm" role="button">\n' +
        // '\t\t\t\t\t\t<span class="elementor-button-content-wrapper">\n' +
        // '\t\t\t\t\t\t<span class="elementor-button-text">TARIFS</span>\n' +
        // '\t\t</span>\n' +
        // '\t\t\t\t\t</a>\n' +
        // '\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t</div>\n' +
        // '\t\t\t\t\t'

        // i would like to get { "PORTE-GREFFE":  " Myrobolan / Montclar",
        // "POLLINISATION": "Floraison demi-tardive (fin-mars). Autofertilité partielle. A polliniser.",
        // "DATE DE MATURITÉ": "Fin-juillet",
        // "HISTORIQUE": "Obtenu par M. Beaugé en 1830, et non pas originaire de la ville de Baugé en Maine et Loire",
        // "CARACTÉRISTIQUES, CULTURE & SAISONNALITÉ": "Bonne vigueur, port dressé. Bonne productivité.",
        // "DESCRIPTION & QUALITÉS GUSTATIVES": "Fruit de calibre moyen à chair ferme, fine, juteuse et fondante qui n’adhère pas au noyau. Peau rouge orangé pubescente.",
        // "CONDITIONNEMENTS": "En racines nues et conteneurs. Taille: à partir du scion (2ans), jusqu’à 30cm de périmètre de tronc",
        // "TARIFS": "https://www.pep-hprovence.com/wp-content/uploads/2021/10/Nouveaux-tarifs-novembre-2021.png" }
        // 

        // 
        // cleaning rawData: 

        // remove all data-sheets-value attribute and its value
        rawData = rawData.replace(/data-sheets-value=".*?"/g, '');
        // remove all data-sheets-userformat attribute and its value
        rawData = rawData.replace(/data-sheets-userformat=".*?"/g, '');
        // what regex can i use to get the data i want ?
        // for porte-greffe, i want to get the text between "PORTE-GREFFE" and "POLLINISATION"
        console.log(rawData)
        if(rawData?.match(/PORTE-GREFFE(.*)POLLINISATION/)) {
            item.portegreffe = rawData.toString().match(/PORTE-GREFFE(.*)POLLINISATION/)[1].trim();
        }
        if(rawData?.match(/PORTE-GREFFE(.*)POLLINISATEUR/)) {
            item.portegreffe = rawData.toString().match(/PORTE-GREFFE(.*)POLLINISATEUR/)[1].trim();
        }
        // for pollinisation, i want to get the text between "POLLINISATION" and "DATE DE MATURITÉ"
        if(rawData?.match(/POLLINISATION(.*)\n/)) {
        item.pollinisation = rawData.match(/POLLINISATION(.*)\n/)[1].trim();
        }
        if(rawData?.match(/POLLINISATION(.*)DATE DE MATURITÉ/)) {
            item.pollinisation = rawData.match(/POLLINISATION(.*)DATE DE MATURITÉ/)[1].trim();
            }
        // for date de maturité, i want to get the text between "DATE DE MATURITÉ" and "HISTORIQUE"
        if(rawData?.match(/DATE DE MATURITÉ(.*)HISTORIQUE/)) {
        item.dateDeMaturite = rawData.match(/DATE DE MATURITÉ(.*)HISTORIQUE/)[1].trim();
        }

        if(rawData?.match(/DATE DE MATURITE(.*)HISTORIQUE/)) {
            item.dateDeMaturite = rawData.match(/DATE DE MATURITE(.*)HISTORIQUE/)[1].trim();
            }

        if(rawData?.match(/DATE DE MATURITÉ(.*)\n/)) {
            item.dateDeMaturite = rawData.match(/DATE DE MATURITÉ(.*)\n/)[1].trim();
        }
        // for historique, i want to get the text between "HISTORIQUE" and "CARACTÉRISTIQUES, CULTURE & SAISONNALITÉ"
        // item.historique = rawData.match(/HISTORIQUE(.*)CARACTÉRISTIQUES, CULTURE & SAISONNALITÉ/)[1].trim();
        // if it doesnt work, try between "HISTORIQUE" and a new line \n
        if(rawData?.match(/HISTORIQUE(.*)\n/)) {
        item.historique = rawData.match(/HISTORIQUE(.*)\n/)[1]?.trim();
        }
        // for caractéristiques, culture & saisonnalité, i want to get the text between "CARACTÉRISTIQUES, CULTURE & SAISONNALITÉ" and "DESCRIPTION & QUALITÉS GUSTATIVES"
        // if it doesnt work, try between "CARACTÉRISTIQUES, CULTURE & SAISONNALITÉ" and a new line \n
        // also leave open the possibiltiy of CULTURE &amp; 
        if(rawData?.match(/CARACTÉRISTIQUES, CULTURE &amp; SAISONNALITÉ(.*)\n/)) {
        item.caracteristiques = rawData.match(/CARACTÉRISTIQUES, CULTURE &amp; SAISONNALITÉ(.*)\n/)[1].trim() 
        }
        if(rawData?.match(/CARACTÉRISTIQUES DE CULTURE(.*)\n/)) {
        item.caracteristiques = rawData.match(/CARACTÉRISTIQUES DE CULTURE(.*)\n/)[1].trim()
        }
        // for description & qualités gustatives, i want to get the text between "DESCRIPTION & QUALITÉS GUSTATIVES" and "CONDITIONNEMENTS"
        if(rawData?.match(/DESCRIPTION &amp; QUALITÉS GUSTATIVES(.*)\n/)) {
        item.description = rawData.match(/DESCRIPTION &amp; QUALITÉS GUSTATIVES(.*)\n/)[1].trim();
        }
        // for conditionnements, i want to get the text between "CONDITIONNEMENTS" and "TARIFS"
        // for tarifs, i dont want TARIFS
        console.log(item)







    }
}

getItems()
