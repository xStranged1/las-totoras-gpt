const { addKeyword } = require("@bot-whatsapp/bot");

const flowImages = addKeyword(['imagenes', 'imágenes', 'Imagenes', 'Imágenes', 'img', 'fotos'])
    .addAnswer("Estas son nuestras instalaciones ✨")
    .addAnswer('Monoambiente *Totoras 1*', { // para 1 o 2 personas, cama simples o doble
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-3.jpg',
    })
    .addAnswer('Monoambiente *Totoras 2*', { // 3 personas, camas simples individuales
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-1.jpg',
    })
    .addAnswer('Departamento *Totoras 3*', { // para 4-5 personas 4 camas individuales, 1 cama doble king-size
        media: 'https://raw.githubusercontent.com/xStranged1/las-totoras-gpt/refs/heads/main/doc/images/totoras-2.jpg',
    })
module.exports = { flowImages }