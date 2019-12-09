const Discord = require('discord.js')
const bot = new Discord.Client()
var godModActived = false;
const fs = require("fs");
var fileName = './bd.json';

var bd = JSON.parse(fs.readFileSync(fileName))

var reponse = new Map;
reponse.set('!coucou','bijour');
reponse.set('!épouse moi','mmmmh donne 500 euro a Shapire est pourquoi pas');
reponse.set('!tes choupie','mer mer merci ba ba baka ^/////^');
reponse.set('!je taime~','moi aussiii~~~~');

var commandePrenium = new Map;
commandePrenium.set('!gainxp','!gainxp [Nom] [Montant]')
commandePrenium.set('!gaingold','!gaingold [Nom] [Montant]')
//doit etre utiliser en fesant !gain[xp or gold] [Perso (avec la premiere lettre majuscule)] [Montant]
commandePrenium.set('!addPJ','!addPJ [Nom] [LienFiche]')
commandePrenium.set('!addshop','!addshop [ItemName] [Description] [NbDispo]')
commandePrenium.set('!sell','!sell [ItemName] [NbAjouté]')

var commandeGetter = new Map;
//s'utilise seul (juste il faut que le pseudo soit égal a votre nom de perso)
commandeGetter.set('!getxp','Renvoie ton XP');
commandeGetter.set('!getgold','Renvoie tes Gold');

var commandeMagasin = new Map;
commandeMagasin.set('!use','!use [ItemName]')
commandeMagasin.set('!buy','!buy [ItemName] *[NbAchat]')
commandeMagasin.set('!dispo','!dispo [ItemName]')
commandeMagasin.set('!inventaire','Revoie le contenu de votre Inventaire')

// console

bot.on('ready', function () {
    bot.user.setPresence({game:{name: 'I.A.D.C.H',type: 0}})
    console.log("Je suis connecté !")
})

bot.login('NjI5NDExMjc4MjQyMTg1MjI5.XZ84rg.vzcxr2oAXw_DmBTz8DpFYa5gQL0')

// message de bienvenue est  au revoir 

bot.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.find('name', 'information');
    if (!channel) return;
    channel.send(`Bienvenue sur le serveur Hybride je me présente je suis Grille Serveur ${member}`);
});
var admin = ['265079904675037184','510599453569187860','290227829558345728']  //G
bot.on('guildMemberRemove', member=>{
    member.guild.channels.find('name','information').send(` Bye Bye~!${member}`)
})

// message divers + commandes 
      
bot.on('message',function (message)  
{
    try{
        if(message.content.charAt(0) == '!'){
            var x = message.content.split(' ');
            var typePrenium = x[0].split('gain')[1];
            var de = message.content.split('d');

            //Formation de if else if ... avec (condition) ? instruction : (condition) ? instruction : ect
            (message.content == '!help')? help(message):
            (reponse.has(message.content)) ? message.reply(reponse.get(message.content)) : //Question/réponse phrase/réponse de la Map @reponse 
            (x[0] == '!fiche') ? message.reply(bd.PJ[x[1]].fiche) : //accès fiche de Personnage
            (commandeGetter.has(message.content)) ? message.reply(getPJ(message.member.nickname,message.content.split('get')[1])) : //Commandes Joueurs
            (commandePrenium.has(x[0]) && estAdmin(message)) ? //Commandes Admin/MJ de gain d'xp et gold
                commandeAdmin(message): (message.content == '!QuiEstTonMaitre' && message.member.id == admin[2])? godModActived = true : //G
            (de[0]+'d' == '!1d') ? message.reply(lanceurDe(de[1])) : //Lanceur de dé
            gestionInventaire(message); //gestion du magasin + inventaire
            saveFile();
        }
    }
    catch(err){
        message.reply('erreur détecté d\'origin inconnu');
    }
})

//Function

function help(message){
    var helpMessage= 'Les atribut commençant par * sont optionnel \n\nVoici les commandes d\'information sur vous, vu que t\'es pas capable de le savoir tous seul :\n';
    commandeGetter.forEach(function logMapElements(value, key){
        helpMessage = helpMessage + `${key} --> ${value}\n`;
    });
    helpMessage = helpMessage + '\nVoici les commande de magasin, tu etais surment trop bête pour les retenir :\n'
    commandeMagasin.forEach(function logMapElements(value, key){
        helpMessage = helpMessage + `${key} --> ${value}\n`;
    });
    if(estAdmin(message)){
        helpMessage = helpMessage + '\nVoici les commande Prenium pour toi mon beaux Admin :<3\n'
        commandePrenium.forEach(function logMapElements(value, key){
            helpMessage = helpMessage + `${key} --> ${value}\n`;
        });
    }
    message.member.send(helpMessage);
}

function getPJ(nickname,mode){
    return bd.PJ[nickname][mode]
}

function estAdmin (message){
    var adminOuPas = (((message.member.id == admin[0] || message.member.id == admin[1]) && godModActived == false) 
    || (godModActived == true && message.member.id == admin[2]));                                                           //G
    if(adminOuPas == false && message.content != '!help') message.reply('t\'est pas admin sale pute');
    return adminOuPas;
}

function lanceurDe (valDe){
    return Math.floor(Math.random() * parseInt(valDe) + 1);
}

function commandeAdmin(message){
    var mod = message.content.split(' ');
    switch (mod[0]){
        case '!gaingold' || '!gainxp':
            var typePrenium = mod[0].split('gain')[1]
            try {
                bd.PJ[mod[1]][typePrenium] += parseInt(mod[2])
            }
            catch(err){
                message.reply('Chère Administrateur, je suis dans le regrèt de vous informer que je ne comprend pas se que vous m\'avais demandé')
                message.channel.send('cela doit être le nom de personnage mal écrit. Vérifié et rééssayer! <3')
            }
        break;
        case '!addshop':
            if(mod.length == 5){
                bd.Magasin[mod[1]] = {}
                bd.Magasin[mod[1]].Prix = parseInt(mod[2])
                bd.Magasin[mod[1]].Description = mod[3]
                bd.Magasin[mod[1]].Dispo = parseInt(mod[4])
            }
            else message.reply('Erreur dans la mise en vente, désolé. Essayer en suivant : !addshop [ItemName] [Prix] [Description] [Dispo]')
        break;
        case '!sell':
            if(mod.length == 3)
                bd.Magasin[mod[1]].Dispo += parseInt(mod[2]);
            else message.reply('désolé vous avez du vous tromper dans la commande. Essayer en suivant: !sell [ItemName] [Nombre]')
        break;
        case '!addPJ':
            if(mod.length == 3){
                bd.PJ[mod[1]] = {}
                bd.PJ[mod[1]].xp = 0
                bd.PJ[mod[1]].gold = 0
                bd.PJ[mod[1]].fiche = mod[2]
                bd.PJ[mod[1]].Inventaire = {}
            }
            else message.reply('désolé vous vous êtes trompé dans la commande. suivez: !addPJ [Nom] [LienFiche]')
        break;
    }
}

function gestionInventaire(message){
    var mod = message.content.split(' ')
    switch(mod[0]){
        case '!description': //description d'un item avec !description [Nom]
            message.reply(bd.Magasin[mod[1]].Description);
        break;
        case '!buy':
            try{
                switch(mod.length){
                case 2: //achat de qu'un produit avec !buy [Nom]
                    var erreur = achat(message.member.nickname,mod[1],1);
                    
                    (erreur == -1)? message.reply('t\'a pas assez de gold sale pauvre !'):
                    (erreur == -2)? message.reply('t\'essaye d\'acheter un article en rupture de stock , Conard'):
                    message.reply('Achat éffectué')        
                break;
                case 3: //achat de 1 ou + avec !buy [Nombre] [Nom]
                    var erreur = achat(message.member.nickname,mod[2],Math.abs(parseInt(mod[1])));
            
                    (erreur == -1)? message.reply('t\'a pas assez de gold sale pauvre !'):
                    (erreur == -2)? message.reply('t\'essaye d\'acheter un article en rupture de stock , Conard'):
                    message.reply('Achat éffectué')
                break;
                default:
                    message.reply("problème dans l'achat. Essaie !buy [Nombre] [Nom] ou !buy [Nom] , tu as dû encore te trompé mongole !")
                break
                }
            }
            catch(err){
                message.reply('Item pas en vente, retape un vrai item grosse Salope !')
            }
        break;
        case '!dispo':
            if(mod.length == 1){
                message.member.send(bd.Magasin);
                break;
            }
            message.reply(bd.Magasin[mod[1]].Dispo);
        break; 
        case '!use':
            (utiliser(message.member.nickname,mod[1]) < 0) ? message.reply('tu n\'a pas l\'item dans ton inventaire abruti !'):
            message.reply('Yes, tu as utilisé(e) un(e) {' + mod[1] + '}');
        break;
        case '!inventaire':
            message.reply(bd.PJ[message.member.nickname].Inventaire);
        break;
    }
}

function utiliser(nickname,item){
    try {
        var count = bd.PJ[nickname].Inventaire[item];
        if(count > 0){
            bd.PJ[nickname].Inventaire[item] -= 1; 
            return 0;
        }
        else return -1;
    }
    catch (err){
        return -1;
    }
}

function achat(nickname,item,nombre){
    var goldAvailable = getPJ(nickname,'gold');
    var goldNeeded = bd.Magasin[item].Prix * nombre;
    if(goldAvailable < goldNeeded) return -1;   //vérif que l'argent est dispo return -1 pour l'error
    if(bd.Magasin[item].Dispo < nombre) return -2; //vérif que la disponibilité est bonne  return -2
    if(bd.PJ[nickname].Inventaire[item] == null) bd.PJ[nickname].Inventaire[item] =0;
    bd.PJ[nickname].Inventaire[item] += nombre;         //ajoute a l'inventaire
    bd.Magasin[item].Dispo -= nombre;                //décrémente le dispo de @nombre
    bd.PJ[nickname].gold -= goldNeeded;            //décrémente l'argent
    return 0; //return sans probleme
}

function saveFile(){
    fs.writeFileSync(fileName, JSON.stringify(bd,null,2));
    bd = JSON.parse(fs.readFileSync(fileName))
}