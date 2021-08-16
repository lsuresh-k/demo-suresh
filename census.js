var gia = (function(gia, $, d3 ){
	'use strict'

	var mapWidth = 0,
			mapHeight = 0,
			mapOrigWidth = undefined,
			censusMap = undefined,
			counties = undefined,
			maxPop = 0,
			mapProjection = undefined,
			ageRanges = [ '10', '20', '30', '40', '50', '60', '70', '80', '80Plus'],
			ageChartH = 100,
			ageChartW = 300,
			ageBarW = 0,
			ageChart = undefined,
			ageScale = undefined,
			ageAxisX = undefined,
			ageAxisY = undefined,
			ageAxisScale = undefined,
			ageChartP = 20,
			currFips =  undefined,
			newtokFips = undefined,
			mapType = 'btn-ak-native',
			mapHeightAdjuster = -900,
			mapWidthAdjuster = 300,
			multiplier = 1;
	var villagePoints = [{ "name": "Cheesh-Na Tribe", "point": [-144.6697, 62.5778], "type": "village", "position": "none" }, { "name": "Native Village of Chitina", "point": [-144.4250, 61.5392], "type": "village", "position": "none" }, { "name": "Native Village of Gakona", "point": [-145.3019, 62.3019], "type": "village", "position": "none" }, { "name": "Native Village of Tazlina", "point": [-145.4153, 62.0492], "type": "village", "position": "none" }, { "name": "Agdaagux Tribe of King Cove", "point": [-162.3181, 55.0722], "type": "village", "position": "none" }, { "name": "Native Village of Akutan", "point": [-165.7731, 54.1356], "type": "village", "position": "none" }, { "name": "Native Village of Atka", "point": [-174.2133, 52.1992], "type": "village", "position": "none" }, { "name": "Native Village of Belkofski", "point": [-162.0305556, 55.0888889], "type": "village", "position": "none" }, { "name": "Native Village of False Pass", "point": [-163.3992, 54.8278], "type": "village", "position": "none" }, { "name": "Native Village of Nelson Lagoon", "point": [-161.2036, 56.0006], "type": "village", "position": "none" }, { "name": "Native Village of Nikolski", "point": [-168.8608, 52.9414], "type": "village", "position": "none" }, { "name": "Pauloff Harbor Village", "point": [-162.6936, 54.4592], "type": "village", "position": "none" }, { "name": "Saint George Island", "point": [-169.5597, 56.6056], "type": "village", "position": "none" }, { "name": "Saint Paul Island", "point": [-170.2667, 57.1833], "type": "village", "position": "none" }, { "name": "Qagan Tayagungin Tribe of Sand Point Village", "point": [-160.509357, 55.316817], "type": "village", "position": "none" }, { "name": "Qawalangin Tribe of Unalaska", "point": [-166.5272, 53.8889], "type": "village", "position": "none" }, { "name": "Native Village of Unga", "point": [-160.5216667, 55.3383333], "type": "village", "position": "none" }, { "name": "Native Village of Barrow Inupiat Traditional Government", "point": [-156.7358, 71.3003], "type": "village", "position": "none" }, { "name": "Kaktovik Village", "point": [-143.6161, 70.1328], "type": "village", "position": "none" }, { "name": "Native Village of Nuiqsut", "point": [-151.005561, 70.209953], "type": "village", "position": "none" }, { "name": "Native Village of Point Hope", "point": [-166.7631, 68.3469], "type": "village", "position": "none" }, { "name": "Native Village of Point Lay", "point": [-163.0086, 69.7411], "type": "village", "position": "none" }, { "name": "Village of Wainwright", "point": [-160.0161, 70.6472], "type": "village", "position": "none" }, { "name": "Native Village of Brevig Mission", "point": [-166.4931, 65.3342], "type": "village", "position": "none" }, { "name": "Chinik Eskimo Community", "point": [-163.0275, 64.5447], "type": "village", "position": "none" }, { "name": "Native Village of Diomede", "point": [-168.951239, 65.757116], "type": "village", "position": "none" }, { "name": "King Island Native Community", "point": [-168.0833, 64.9667], "type": "village", "position": "none" }, { "name": "Native Village of Koyuk", "point": [-161.1586, 64.9311], "type": "village", "position": "none" }, { "name": "Nome Eskimo Community", "point": [-165.3994, 64.5039], "type": "village", "position": "none" }, { "name": "Native Village of Saint Michael", "point": [-162.0531, 63.4711], "type": "village", "position": "none" }, { "name": "Shaktoolik", "point": [-161.1914, 64.3556], "type": "village", "position": "end" }, { "name": "Shishmaref", "point": [-166.0722, 66.2556], "type": "village", "position": "end" }, { "name": "Village of Solomon", "point": [-164.489011, 64.568957], "type": "village", "position": "none" }, { "name": "Stebbins Community Association", "point": [-162.2747, 63.5119], "type": "village", "position": "none" }, { "name": "Native Village of Teller", "point": [-166.3539, 65.2572], "type": "village", "position": "none" }, { "name": "Unalakleet", "point": [-160.7897, 63.8789], "type": "village", "position": "end" }, { "name": "Native Village of Wales", "point": [-168.0892, 65.6122], "type": "village", "position": "none" }, { "name": "Native Village of White Mountain", "point": [-163.4067, 64.6808], "type": "village", "position": "none" }, { "name": "Native Village of Elim", "point": [-162.2567, 64.6178], "type": "village", "position": "none" }, { "name": "Native Village of Gambell", "point": [-171.7008, 63.7761], "type": "village", "position": "none" }, { "name": "Native Village of Savoonga", "point": [-170.4608, 63.6967], "type": "village", "position": "none" }, { "name": "Native Village of Chignik", "point": [-158.4044, 56.2983], "type": "village", "position": "none" }, { "name": "Native Village of Chignik Lagoon", "point": [-158.5350, 56.3075], "type": "village", "position": "none" }, { "name": "Chignik Lake Village", "point": [-158.7817, 56.2694], "type": "village", "position": "none" }, { "name": "Village of Clark’s Point", "point": [-158.5525, 58.8325], "type": "village", "position": "none" }, { "name": "Curyung Tribal Council", "point": [-158.5086, 59.0467], "type": "village", "position": "none" }, { "name": "Egegik Village", "point": [-157.375428, 58.185490], "type": "village", "position": "none" }, { "name": "Ekwok Village", "point": [-157.4853, 59.3492], "type": "village", "position": "none" }, { "name": "Igiugig Village", "point": [-155.9081, 59.3303], "type": "village", "position": "none" }, { "name": "Village of Iliamna", "point": [-154.84, 59.77], "type": "village", "position": "none" }, { "name": "Ivanoff Bay Village", "point": [-159.4833, 55.9000], "type": "village", "position": "none" }, { "name": "Kokhanok Village", "point": [-154.7469, 59.4408], "type": "village", "position": "none" }, { "name": "Levelock Village", "point": [-156.8586, 59.1103], "type": "village", "position": "none" }, { "name": "Manokotak Village", "point": [-159.0558, 58.9811], "type": "village", "position": "none" }, { "name": "Naknek Native Village", "point": [-156.9717, 58.7397], "type": "village", "position": "none" }, { "name": "New Koliganek Village Council ", "point": [-157.2772, 59.7289], "type": "village", "position": "none" }, { "name": "New Stuyahok Village", "point": [-157.3122, 59.4519], "type": "village", "position": "none" }, { "name": "Newhalen Village", "point": [-154.8944, 59.7256], "type": "village", "position": "none" }, { "name": "Nondalton Village", "point": [-154.8517, 59.9669], "type": "village", "position": "none" }, { "name": "Pedro Bay Village", "point": [-154.1325, 59.7822], "type": "village", "position": "none" }, { "name": "Native Village of Perryville", "point": [-159.1511, 55.9136], "type": "village", "position": "none" }, { "name": "Native Village of Pilot Point", "point": [-157.5822, 57.5603], "type": "village", "position": "none" }, { "name": "Native Village of Port Heiden", "point": [-158.6558, 56.9489], "type": "village", "position": "none" }, { "name": "Portage Creek Village", "point": [-157.7167, 58.9061], "type": "village", "position": "none" }, { "name": "South Naknek Village", "point": [-157.0175, 58.7117], "type": "village", "position": "none" }, { "name": "Traditional Village of Togiak", "point": [-160.383186, 59.059134], "type": "village", "position": "none" }, { "name": "Twin Hills Village", "point": [-160.2844, 59.0781], "type": "village", "position": "none" }, { "name": "Ugashik Village", "point": [-157.2689, 57.5342], "type": "village", "position": "none" }, { "name": "Akiachak Native Community", "point": [-161.4314, 60.9094], "type": "village", "position": "none" }, { "name": "Akiak Native Community", "point": [-161.2139, 60.9122], "type": "village", "position": "none" }, { "name": "Village of Alakanuk", "point": [-164.6153, 62.6889], "type": "village", "position": "none" }, { "name": "Algaaciq Native Village", "point": [-163.16133, 62.062578], "type": "village", "position": "none" }, { "name": "Yupiit of Andreafski", "point": [-163.2981, 62.0617], "type": "village", "position": "none" }, { "name": "Village of Aniak", "point": [-159.5503, 61.5789], "type": "village", "position": "none" }, { "name": "Asa'carsarmiut Tribe", "point": [-163.7239, 62.0900], "type": "village", "position": "none" }, { "name": "Village of Atmautluak", "point": [-162.2775, 60.8597], "type": "village", "position": "none" }, { "name": "Village of Chefornak", "point": [-164.2694, 60.1592], "type": "village", "position": "none" }, { "name": "Chevak Native Village", "point": [-165.5786, 61.5278], "type": "village", "position": "none" }, { "name": "Native Village of Chuathbaluk", "point": [-159.2472, 61.5756], "type": "village", "position": "none" }, { "name": "Village of Crooked Creek", "point": [-158.1289, 61.8597], "type": "village", "position": "none" }, { "name": "Native Village of Eek", "point": [-162.0258, 60.2186], "type": "village", "position": "none" }, { "name": "Emmonak Village", "point": [-164.5450, 62.7772], "type": "village", "position": "none" }, { "name": "Native Village of Georgetown", "point": [-157.625532, 61.92806], "type": "village", "position": "none" }, { "name": "Native Village of Goodnews Bay", "point": [-161.5858, 59.1214], "type": "village", "position": "none" }, { "name": "Native Village of Hooper Bay", "point": [-166.0961, 61.5289], "type": "village", "position": "none" }, { "name": "Iqurmuit Traditional Council ", "point": [-161.3342, 61.7856], "type": "village", "position": "none" }, { "name": "Village of Kalskag", "point": [-160.3414, 61.5364], "type": "village", "position": "none" }, { "name": "Native Village of Kasigluk", "point": [-162.5358, 60.8919], "type": "village", "position": "none" }, { "name": "Native Village of Kipnuk", "point": [-164.0439, 59.9375], "type": "village", "position": "none" }, { "name": "Native Village of Kongiganak", "point": [-162.8953, 59.9539], "type": "village", "position": "none" }, { "name": "Village of Kotlik", "point": [-163.5603, 63.0358], "type": "village", "position": "none" }, { "name": "Organized Village of Kwethluk", "point": [-161.4186, 60.8022], "type": "village", "position": "none" }, { "name": "Native Village of Kwigillingok", "point": [-163.1661, 59.8722], "type": "village", "position": "none" }, { "name": "Native Village of Kwinhagak", "point": [-161.902701, 59.753374], "type": "village", "position": "none" }, { "name": "Lime Village", "point": [-155.4908, 61.3414], "type": "village", "position": "none" }, { "name": "Village of Lower Kalskag", "point": [-160.3592, 61.5136], "type": "village", "position": "none" }, { "name": "Native Village of Marshall", "point": [-162.0847, 61.8781], "type": "village", "position": "none" }, { "name": "Native Village of Mekoryuk", "point": [-166.2069, 60.3892], "type": "village", "position": "none" }, { "name": "Native Village of Napaimute", "point": [-158.6667, 61.5333], "type": "village", "position": "none" }, { "name": "Native Village of Napakiak", "point": [-161.9736, 60.6933], "type": "village", "position": "none" }, { "name": "Native Village of Napaskiak", "point": [-161.7608, 60.7069], "type": "village", "position": "none" }, { "name": "Newtok", "point": [-164.644167, 60.944444], "type": "village", "position": "end" }, { "name": "Native Village of Nightmute", "point": [-164.8197, 60.5275], "type": "village", "position": "none" }, { "name": "Nunakauyarmiut Tribe", "point": [-165.1033, 60.5306], "type": "village", "position": "none" }, { "name": "Native Village of Nunapitchuk", "point": [-162.4544, 60.8964], "type": "village", "position": "none" }, { "name": "Orutsararmuit Native Village", "point": [-162.17390, 60.12998], "type": "village", "position": "none" }, { "name": "Oscarville Traditional Village", "point": [-161.7683, 60.7214], "type": "village", "position": "none" }, { "name": "Pilot Station Traditional Village", "point": [-162.8833, 61.9361], "type": "village", "position": "none" }, { "name": "Native Village of Pitka's Point", "point": [-163.2608, 62.0356], "type": "village", "position": "none" }, { "name": "Platinum Traditional Village", "point": [-161.8153, 59.0069], "type": "village", "position": "none" }, { "name": "Village of Red Devil", "point": [-157.3503, 61.7881], "type": "village", "position": "none" }, { "name": "Native Village of Scammon Bay", "point": [-165.5817, 61.8425], "type": "village", "position": "none" }, { "name": "Village of Sleetmute", "point": [-157.1519, 61.6839], "type": "village", "position": "none" }, { "name": "Village of Stony River", "point": [-156.5911, 61.7875], "type": "village", "position": "none" }, { "name": "Tuluksak Native Community", "point": [-160.9606, 61.1025], "type": "village", "position": "none" }, { "name": "Native Village of Tuntutuliak", "point": [-162.6728, 60.3428], "type": "village", "position": "none" }, { "name": "Native Village of Tununak", "point": [-165.2594, 60.5806], "type": "village", "position": "none" }, { "name": "Native Village of Chanega", "point": [-148.0111, 60.0664], "type": "village", "position": "none" }, { "name": "Native Village of Eyak", "point": [-145.590465, 60.524597], "type": "village", "position": "none" }, { "name": "Native Village of Nanwalek ", "point": [-151.9125, 59.3536], "type": "village", "position": "none" }, { "name": "Native Village of Tatitlek", "point": [-146.6772, 60.8669], "type": "village", "position": "none" }, { "name": "Ninilchik Village", "point": [-151.5419, 59.9928], "type": "village", "position": "none" }, { "name": "Seldovia Village Tribe", "point": [-151.7125, 59.4389], "type": "village", "position": "none" }, { "name": "Native Village of Tyonek", "point": [-151.2308, 61.0606], "type": "village", "position": "none" }, { "name": "Alatna Village", "point": [-152.827746, 66.561359], "type": "village", "position": "none" }, { "name": "Allakaket Village", "point": [-152.647692, 66.548786], "type": "village", "position": "none" }, { "name": "Anvik Village", "point": [-160.209237, 62.655659], "type": "village", "position": "none" }, { "name": "Beaver Village", "point": [-147.3963889, 66.3594444], "type": "village", "position": "none" }, { "name": "Birch Creek Tribe", "point": [-145.8153, 66.2567], "type": "village", "position": "none" }, { "name": "Chalkyitsik Village", "point": [-143.7272, 66.6517], "type": "village", "position": "none" }, { "name": "Circle Native Community", "point": [-144.0764, 65.8344], "type": "village", "position": "none" }, { "name": "Native Village of Eagle", "point": [-141.2000, 64.7861], "type": "village", "position": "none" }, { "name": "Evansville Village", "point": [-151.5225, 66.9133], "type": "village", "position": "none" }, { "name": "Native Village of Fort Yukon", "point": [-145.2564, 66.5675], "type": "village", "position": "none" }, { "name": "Galena Village", "point": [-156.885462, 64.740643], "type": "village", "position": "none" }, { "name": "Organized Village of Grayling", "point": [-159.5175, 62.9097222], "type": "village", "position": "none" }, { "name": "Holy Cross Village", "point": [-159.7733, 62.1981], "type": "village", "position": "none" }, { "name": "Hughes Village", "point": [-154.237607, 66.044708], "type": "village", "position": "none" }, { "name": "Huslia Village", "point": [-156.338595, 65.701907], "type": "village", "position": "none" }, { "name": "Village of Kaltag", "point": [-158.7269, 64.3253], "type": "village", "position": "none" }, { "name": "Koyukuk", "point": [-157.70, 64.88], "type": "village", "position": "end" }, { "name": "Manley Hot Springs Village", "point": [-150.6267, 65.0078], "type": "village", "position": "none" }, { "name": "McGrath Native Village", "point": [-155.5772, 62.9519], "type": "village", "position": "none" }, { "name": "Native Village of Minto", "point": [-149.3700, 65.1578], "type": "village", "position": "none" }, { "name": "Nenana Native Association", "point": [-149.0931, 64.5639], "type": "village", "position": "none" }, { "name": "Nikolai Village", "point": [-154.3750, 63.0133], "type": "village", "position": "none" }, { "name": "Northway Village", "point": [-141.937, 62.961], "type": "village", "position": "none" }, { "name": "Nulato Village", "point": [-158.1142, 64.7300], "type": "village", "position": "none" }, { "name": "Rampart Village", "point": [-150.148496, 65.507350], "type": "village", "position": "none" }, { "name": "Native Village of Ruby", "point": [-155.4878, 64.7372], "type": "village", "position": "none" }, { "name": "Shageluk Native Village", "point": [-159.5311, 62.6561], "type": "village", "position": "none" }, { "name": "Native Village of Stevens", "point": [-149.9961111, 61.1741667], "type": "village", "position": "none" }, { "name": "Takotna Village", "point": [-156.088784, 62.982921], "type": "village", "position": "none" }, { "name": "Native Village of Tanacross", "point": [-143.3569, 63.3761], "type": "village", "position": "none" }, { "name": "Native Village of Tanana", "point": [-152.0758, 65.1706], "type": "village", "position": "none" }, { "name": "Telida Village", "point": [-153.284477, 63.379121], "type": "village", "position": "none" }, { "name": "Native Village of Tetlin", "point": [-142.524451, 63.137840], "type": "village", "position": "none" }, { "name": "Village of Afognak", "point": [-152.6053, 58.2317], "type": "village", "position": "none" }, { "name": "Native Village of Akhiok", "point": [-154.1703, 56.9456], "type": "village", "position": "none" }, { "name": "Native Village of Karluk", "point": [-154.3625, 57.5781], "type": "village", "position": "none" }, { "name": "Native Village of Larsen Bay", "point": [-153.9914, 57.5367], "type": "village", "position": "none" }, { "name": "Village of Old Harbor", "point": [-153.2697, 57.2181], "type": "village", "position": "none" }, { "name": "Native Village of Ouzinkie", "point": [-152.540000, 58.140000], "type": "village", "position": "none" }, { "name": "Native Village of Ambler", "point": [-157.8603, 67.0850], "type": "village", "position": "none" }, { "name": "Native Village of Buckland", "point": [-161.1297, 65.9847], "type": "village", "position": "none" }, { "name": "Native Village of Deering", "point": [-162.7183, 66.0758], "type": "village", "position": "none" }, { "name": "Native Village of Kiana", "point": [-160.4303, 66.9717], "type": "village", "position": "none" }, { "name": "Kivalina", "point": [-164.4922, 67.7189], "type": "village", "position": "end" }, { "name": "Native Village of Kobuk", "point": [-156.906829, 66.917579], "type": "village", "position": "none" }, { "name": "Native Village of Kotzebue", "point": [-162.5856, 66.8972], "type": "village", "position": "none" }, { "name": "Native Village of Noatak", "point": [-162.9652778, 67.5711111], "type": "village", "position": "none" }, { "name": "Noorvik Native Community", "point": [-161.0367, 66.8372], "type": "village", "position": "none" }, { "name": "Native Village of Selawik", "point": [-160.013674, 66.597043], "type": "village", "position": "none" }, { "name": "Native Village of Shungnak", "point": [-157.1375, 66.8858], "type": "village", "position": "none" }, { "name": "Angoon Community Association", "point": [-134.5736, 57.4969], "type": "village", "position": "none" }, { "name": "Chilkat Indian Village", "point": [-135.8933, 59.4000], "type": "village", "position": "none" }, { "name": "Craig Community Association", "point": [-133.1411, 55.4769], "type": "village", "position": "none" }, { "name": "Hoonah Indian Association", "point": [-135.4364, 58.1094], "type": "village", "position": "none" }, { "name": "Hydaburg Cooperative Association", "point": [-132.8208, 55.2047], "type": "village", "position": "none" }, { "name": "Organized Village of Kake", "point": [-133.9339, 56.9708], "type": "village", "position": "none" }, { "name": "Organized Village of Kasaan", "point": [-132.4019, 55.5417], "type": "village", "position": "none" }, { "name": "Klawock Cooperative Association", "point": [-133.0853, 55.5550], "type": "village", "position": "none" }, { "name": "Organized Village of Saxman", "point": [-131.5983, 55.3206], "type": "village", "position": "none" }, { "name": "Yakutat Tlingit Tribe", "point": [-140.2712, 59.7935], "type": "village", "position": "none" }, { "name": "Juneau", "point": [-134.5116, 58.3514], "type": "city", "position": "end" }, { "name": "Anchorage", "point": [-149.7621, 61.1919], "type": "city", "position": "end" }, { "name": "Fairbanks", "point": [-147.7164, 64.8378], "type": "city", "position": "end" }]


	var popScale = 	d3.scale.linear()
		.domain([ 0, maxPop])
		.range([ "white", "steelblue"]);

	gia.initMap = function(){
		setDimensions();
		censusMap = d3.select("#map-census").append("svg")
			.attr('id', 'map-census-svg')
			.attr("width", mapWidth)
			.attr("height", mapHeight)
			.append('g')

		$.getScript("./interactive/data/ak.census.js", initCensus)


	}

	gia.preInit = function(){
		var tempWidth = $('#map-census-container').width();

		var tempMultiplier = 0;

		if(tempWidth < 1200){
			tempMultiplier = 3/4
		} else {
			tempMultiplier = 9/16
		}

		var tempHeight = tempWidth * tempMultiplier;

		$('#map-census').css('height', tempHeight)

	}

	var initCensus = function(){


		setResizer();

		generateAgeChart()
		drawMap()
		$('#map-census').css('height', 'auto')
		$('.ak-map-btn').click(function(){

			$('.ak-map-btn').removeClass('gia-tabbed-button-selected')
			$(this).addClass('gia-tabbed-button-selected')

			mapType = $(this).attr('id')
			paintAlaska()

		})


	}

	var setResizer = function(){
		$(window).resize(function() {
			setDimensions();



			d3.select("#map-census-svg").attr("width", mapWidth)
				.attr("height", mapHeight);


			censusMap.attr("transform", 'scale(' + mapWidth/mapOrigWidth + ')')
		});
	}


	var setDimensions = function(){



		mapWidth = $(window).width();



		if(mapWidth < 1200){
			multiplier = 3/4
		} else {
			multiplier = 9/16
		}
		mapHeightAdjuster = -mapWidth + 100
		mapWidthAdjuster = mapWidth - 100
		// if(mapWidth >700 && mapWidth < 940){
		// 		mapWidth = 940;
		// 	} else if(mapWidth < 700){
		// 		mapWidth = $(window).width() - 40;
		// 		mapHeightAdjuster = -60
		// 	} else if (mapWidth >= 940 && mapWidth < 1200){
		// 		multiplier = .65
		// 		mapHeightAdjuster = -900;
		// 		console.log('here')
		// 	}  else {
		// 		multiplier = .6
		// 		mapHeightAdjuster = -1300;
		// 		
		// 	}
		// 	
		// 	if( mapWidth > 940){
		// 		
		// 	}


		mapHeight = mapWidth * multiplier;




		if(mapOrigWidth == undefined){
			mapOrigWidth = mapWidth;
		}
	}

	var generateAgeChart = function(){

		for(var f in gia.akcensus){
			for(var a = 0; a < ageRanges.length; a ++){
				if(gia['akcensus'][f][ 'age' + ageRanges[a] + 'Pct'  ] > maxPop){
					maxPop = gia['akcensus'][f][ 'age' + ageRanges[a] + 'Pct'  ]
				}
			}
		}

		setAgeScales();
		ageChart = d3.select("#map-census-chart").append("svg")
			.attr("width", ageChartW)
			.attr("height", ageChartH)
			.append('svg:g')
			.attr('transform', 'translate('+ (ageChartP) +',0)')

		ageChart.append('svg:g')
			.attr('class', 'chart-axis')
			.attr('id', 'chart-age-yaxis')
			.attr('transform', 'translate(20,'+ (ageChartP  ) +')')
			.call(ageAxisY);


		ageChart.selectAll('#chart-age-yaxis line')
			.attr("x1", 0)
			.attr("x2", ageChartW - ageChartP-ageChartP-ageChartP)
			.style("stroke", "#ccc");

		var xaxis = ageChart.append('svg:g')
			.attr('class', 'chart-axis')
			.attr('id', 'chart-age-xaxis')
			.attr('transform', 'translate(' + ageChartP +',' + (ageChartH - ageChartP/3) +')')

		xaxis.selectAll('.age-axis-x')
			.data(ageRanges)
			.enter().append('text')
			.attr('x', function(i,d){
				return ageBarW * (d + .5)
			})
			.attr('text-anchor', 'middle')
			.attr('class', 'age-axis-x')
			.text(function(d){
				if(d == '80Plus'){
					d = '80+'
				} else {
					d = d-10
					d = d + 's'
				}

				return d;
			})


		ageChart.selectAll('.age-bar')
			.data(ageRanges)
			.enter()
			.append('rect')
			.attr('class', 'age-bar')
			.attr('width', ageBarW-1)
			.attr('y', ageChartH - ageChartP)
			.attr('x', function(d,i){
				return ageChartP +  i * ageBarW
			})





	}

	var setAgeScales = function(){
		ageBarW = (ageChartW-ageChartP -ageChartP-ageChartP) / ageRanges.length
		ageScale = d3.scale.linear()
			.domain([0, 30])
			.range([0,ageChartH - 2*ageChartP]);
		ageAxisScale = d3.scale.linear()
			.domain([30,0])
			.range([0,ageChartH - 2*ageChartP]);


		ageAxisY = d3.svg.axis()
			.scale(ageAxisScale)
			.orient("left")
			.ticks(3)
			.tickFormat(function(d){
				return d + '%';
			})

		ageAxisX = d3.svg.axis()
			.scale(ageRanges)
			.orient("bottom")
			.ticks(ageRanges.length)


	}



	var populateChart = function(obj){
		censusMap.selectAll(".ak-shape")
			.style('stroke', '#fff')
		currFips = obj;

		// hightlight hovered area
		d3.select( '#shape-' + obj['NAME10'].replace(/\ /g, '-')  ).style('stroke', 'black')
		var chartLabel = ''
		var chartLabelValue = ''
		if( mapType == 'btn-pop-density'){
			chartLabel = 'Population density (sq mi)'
			chartLabelValue = Math.round(obj['census']['popDensity'] * 1000)/1000
		} else if( mapType == 'btn-ak-native'){
			chartLabel = 'Pct. Native Alaskan'
			chartLabelValue = obj['census']['nativePopPct'] + '%'
		} else if( mapType == 'btn-ak-income'){
			chartLabel = 'Median household income'
			chartLabelValue = '$' + addCommas(obj['census']['medianHouseholdIncome'])
		}
		$('#popup-shape-info .map-popup-type').text(chartLabel)
		$('#popup-shape-info .map-popup-value').text(chartLabelValue)

		$('#popup-total-pop .map-popup-value').text(addCommas(obj['census']['popTotal']))

		$('#popup-shape-info #map-popup-color').css('background-color', d3.select( '#shape-' + obj['NAME10'].replace(/\ /g, '-')  ).style('fill'))


		censusMap.node().appendChild( d3.select( '#shape-' + obj['NAME10'].replace(/\ /g, '-')  ).node() )
		reOrderCities();
		$('#popup-title').text(obj['NAMELSAD10'])



		// redraw the bar graph
		var rect = ageChart.selectAll('.age-bar')
			.data(ageRanges)

		rect.enter()
			.append('rect')
			.attr('class', 'age-bar')
			.attr('width', ageBarW-1)

			.attr('x', function(d,i){
				return ageChartP +  i * ageBarW
			})


		// add animation
		rect.transition()
			.duration(500).attr('height', function(d){
			return ageScale(obj['census']['age' + d + 'Pct'])
		})
			.attr('y', function(d){
				return ageChartH - ageChartP - ageScale(obj['census']['age' + d + 'Pct']);
			})

	}



	var drawMap = function(){





		//merge census data and shape data

		gia.aktopo = processData(gia.aktopo)



		mapProjection = d3.geo.satellite()
			.scale(1)
			.rotate([135,-60,10])
			.center([-15,65])
			.clipAngle(142 / Math.PI );



		var path = d3.geo.path()
			.projection(mapProjection);


		var b = path.bounds(topojson.object(gia.aktopo, gia.aktopo.objects.alaska))

		//c = path.centroid(topojson.object(ak, ak.objects.alaska) )

		var magicScale = mapWidth*1.7
		//find out what number makes the scale be this

		var multiplier = magicScale / (b[1][0] - b[0][0])
		mapProjection
			.scale(magicScale)
			.translate([  (mapWidth + mapWidthAdjuster - magicScale * ((b[1][0] - b[0][0])/2) ) / 2 , (mapHeightAdjuster+mapHeight - magicScale * ((b[1][1] - b[0][1])/2) ) / 2]);

		var graticule = d3.geo.graticule()


			.step([6,6]);




		var censusDefs = censusMap.append("defs")


		var gradient = censusDefs.append("radialGradient")
			.attr("id", "gradient")
			.attr("cx", "75%")
			.attr("cy", "25%");

		gradient.append("stop")
			.attr("offset", "5%")
			.attr("stop-color", "#A3BED6");

		gradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#DAE1EF");
		var globe_shading = censusDefs.append("radialGradient")
			.attr("id", "globe_shading")
			.attr("cx", "0%")
			.attr("cy", "40%");
		globe_shading.append("stop")
			.attr("offset","50%").attr("stop-color", "#f6f6f6")
			.attr("stop-opacity",".5")
		globe_shading.append("stop")
			.attr("offset","100%").attr("stop-color", "#fff")
			.attr("stop-opacity","0.8")


		censusDefs.append("path")
			.datum({type: "Sphere"})
			.attr("id", "census-sphere")
			.attr("d", path)
			.style('fill', 'url(#globe_shading)')


		censusMap.append("use")
			.attr("class", ".style('fill', 'url(#globe_shading)');")
			.attr("xlink:href", "#census-sphere");



		var grat = censusMap.append("path")
			.datum(graticule)
			.attr('id', 'grat')
			.attr("class", "graticule")
			.attr("d", path)
		//.style("fill", "url(#gradient)");
		//console.log( d3.geo.bounds(grat))

		var filter = censusDefs.append("svg:filter")
			.attr("id", "country-glow")

		filter.append("svg:feGaussianBlur")
			.attr("stdDeviation", 2)
			.attr("result", "blur");
		filter.append("svg:feSpecularLIghting")
			.attr("in", "blur")

			.attr("result", "specOut")
		var merge = filter.append("svg:feMerge")
		merge.append('svg:feMergeNode')
		merge.append('svg:feMergeNode')
			.attr('in', 'SourceGraphic')





		censusMap.append("path")
			.datum(topojson.object(gia.aktopo, gia.aktopo.objects.alaska))
			.attr("d", path)
			.attr('class','other-country-bg')
			.style('filter', 'url(#country-glow)');




		censusMap.selectAll(".ak-shape")
		// draw Alaska map
			.data(topojson.object(gia.aktopo, gia.aktopo.objects.alaska).geometries)
			.enter().append("path")
			.attr('class','ak-shape')
			.attr("d", path)
			.attr('id', function(d){
				return  'shape-' + d.properties['NAME10'].replace(/\ /g, '-');
			})
			.style('fill', '#eee')
			// bind event listener
			.on("mouseover", showPopulationData)
			.on("mouseout", hidePopulationData)




		// draw Canada
		censusMap.append("path")
			.datum(topojson.object(gia.canadatopo, gia.canadatopo.objects.canada) )
			.attr('class','other-country-bg')
			.attr("d", path)
			.style('filter', 'url(#country-glow)');

		censusMap.append("path")
			.datum(topojson.object(gia.canadatopo, gia.canadatopo.objects.canada) )
			.attr('class','other-country')
			.attr("d", path)





		// Draw Russia
		censusMap.append("path")
			.datum(topojson.object(gia.russiatopo, gia.russiatopo.objects['russia']) )
			.attr('class','other-country-bg')
			.attr("d", path)
			.style('filter', 'url(#country-glow)');

		censusMap.append("path")
			.datum(topojson.object(gia.russiatopo, gia.russiatopo.objects['russia']) )
			.attr('class','other-country')
			.attr("d", path)
		reOrderAlaska();

	}



	var showPopulationData = function(d){


		populateChart(d['properties'])

	}

	var hidePopulationData = function(d){
		populateChart(newtokFips)

	}


	var reOrderAlaska = function (){
		censusMap.selectAll(".ak-shape")
			.each(function(d){
				//console.log(d.properties['NAME10'])
				censusMap.node().appendChild(this)
			})


		addCities();

	}

	var reOrderCities = function(){
		censusMap.selectAll("g.map-marker-group")
			.each(function(d){
				//console.log(d.properties['NAME10'])
				censusMap.node().appendChild(this)
			})
	}

	var addCities = function(){

		var displayWithLabels = []
		var displayWithoutLabels = []
		for(var c = 0; c < villagePoints.length; c++){
			villagePoints[c]['cords'] = mapProjection(villagePoints[c]['point']);
			if(villagePoints[c]['position'] == 'none'){
				displayWithoutLabels.push( villagePoints[c])
			} else {
				displayWithLabels.push( villagePoints[c])
			}


		}

		var mapPointsNoLabels = censusMap.selectAll('g.map-marker-group')
			.data(displayWithoutLabels)
			.enter()
			.append('g')
			.attr('class', 'map-marker-group')


		mapPointsNoLabels.append('svg:circle')
			.attr('class', function(d){
				return 'marker map-marker-' + d['type']
			})
			.attr('cx', function(d){
				return d['cords'][0]
			})
			.attr('cy', function(d){
				return d['cords'][1]
			})
			.attr('r', 	function(d){
				if(mapWidth > 700){
					return 2;
				} else {
					return 1;
				}
			});

		var mapPoints = censusMap.selectAll('g.map-marker-group-text')
			.data(displayWithLabels)
			.enter()
			.append('g')
			.attr('class', 'map-marker-group')


		mapPoints.append('svg:circle')
			.attr('class', function(d){
				return 'marker map-marker-' + d['type']
			})
			.attr('cx', function(d){
				return d['cords'][0]
			})
			.attr('cy', function(d){
				return d['cords'][1]
			})
			.attr('r', function(d){
				if(mapWidth > 700){
					return 2;
				} else {
					return 1;
				}
			});

		mapPoints.append('svg:text')
			.attr('x', function(d){
				return d['cords'][0] -5
			})
			.attr('y', 	function(d){
				return d['cords'][1] +5
			})
			.attr('text-anchor', 		function(d){
				return d['position']
			})
			.attr('class', 'census-map-labels-bg')
			.text(function(d){
				return d['name']
			})

		mapPoints.append('svg:text')
			.attr('x', function(d){
				return d['cords'][0] -5
			})
			.attr('y', 	function(d){
				return d['cords'][1] +5
			})
			.attr('text-anchor', 		function(d){
				return d['position']
			})
			.attr('class', 'census-map-labels')
			.text(function(d){
				return d['name']
			})






		reOrderCities()
		paintAlaska()
	}



	var densityRange = [
		{
			value: 0,
			color: '#eee'
		},
		{
			value: .1,
			color: '#FFDEDE'
		},
		{
			value: 1,
			color: '#F6B4B4'
		},
		{
			value: 10,
			color: '#E87474'
		},
		{
			value: 100,
			color: '#CC2F27'
		},
		{
			value: 1000,
			color: '#871D1B'
		}
	]

	var nativeRange = [
		{
			value: 0,
			color: '#eee'
		},
		{
			value: 20,
			color: '#E6BED6'
		},
		{
			value: 40,
			color: '#E39AC5'
		},
		{
			value: 60,
			color: '#CC76A8'
		},
		{
			value: 80,
			color: '#B04D84'
		},
		{
			value: 100,
			color: '#821B54'
		}
	]

	var incomeRange = [
		{
			value: 0,
			color: '#eee'
		},
		{
			value: 20000,
			color: '#E6EDD8'
		},
		{
			value: 40000,
			color: '#CADBA6'
		},
		{
			value: 60000,
			color: '#9DB270'
		},
		{
			value: 80000,
			color: '#5E843A'
		},
		{
			value: 100000,
			color: '#3C602E'
		}
	]

	var processData = function(ak){
		//determine popDensity Max
		var areaConversion = 3.8610e-7


		for(var s = 0; s < ak.objects.alaska['geometries'].length; s++){
			ak.objects.alaska['geometries'][s]['properties']['census'] =  gia.akcensus[ ak.objects.alaska['geometries'][s]['properties']['GEOID10'] ]

			if ( ak.objects.alaska['geometries'][s]['properties']['GEOID10'] == '02270'){
				currFips = newtokFips = ak.objects.alaska['geometries'][s]['properties']
			}

			var currDensity = ak.objects.alaska['geometries'][s]['properties']['census']['popDensity'] = ak.objects.alaska['geometries'][s]['properties']['census']['popTotal'] / (ak.objects.alaska['geometries'][s]['properties']['ALAND10'] * areaConversion)


		}


		return ak;
	}



	var paintAlaska = function(){

		censusMap.selectAll(".ak-shape")

			.style('fill', function(d){
				var color = '#eee';
				if( mapType == 'btn-pop-density'){
					color =  densityRange[0]['color']
					for( var r = 1; r < densityRange.length; r++ ){
						if ( densityRange[r-1]['value'] < d['properties']['census']['popDensity'] && d['properties']['census']['popDensity'] <= densityRange[r]['value']){
							color =  densityRange[r]['color']
							break;
						}
					}

				} else if( mapType == 'btn-ak-native'){

					color =  nativeRange[0]['color']
					for( var r = 1; r < nativeRange.length; r++ ){
						if ( nativeRange[r-1]['value'] < d['properties']['census']['nativePopPct'] && d['properties']['census']['nativePopPct'] <= nativeRange[r]['value']){
							color =  nativeRange[r]['color']
							break;
						}
					}

					//color = nativeColor(d['properties']['census']['nativePopPct']);



				} else if( mapType == 'btn-ak-income'){
					color =  incomeRange[0]['color']
					for( var r = 1; r < nativeRange.length; r++ ){
						if ( incomeRange[r-1]['value'] < d['properties']['census']['medianHouseholdIncome'] && d['properties']['census']['medianHouseholdIncome'] <= incomeRange[r]['value']){
							color =  incomeRange[r]['color']
							break;
						}
					}
				}
				return color;


			})

		//populate it with NewTok

		populateChart(currFips)
		populateKey()
	}

	var populateKey = function(){
		for(var n = 0; n < 6; n++){
			var color = '#ccc'
			var value = ''
			var header = ''
			if( mapType == 'btn-pop-density'){
				color = densityRange[n]['color']
				value = addCommas(densityRange[n]['value'])
				header = 'People per sq. mile'
			} else if( mapType == 'btn-ak-native'){
				color = nativeRange[n]['color']
				value = nativeRange[n]['value']
				header = 'Percent native Alaskan'
				if(n == 0){
					value += '%'
				}
			} else if( mapType == 'btn-ak-income'){
				color = incomeRange[n]['color']
				value = incomeRange[n]['value']/1000
				header = 'Median income in US dollars'
				if(n == 0){
					value += 'k'
				}

			}
			$('#key-header').text(header)
			$('#mk-' + String(n+1) + ' .key-color-block').css('background-color', color)
			$('#mk-' + String(n+1) + ' .key-value').text(value)
		}

	}



	var addCommas = function (nStr)
	{
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

	return gia;

}(gia || {}, jQuery, d3 ))

gia.preInit();

jQuery(document).ready(function(){
	gia.initMap();
})

