require('chromedriver');

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
	        host: "smtp.gmail.com",
	        port: 465,
	        secure: true, // true for 465, false for other ports
	        auth: {
	          user: 'yourGoogleEmail@gmail.com', 
	          pass: 'yourGooglePassword', 
	        },});

var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('chrome').build();

async function login () {

	await driver.get('https://zitaberria.osakidetza.eus/o22PlamWar/iniciologin.do');
	await driver.findElement(By.id('codnumerico')).sendKeys('NumeroTIS');
	await driver.findElement(By.id('apellido')).sendKeys('PrimerApellido');
	await driver.findElement(By.id('idfecha')).clear();
	await driver.findElement(By.id('idfecha')).sendKeys('dd/mm/yyyy'); //la fecha de nacimiento, birth date

	await driver.sleep(2000);
	await driver.findElement(By.id('btnSubmitTis')).click();
	await driver.sleep(2000);
	await driver.findElement(By.name('valorAccion')).click();
}   	

async function compruebaDisponibilidad () {
    var src = await driver.getPageSource();
    // var success = await driver.search('covid', src);
    var success = false;
    // console.log(src);

    if (src.indexOf('covid') > 0 || src.indexOf('Covid') > 0 || src.indexOf('COVID') > 0){success = true;}
    await driver.sleep(10000)

    if (success) {
    			console.log('VACUNA DISPONIBLE!');
    			let info = await transporter.sendMail({
			        from: '"Servicio de alertas de vacunas" <jaimernandez.94@gmail.com>', 																				
			        to: "notificationemail@domain.com",//  
			        subject: "Alert:  LA VACUNA PARA EL COVID19 ESTA DISPONIBLE EN LA WEB ✔"
			    }); 
    }else {
    	console.log('NO DISPONIBLE');
        driver.navigate().refresh(); 
        compruebaDisponibilidad();
    } 
}

login();
compruebaDisponibilidad();