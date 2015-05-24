Turflijst
===================
Dit is de readme voor mijn turflijst applicatie.
Benodigd voor gebruik
---------------------
#### Ubuntu
Alles is gebouwd voor makkelijke setup op een [Ubuntu](www.ubuntu.com/) machine. Andere besturingssystemen kunnen ook, maar dan moet je zelf uitzoeken hoe dat gaat werken.
#### Bash
Er zitten een aantal scripts bij die gedraaid moeten worden en zijn gescreven in [bash](http://www.gnu.org/software/bash/). Dit zit standaard ingebouwd in de meeste linux distributies (ubuntu en debian).
#### NPM en Node.js
Je hebt [npm](https://www.npmjs.com/) en [node](https://nodejs.org/) nodig om de Turflijst te kunnen gebruiken. Deze worden gebruikt om pakketten te installeren en het mini-servertje te draaien.
#### Gmail
[Gmail](mail.google.com) wordt gebruikt om data vanaf te mailen en luistert daarnaar voor configuratie mails. Deze moet less secure apps toestaan (zie [hier](https://www.google.com/settings/security/lesssecureapps)!) en moet ook imap toestaan (zie dat [hier](https://support.google.com/mail/troubleshooter/1668960?hl=en#ts=1665018,1665144)). Het is dan ook aangeraden om een aparte gmail voor gebruik met deze applicatie die gebruiken.
Setup
---------------------
Draai: `bash init.sh`. Deze installeert de basispakketten en libraries die gebruikt worden en zet vervolgens een mongodb op waar alles voor de lange duur wordt opgeslagen. Dit kan je ook op een andere mongodb server, dan moet je `bash init.sh remote` uitvoeren en je config daarop aanpassen.
Als je dingen hebt aangepast aan de broncode moet je het generatie script uitvoeren: `bash generate.sh`, als je niets hebt aangepast hoeft dit niet.
Vervolgens start je de applicatie met `node app.js`.
Config
-----------
Onder *config/* staat een *config.json* file. Deze bevat alle configuratie die je nodig hebt om de applicatie de laten doen wat jij wilt. De configuratie elementen zijn:

 - **name** : Dit is de naam die bovenaan je applicatie komt te staan.
 - **slogan** : De slogan die naast je naam komt te staan.
 - **drinks** : dit is een object met maximaal 3 elementen met de volgende structuur: *item naam* : *item kleur*. In de initiële config staat een voorbeeld wat je kan uitbreiden.
 - **date** : De datum van verwerking. Deze wordt elke keer gezet dus kan je zelf negeren.
 - **administrator** : Is een object met de volgende elementen:
     - *name* : De naam van de administrator.
     - *email* : De email waar de data naar wordt verzonden.
     - *password* : Het administratie wachtwoord wat wordt gebruikt ter verificatie voor verwerking en dit moet de titel van de configuratie mail zijn die je stuurt.
 - **email** : Je gmail configuratie:
	- *user* : Je gmail adres.
	- *pass* : je gmail wachtwoord.
 - **database-url** : Deze hoef je alleen in te vullen als je een andere of externe database wilt gebruiken. Ander moet deze de lege string `""` zijn.
 - **graphs** : Dit zijn de instellingen voor de grafieken:
	 - *bar-graph* : Voor het staaf diagram. Bevat de volgende attributen:
		 - width : de breedte van het staaf diagram.
		 - height : de hoogte van het staaf diagram.
	 - *pi-graph* : Voor het donut diagram. Bevat de volgende attributen:
		 - width : de breedte van het staaf diagram.
		 - height : de hoogte van het donut diagram.
		 - r : de dikte van de ring.
		 - outer-radius : de radius van de buitenste ring.
	 - *scatter-graph* : Voor de scatterplot. Bevat de volgende attributen:
		 - width : de breedte van de scatterplot.
		 - height : de hoogte van de scatterplot.
		 - m_min : de minimale plot grootte.
		 - m_max : de maximale plot grootte (werkt niet goed).
 - **rooms** : Dit zijn de kamer elementen die de data bevatten. Dit is een object met een lijst aan elementen van de volgende structuur:
	 - *occupant* : De naam (of bijnaam) van de bewoner van deze kamer.
	 - *turfs* : Dit is een object wat dezelfde elementen bevat als de **drinks** config element, maar dan is de waarde een getal. Bij initialisatie is `0` natuurlijk de standaardwaarde.
	 

Config mail
-----------
Je kan een nieuwe configuratie mailen naar de turflijst, deze mail moet dan als titel het administrator wachtwoord van deze turflijst zijn, zoals in je *config.json* staat. Je voegt de nieuwe config toe als (enige!) bijlage.
Aanpassingen
------------------
Als je dingen wilt aanpassen kan dat in de *src/* folder. Hier staan de styling onder *less/* en de componenten onder *elements/*. Het wordt zeer sterk afgeraden om de componenten aan te passen als je niet precies weet wat je doet. De styling aanpassen kan makkelijk in deze *\*.less* files. Elk element heeft zijn eigen styling. Alles is geschreven in [Less](lesscss.org).