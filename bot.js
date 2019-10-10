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
commandeGetter.set('!getxp','');
commandeGetter.set('!getgold','');
//s'utilise seul (juste il faut que le pseudo soit égal a votre nom de perso)

// console

bot.on('ready', function () {
    bot.user.setPresence({game:{name: 'I.A.D.C.H',type: 0}})
    console.log("Je suis connecté !")
})

bot.login('NjI5NDExMjc4MjQyMTg1MjI5.XZZXUw.I2SeEez4K5r-wGdRLmwHQracWQE')

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
    //Question/réponse phrase/réponse de la Map @reponse 
    if(reponse.has(message.content)) message.reply(reponse.get(message.content))
    else 
    {
        //accès fiche de Personnage
        var x = message.content.split(' ')
        if(x[0] == '!fiche') message.reply(bd.PJ[x[1]].fiche)
        else 
        {
            //Commandes Joueurs
            if(commandeGetter.has(message.content))
            {
                var type = message.content.split('get');
                message.reply(bd.PJ[message.member.nickname][type[1]])
            }
            else
            {
                //Commandes Admin/MJ
                if(commandePrenium.has(x[0])/* && (message.member.id == '265079904675037184' || message.member.id == '510599453569187860')*/) 
                {
                    type = x[0].split('gain')[1];
                    bd.PJ[x[1]][type] += parseInt(x[2]);
                    message.reply("fais");
                    saveFile();
                }
                else
                {
                    // Lanceur de dé
                    var x = (message.content.split('d')[0]+'d');
                    if (x == '!1d') message.reply(Math.floor(Math.random() * parseInt(x[1]) + 1));
                    else 
                    {
                        
                    }
                }
            }
        }
    }
})

//Gestionnaire Magasin

bot.on('message',function(message){
    var mod = message.content.split(' ')
    switch(mod[0]){
        case '!description':
            message.reply(bd.Magasin[mod[1]].Description);
        break;
        case '!buy':
            
        break;
        case '!dispo':
            message.reply(bd.Magasin[mod[1]].Dispo);
        break; 

    }
})

function saveFile(){
    fs.writeFileSync(fileName, JSON.stringify(bd,null,2));
    bd = JSON.parse(fs.readFileSync(fileName))
}