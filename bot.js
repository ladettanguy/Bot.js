const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require("fs");
var fileName = './bd.json';

var bd = JSON.parse(fs.readFileSync(fileName))

var reponse = new Map;
reponse.set('!coucou','bijour');
reponse.set('!épouse moi','mmmmh donne 500 euro a Shapire est pourquoi pas');
reponse.set('!tes choupie','mer mer merci ba ba baka ^/////^');
reponse.set('!je taime~',' moi aussiii~~~~');

var commandePrenium = new Map;
commandePrenium.set('!gainxp','')
commandePrenium.set('!gaingold','')
//doit etre utiliser en fesant !gain[xp or gold] [Perso (avec la premiere lettre majuscule)] [Montant]

var commandeGetter = new Map;
//s'utilise seul (juste il faut que le pseudo soit égal a votre nom de perso)
commandeGetter.set('!getxp','');
commandeGetter.set('!getgold','');

// console

bot.on('ready', function () {
    bot.user.setPresence({game:{name: 'I.A.D.C.H',type: 0}})
    console.log("Je suis connecté !")
})

bot.login('NjI5NDExMjc4MjQyMTg1MjI5.XZ7qrg.52TrldlcQUchcaoGX1n-ay2C14Q')

// message de bienvenue est  au revoir 

bot.on('guildMemberAdd', function (member) {
    member.createDM().then(function(channels){
        return channels.send('Bienvenue sur le serveur Hybride je me présente je suis Grille Serveur'+ member.displayName)
    })
})
         
bot.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find('name', 'information');
    if (!channel) return;
    channel.send(`Bienvenue sur le serveur Hybride je me présente je suis Grille Serveur ${member}`);
});

bot.on('guildMemberRemove', member=>{
    member.guild.channels.find('name','information').send(` Bye Bye~!${member}`)
})

// message divers + commandes 
      
bot.on('message',function (message)  
{
    var x = message.content.split(' ');
    var typePrenim = type = x[0].split('gain')[1];

    //Formation de if else if ... avec (condition) ? instruction : (condition) ? instruction : ect
    (reponse.has(message.content)) ? message.reply(reponse.get(message.content)) : //Question/réponse phrase/réponse de la Map @reponse 
    (x[0] == '!fiche') ? message.reply(bd.PJ[x[1]].fiche) : //accès fiche de Personnage
    (commandeGetter.has(message.content)) ? message.reply(bd.PJ[message.member.nickname][message.content.split('get')[1]]) : //Commandes Joueurs
    (commandePrenium.has(x[0]) && (message.member.id == '265079904675037184' || message.member.id == '510599453569187860')) ? //Commandes Admin/MJ
        bd.PJ[x[1]][type] += parseInt(x[2]) :
    (message.content.split('d')[0]+'d' == '!1d') ? 
        message.reply(Math.floor(Math.random() * parseInt(message.content.split('d')[1]) + 1)) : //Lanceur de dé
    x = 0; // commande inutile pour finir le Else
    saveFile()
})

//Gestionnaire Magasin/Inventaire

bot.on('message',function(message){
    var mod = message.content.split(' ')
    switch(mod[0]){
        case '!description':
            message.reply(bd.Magasin[mod[1]].Description);
        break;
        case '!buy':
            switch(mod.length){
            case 2:
                //décrémente l'argent apres vérification
                //ajoute a l'inventaire
                //décrémente le dispo de 1
                //
            break;
            case 3:
                //pareil que case 2 mais ajoute mod[1] dans l'inentaire et décremente de x[1]
            break;
            default:
                message.reply("problem dans l'achat essayer !buy [Nombre] [Nom]")
            break
            }
        break;
        case '!dispo':
            message.reply(bd.Magasin[mod[1]].Dispo);
        break; 
        case '!use':

        break;

    }
})

function saveFile(){
    fs.writeFileSync(fileName, JSON.stringify(bd,null,2));
    bd = JSON.parse(fs.readFileSync(fileName))
}