// Nous allons récupérer les données de la recherche google "Mars"
// avec casper, nous avons installé dans l'ordre node JSON, phantom JS 2.1.1
// et casper 1.1.4

// https://gist.github.com/telbiyski/ec56a92d7114b8631c906c18064ce620
// puis
// npm install -g casperjs




// // Je détermine la manière dont je recherche,
// sans le verbose, sans les images sans les plugins
// Mon User Agent
// Cet outil permet de vous indiquer votre user agent.
// Le user agent est un code envoyé par chaque navigateur
// web lors d'une connexion à un serveur. Le code permet
// à un site web de savoir entres autres quel navigateur
// et quel système d'exploitation est utilisé par un internaute.

// Votre user-agent
// Votre user agent :
// Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
// Votre adresse IP : 90.87.218.7

var casper = require("casper").create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'                
    }
});

// Je crée les variables nécessaires
var searchTerm = 'mars';
var url='https://www.google.com/';
var links = [];
var titles = [];
var arrJSON = [];
var fs = require ('fs');

// En inspectant le code on remarque que la div mère dont la class est .r
// contient contient 2 enfants : a les liens et h3


// On récupère les liens avec la méthode map.
// La méthode map() crée un nouveau tableau avec les résultats
// de l'appel d'une fonction fournie sur chaque élément du tableau appelant.
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/map
// http://docs.casperjs.org/en/latest/quickstart.html#a-minimal-scraping-script

function getLinks() {
    var link = document.querySelectorAll('.r a');
    return Array.prototype.map.call(link, function(e) {
        return e.getAttribute('href');
    });
}

// idem pour les titres
function getTitles() {
    var links = document.querySelectorAll('.r h3');
    return Array.prototype.map.call(links, function(e) {
        return e.innerHTML;
    });
}

// on crée le fichier JSON
// On rajoute une valeuir titre et une valeur link dans un tableau
// https://www.w3schools.com/jsref/jsref_push.asp
function createJSON (){
    for (index=0; index<links.length; index++) {
        arrJSON.push({
            title: titles[index],
            link: links[index]
        });
    }
    return JSON.stringify(arrJSON);//La méthode JSON.stringify() convertit une valeur JavaScript
    // en chaîne JSON. Optionnellement, elle peut remplacer des valeurs ou spécifier
    // les propriétés à inclure si un tableau de propriétés a été fourni.
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/JSON/stringify
}

// casper.start('http://google.fr/', function() {
//    // Wait for the page to be loaded
//    this.waitForSelector('form[action="/search"]');
// }); cela permet de voir si la fonction se lance dans terminal
// lorsque l'on lancera le script il commencera par start

casper.start(url, function() {
    this.echo("Start ...");
});

casper.then(function() {
    this.waitForSelector('form[action="/search"]');
});
// casper.then(function() {
//    // search for 'casperjs' from google form
//    this.fill('form[action="/search"]', { q: 'casperjs' }, true);
// });
casper.then(function(){
    this.fill(
        'form[action="/search"]',
        {
            q: searchTerm
        },
        true
    );
});


// casper.then(function() {
//     // aggregate results for the 'casperjs' search
//     links = this.evaluate(getLinks);
//     // now search for 'phantomjs' by filling the form again
//     this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
// });
casper.then(function() {
    links = this.evaluate(getLinks);
});

// casper.then(function() {
//     // aggregate results for the 'phantomjs' search
//     links = links.concat(this.evaluate(getLinks));
// });

casper.then(function() {
    titles = this.evaluate(getTitles);
});
casper.then(function() {
    for (index=0; index<links.length; index++) {
        this.echo(' - '+titles[index] + ', '+links[index]);
    }
});
casper.then(function() {
    var data = createJSON();
    fs.write('result.json', data, 'w');
});

// casper.run(function() {
//     // echo results in some pretty fashion
//     this.echo(links.length + ' links found:');
//     this.echo(' - ' + links.join('\n - ')).exit();
// });
casper.run(function() {
    this.echo("... Done :) ").exit();
});


// Dans terminal on se positionne dans le bon dossier et on tape
// casperjs.js sample.js (ici casperjs.js exé.js) En lancant le scrip le fichier 
// JSON se crée tout seul dans le dossier ou l'on a lancer le script
