//это кусок кода из Романа видео. Этот код импортирует данные из формаа json (как я поняла. Писала не сама)
let cities = [];
let specializations = [];
let person = [];


Promise.all(
    [
        fetch("cities.json"),
        fetch("person.json"),
        fetch("specializations.json"),
    ]
).then(async ([citiesResponse, personResponse, specializationsResponse]) => {
    const citiesJson = await citiesResponse.json();
    const personJson = await personResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [citiesJson, personJson, specializationsJson]
})
    .then (response => {
        cities = response[0];
        person = response[1];
        specializations = response[2];

// Создаю функцию
        function getInfo() {
            const fullName = `${this.personal.firstName} ${this.personal.lastName}`;//создаю переменную, чтоб брала данные об имени и фамилии
            const city = cities.find(city => city.id === this.personal.locationId)?.name || 'Unknown City';//создаю пременную город и ищу методом find, в
            //скобках сопоставляю  id из папки city и id из locationId
            return `${fullName}, ${city}`;//возвращаю эти переменные
        }

        if (person.length > 0) {//прохожусь по массиву person
            const firstPersonInfo = getInfo.call(person[0]);//это функция call, позволяет вызывать функцию уже созданную
            console.log(firstPersonInfo);
        }

        const designersWithFigma = person.filter(person => {
            return person.personal.specializationId === 3 && person.skills.some(skill => skill.name === 'Figma');

        });

        console.log("Designers with Figma skills:");
        designersWithFigma.forEach(person => {
            const personInfo = getInfo.call(person);
            console.log(personInfo);

        });
        const developerWithReact = person.find(person => {
            return person.personal.specializationId === 1 && person.skills.some(skill => skill.name === 'React');
        });


        if (developerWithReact) {
            const developerInfo = getInfo.call(developerWithReact);
            console.log("Developer with React skills:");
            console.log(developerInfo);
        } else {
            console.log("Не найдено разработчика, владеющего React.");
        }


        function calculateAge(birthday) {
            let year = +birthday.split('.')[2];
            let date = new Date();
            let month = +birthday.split('.')[1];

            let age =  date.getFullYear()-year;
            const monthDiff =  date.getMonth() - (month - 1);
            if (monthDiff < 0 || (monthDiff === 0 &&  date.getDate() < +birthday.split('.')[0])) {
                age--;
            }
            return age;
        }


        const allAdults = person.every(person => {
            const age = calculateAge(person.personal.birthday);
            return age >= 18;
        });

        if (allAdults) {
            console.log("Все пользователи старше 18 лет.");
        } else {
            console.log("Не все пользователи старше 18 лет");
        }

        let backend = specializations.find(spec => spec.name.toLowerCase() == 'backend');
        let cityMoscow = cities.find(city => city.name.toLowerCase() == 'москва');
        console.log('Backend-разработчики из Москвы, которые ищут работу на полный день: ')
        const backendDevelopers = person.filter(person => {
            return person.personal.specializationId === backend.id
                && person.personal.locationId === cityMoscow.id
                && person.request.some(request => request.name === 'Тип занятости' && request.value === 'Полная');

        });

             backendDevelopers.sort((a, b) => {
                 const salaryA = a.request.find(request => request.name === 'Зарплата');
                 const salaryB = b.request.find(request => request.name === 'Зарплата');

                 return salaryA.value - salaryB.value
             });

              backendDevelopers.forEach(person => {
                  const personInfo = getInfo.call(person);
                  const salary = person.request.find(request => request.name === 'Зарплата').value;
                  console.log(`${personInfo},${salary}`);
              });



        const designersWithSkills = person.filter(person => {

            const isDesigner = person.personal.specializationId === 3;


            const hasPhotoshopSkill = person.skills.some(skill => skill.name === 'Photoshop' && skill.level >= 6);
            const hasFigmaSkill = person.skills.some(skill => skill.name === 'Figma' && skill.level >= 6);

            return isDesigner && hasPhotoshopSkill && hasFigmaSkill;
        });


        console.log("Дизайнеры, владеющие Photoshop и Figma на уровне не ниже 6 баллов:");
        designersWithSkills.forEach(person => {
            console.log(`${person.personal.firstName} ${person.personal.lastName}`);
        });

        const bestFigmaDesigner = person.reduce((bestDesigner, currentPerson) => {
            if (
                currentPerson.personal.specializationId === 3 && // дизайнер
                currentPerson.skills.some(skill => skill.name === 'Figma') &&
                (!bestDesigner || bestDesigner.skills.find(skill => skill.name === 'Figma').level < currentPerson.skills.find(skill => skill.name === 'Figma').level)
            ) {
                return currentPerson;
            }
            return bestDesigner;
        }, null);


        const bestAngularDeveloper = person.reduce((bestDeveloper, currentPerson) => {
            if (
                currentPerson.personal.specializationId === 1 && // frontend разработчик
                currentPerson.skills.some(skill => skill.name === 'Angular') &&
                (!bestDeveloper || bestDeveloper.skills.find(skill => skill.name === 'Angular').level < currentPerson.skills.find(skill => skill.name === 'Angular').level)
            ) {
                return currentPerson;
            }
            return bestDeveloper;
        }, null);


        const bestGoBackendDeveloper = person.reduce((bestDeveloper, currentPerson) => {
            if (
                currentPerson.personal.specializationId === 2 &&
                currentPerson.skills.some(skill => skill.name === 'Go') &&
                (!bestDeveloper || bestDeveloper.skills.find(skill => skill.name === 'Go').level < currentPerson.skills.find(skill => skill.name === 'Go').level)
            ) {
                return currentPerson;
            }
            return bestDeveloper;
        }, null);


        console.log("Команда разработки:");

        if (bestFigmaDesigner) {
            console.log("Дизайнер с лучшим владением Figma:");
            console.log(getInfo.call(bestFigmaDesigner));
        } else {
            console.log("Не найден дизайнер с владением Figma.");
        }

        if (bestAngularDeveloper) {
            console.log("Frontend разработчик с лучшим владением Angular:");
            console.log(getInfo.call(bestAngularDeveloper));
        } else {
            console.log("Не найден frontend разработчик с владением Angular.");
        }

        if (bestGoBackendDeveloper) {
            console.log("Backend разработчик на Go с наивысшими навыками:");
            console.log(getInfo.call(bestGoBackendDeveloper));
        } else {
            console.log("Не найден backend разработчик на Go.");
        }
    });















